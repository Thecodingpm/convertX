<?php

namespace App\Modules\MediaTools\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class MediaService
{
    // Full absolute paths — Laravel Process doesn't inherit shell PATH
    private string $ffmpeg  = 'ffmpeg';
    private string $ffprobe = 'ffprobe';

    public function mp3ToWav(string $inputPath, string $outputPath): string
    {
        return $this->run(['-i', $inputPath, $outputPath], $outputPath, 'MP3 to WAV');
    }

    public function wavToMp3(string $inputPath, string $outputPath, int $bitrate = 192): string
    {
        return $this->run(['-i', $inputPath, '-codec:a', 'libmp3lame', '-b:a', "{$bitrate}k", $outputPath], $outputPath, 'WAV to MP3');
    }

    public function extractAudio(string $inputPath, string $outputPath, string $format = 'mp3'): string
    {
        $codec = $format === 'mp3' ? 'libmp3lame' : 'pcm_s16le';
        return $this->run(['-i', $inputPath, '-vn', '-acodec', $codec, $outputPath], $outputPath, 'Extract audio');
    }

    public function mp4ToAvi(string $inputPath, string $outputPath): string
    {
        return $this->run(['-i', $inputPath, '-c:v', 'mpeg4', '-c:a', 'libmp3lame', '-q:v', '5', $outputPath], $outputPath, 'MP4 to AVI');
    }

    public function compressVideo(string $inputPath, string $outputPath, string $quality = 'medium'): string
    {
        $crf = match ($quality) {
            'low'    => '35',
            'high'   => '20',
            default  => '28',
        };
        return $this->run(['-i', $inputPath, '-vcodec', 'libx264', '-crf', $crf, '-preset', 'medium', '-acodec', 'aac', $outputPath], $outputPath, 'Video compression');
    }

    public function trimAudio(string $inputPath, string $outputPath, string $start, string $duration): string
    {
        return $this->run(['-i', $inputPath, '-ss', $start, '-t', $duration, '-acodec', 'copy', $outputPath], $outputPath, 'Trim audio');
    }

    public function trimVideo(string $inputPath, string $outputPath, string $start, string $duration): string
    {
        return $this->run(['-i', $inputPath, '-ss', $start, '-t', $duration, '-c', 'copy', $outputPath], $outputPath, 'Trim video');
    }

    public function videoToGif(string $inputPath, string $outputPath, int $fps = 10, int $width = 480): string
    {
        $palette = sys_get_temp_dir() . '/palette_' . uniqid() . '.png';

        // Step 1: generate palette
        $this->run(
            ['-i', $inputPath, '-vf', "fps={$fps},scale={$width}:-1:flags=lanczos,palettegen", $palette],
            $palette, 'GIF palette gen', false
        );

        // Step 2: generate GIF using palette
        $result = $this->run(
            ['-i', $inputPath, '-i', $palette, '-lavfi', "fps={$fps},scale={$width}:-1:flags=lanczos [x]; [x][1:v] paletteuse", $outputPath],
            $outputPath, 'Video to GIF'
        );

        @unlink($palette);
        return $result;
    }

    public function audioToMp4(string $inputPath, string $outputPath): string
    {
        return $this->run(
            ['-i', $inputPath, '-f', 'lavfi', '-i', 'color=c=black:s=1280x720:r=24', '-shortest', '-map', '0:a', '-map', '1:v', '-c:v', 'libx264', '-c:a', 'aac', $outputPath],
            $outputPath, 'Audio to MP4'
        );
    }

    public function gifToMp4(string $inputPath, string $outputPath): string
    {
        return $this->run(
            ['-i', $inputPath, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', $outputPath],
            $outputPath, 'GIF to MP4'
        );
    }

    public function mp4ToMp3(string $inputPath, string $outputPath): string
    {
        return $this->run(['-i', $inputPath, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', $outputPath], $outputPath, 'MP4 to MP3');
    }

    public function changeAudioSpeed(string $inputPath, string $outputPath, float $speed = 1.5): string
    {
        if ($speed <= 2.0 && $speed >= 0.5) {
            $filter = "atempo={$speed}";
        } elseif ($speed > 2.0) {
            $filter = 'atempo=2.0,atempo=' . ($speed / 2.0);
        } else {
            $filter = 'atempo=0.5,atempo=' . ($speed / 0.5);
        }
        return $this->run(['-i', $inputPath, '-filter:a', $filter, $outputPath], $outputPath, 'Change audio speed');
    }

    public function getMetadata(string $inputPath): array
    {
        $result = Process::run(
            escapeshellarg($this->ffprobe) . ' -v quiet -print_format json -show_format -show_streams ' . escapeshellarg($inputPath)
        );

        if ($result->failed()) {
            return ['error' => 'Could not read metadata'];
        }

        return json_decode($result->output(), true) ?? [];
    }

    /**
     * Build and run an ffmpeg command from an array of arguments.
     * Each element is individually shell-escaped, so spaces in filenames work.
     */
    protected function run(array $args, string $outputPath, string $operation, bool $throwOnFail = true): string
    {
        $cmd = escapeshellarg($this->ffmpeg) . ' -y ' . implode(' ', array_map('escapeshellarg', $args));
        $result = Process::run($cmd);

        // FFmpeg writes standard output to stderr even on success. 
        // We consider it a failure if the process truly failed or if the output file wasn't created.
        if ($throwOnFail && ($result->failed() || !file_exists($outputPath))) {
            Log::error("{$operation} failed", ['error' => $result->errorOutput(), 'cmd' => $cmd]);
            throw new \RuntimeException("{$operation} failed: " . $result->errorOutput());
        }

        return $outputPath;
    }
}
