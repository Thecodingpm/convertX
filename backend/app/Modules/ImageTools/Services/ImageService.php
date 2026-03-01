<?php

namespace App\Modules\ImageTools\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class ImageService
{
    // Full absolute paths — Laravel Process doesn't inherit shell PATH
    private string $magick = 'magick';

    /**
     * Run an ImageMagick command safely.
     * $args must already have file paths escaped via escapeshellarg().
     */
    private function run(string $args): void
    {
        $cmd    = escapeshellarg($this->magick) . " {$args}";
        $result = Process::run($cmd);

        if ($result->failed()) {
            // Try legacy 'convert' binary as fallback
            $cmd2    = escapeshellarg('convert') . " {$args}";
            $result2 = Process::run($cmd2);

            if ($result2->failed()) {
                Log::error('ImageMagick command failed', [
                    'args'  => $args,
                    'error' => $result->errorOutput() ?: $result2->errorOutput(),
                ]);
                throw new \RuntimeException('Image processing failed: ' . ($result->errorOutput() ?: $result2->errorOutput()));
            }
        }
    }

    public function jpgToPng(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function pngToJpg(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' -background white -flatten ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function toWebp(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' -quality 82 ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function webpToJpg(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' -background white -flatten -quality 90 ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function resize(string $inputPath, string $outputPath, int $width, int $height): string
    {
        $this->run(escapeshellarg($inputPath) . " -resize {$width}x{$height} " . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function compress(string $inputPath, string $outputPath, int $quality = 75): string
    {
        $this->run(escapeshellarg($inputPath) . " -quality {$quality} -strip " . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function crop(string $inputPath, string $outputPath, int $width, int $height, int $x = 0, int $y = 0): string
    {
        $geometry = "{$width}x{$height}+{$x}+{$y}";
        $this->run(escapeshellarg($inputPath) . " -crop {$geometry} +repage " . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function rotate(string $inputPath, string $outputPath, int $degrees): string
    {
        $this->run(escapeshellarg($inputPath) . " -rotate {$degrees} " . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function toPdf(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function flip(string $inputPath, string $outputPath, string $direction = 'horizontal'): string
    {
        $flag = $direction === 'vertical' ? '-flip' : '-flop';
        $this->run(escapeshellarg($inputPath) . " {$flag} " . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function bmpToPng(string $inputPath, string $outputPath): string
    {
        $this->run(escapeshellarg($inputPath) . ' ' . escapeshellarg($outputPath));
        return $outputPath;
    }

    public function removeBackground(string $inputPath, string $outputPath): string
    {
        $serviceUrl = rtrim(config('services.bg_remover.url', env('BG_REMOVER_URL', '')), '/');

        if (empty($serviceUrl)) {
            // No AI service configured – fall back to simple ImageMagick (limited quality)
            Log::warning('BG_REMOVER_URL not set. Falling back to ImageMagick transparent-white method.');
            $this->run(escapeshellarg($inputPath) . ' -fuzz 15% -transparent white ' . escapeshellarg($outputPath));
            return $outputPath;
        }

        try {
            Log::info('Sending image to AI bg-remover service', ['url' => $serviceUrl]);

            $response = Http::timeout(120)  // AI can take up to 30s for large images
                ->attach('file', file_get_contents($inputPath), basename($inputPath))
                ->post($serviceUrl . '/remove-bg');

            if ($response->successful()) {
                file_put_contents($outputPath, $response->body());
                Log::info('AI background removal successful', ['output' => $outputPath]);
                return $outputPath;
            }

            Log::error('AI bg-remover returned error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \RuntimeException('AI background removal service returned HTTP ' . $response->status());

        } catch (ConnectionException $e) {
            Log::error('Could not connect to AI bg-remover service', ['error' => $e->getMessage()]);
            throw new \RuntimeException('Background removal service is unavailable. Please try again later.');
        }
    }

    public function getMetadata(string $inputPath): array
    {
        $result = Process::run(escapeshellarg($this->magick) . ' identify -verbose ' . escapeshellarg($inputPath));
        if ($result->failed()) {
            return ['error' => 'Could not read metadata'];
        }
        $metadata = [];
        foreach (explode("\n", $result->output()) as $line) {
            $line = trim($line);
            if (str_contains($line, ':')) {
                [$key, $value] = explode(':', $line, 2);
                $metadata[trim($key)] = trim($value);
            }
        }
        return $metadata;
    }
}
