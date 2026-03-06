<?php

namespace App\Jobs;

use App\Models\Conversion;
use App\Modules\ImageTools\Services\ImageService;
use App\Modules\MediaTools\Services\MediaService;
use App\Modules\PdfTools\Services\PdfService;
use App\Services\ConversionTracker;
use App\Services\FileUploadService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessConversion implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        protected Conversion $conversion,
        protected string|array $inputPath,
        protected string $action,
        protected array $params
    ) {}

    public function handle(
        PdfService $pdfService,
        ImageService $imageService,
        MediaService $mediaService,
        FileUploadService $uploadService,
        ConversionTracker $tracker
    ): void {
        $tracker->markProcessing($this->conversion);

        try {
            $outputPath = match ($this->conversion->module) {
                'pdf' => $this->processPdf($pdfService, $uploadService),
                'image' => $this->processImage($imageService, $uploadService),
                'media' => $this->processMedia($mediaService, $uploadService),
                default => throw new \RuntimeException("Unknown module: {$this->conversion->module}"),
            };

            // Build a friendly output filename: originalname_action.ext
            $originalBase = pathinfo($this->conversion->original_filename, PATHINFO_FILENAME);
            $outputExt    = pathinfo($outputPath, PATHINFO_EXTENSION);
            $actionSlug   = str_replace('-', '_', $this->action);
            $friendlyName = "{$originalBase}_{$actionSlug}.{$outputExt}";

            $tracker->markCompleted($this->conversion, [
                'filename' => $friendlyName,
                'mime'     => mime_content_type($outputPath) ?: 'application/octet-stream',
                'size'     => filesize($outputPath),
                'path'     => $outputPath,
            ]);

        } catch (\Exception $e) {
            Log::error('Conversion job failed', [
                'conversion_id' => $this->conversion->id,
                'error' => $e->getMessage(),
            ]);
            $tracker->markFailed($this->conversion, $e->getMessage());
        }
    }

    protected function processPdf(PdfService $service, FileUploadService $upload): string
    {
        // $inputPath may be an array (e.g. merge PDF) or a string
        $outputDir = dirname(is_array($this->inputPath) ? $this->inputPath[0] : $this->inputPath);


        return match ($this->action) {
            'pdf-to-word' => $service->pdfToWord($this->inputPath, $outputDir),
            'pdf-to-excel' => $service->pdfToExcel($this->inputPath, $outputDir),
            'pdf-to-jpg' => $service->pdfToJpg($this->inputPath, $upload->getOutputPath('jpg')),
            'merge' => $service->mergePdfs($this->inputPath, $upload->getOutputPath('pdf')),
            'split' => $service->splitPdf(
                $this->inputPath,
                $upload->getOutputPath('pdf'),
                (int)($this->params['from_page'] ?? 1),
                (int)($this->params['to_page'] ?? 1)
            ),
            'compress' => $service->compressPdf($this->inputPath, $upload->getOutputPath('pdf')),
            'add-password' => $service->addPassword(
                $this->inputPath, $upload->getOutputPath('pdf'), $this->params['password']
            ),
            'remove-password' => $service->removePassword(
                $this->inputPath, $upload->getOutputPath('pdf'), $this->params['password']
            ),
            'watermark' => $service->addWatermark(
                $this->inputPath,
                $upload->getOutputPath('pdf'),
                $this->params['watermark_text'],
                $this->params['position']  ?? 'center',
                (float)($this->params['opacity']   ?? 0.3),
                $this->params['color']     ?? '#808080',
                (int)($this->params['font_size'] ?? 60),
                (int)($this->params['rotation']  ?? 45),
                $this->params['pages']     ?? 'all'
            ),
            'extract-pages' => $service->extractPages(
                $this->inputPath,
                $upload->getOutputPath('pdf'),
                array_map('intval', explode(',', $this->params['pages']))
            ),
            'pptx-to-pdf'  => $service->pptxToPdf($this->inputPath, $upload->getOutputPath('pdf')),
            'pptx-to-word' => $service->pptxToWord($this->inputPath, $upload->getOutputPath('docx')),
            'pptx-to-jpg'  => $service->pptxToJpg($this->inputPath, $upload->getOutputPath('jpg')),
            'pptx-to-png'  => $service->pptxToPng($this->inputPath, $upload->getOutputPath('png')),
            default => throw new \RuntimeException("Unknown PDF action: {$this->action}"),
        };
    }

    /**
     * Determine a safe output extension from the conversion's stored mime type.
     * Falls back to the input path extension if mime lookup fails.
     */
    protected function imageExt(): string
    {
        $mime = $this->conversion->original_mime ?? '';
        return match (true) {
            str_contains($mime, 'jpeg') => 'jpg',
            str_contains($mime, 'png')  => 'png',
            str_contains($mime, 'gif')  => 'gif',
            str_contains($mime, 'webp') => 'webp',
            str_contains($mime, 'bmp')  => 'bmp',
            str_contains($mime, 'tiff') => 'tiff',
            default => (pathinfo($this->inputPath, PATHINFO_EXTENSION) ?: 'jpg'),
        };
    }

    protected function processImage(ImageService $service, FileUploadService $upload): string
    {
        // Safe extension derived from stored mime type (not from temp path which has no extension)
        $ext = $this->imageExt();

        return match ($this->action) {
            'jpg-to-png'        => $service->jpgToPng($this->inputPath, $upload->getOutputPath('png')),
            'png-to-jpg'        => $service->pngToJpg($this->inputPath, $upload->getOutputPath('jpg')),
            'to-webp'           => $service->toWebp($this->inputPath, $upload->getOutputPath('webp')),
            'webp-to-jpg'       => $service->webpToJpg($this->inputPath, $upload->getOutputPath('jpg')),
            'resize-image', 'resize' => $service->resize(
                $this->inputPath, $upload->getOutputPath($ext),
                (int)$this->params['width'], (int)$this->params['height']
            ),
            'compress-image', 'compress' => $service->compress(
                $this->inputPath, $upload->getOutputPath($ext),
                (int)($this->params['quality'] ?? 75)
            ),
            'crop-image'        => $service->crop(
                $this->inputPath, $upload->getOutputPath($ext),
                (int)$this->params['width'], (int)$this->params['height'],
                (int)($this->params['x'] ?? 0), (int)($this->params['y'] ?? 0)
            ),
            'rotate-image'      => $service->rotate(
                $this->inputPath, $upload->getOutputPath($ext),
                (int)$this->params['degrees']
            ),
            'to-pdf'            => $service->toPdf($this->inputPath, $upload->getOutputPath('pdf')),
            'remove-background' => $service->removeBackground($this->inputPath, $upload->getOutputPath('png')),
            'flip'              => $service->flip(
                $this->inputPath, $upload->getOutputPath($ext),
                $this->params['direction'] ?? 'horizontal'
            ),
            'bmp-to-png'        => $service->bmpToPng($this->inputPath, $upload->getOutputPath('png')),
            default             => throw new \RuntimeException("Unknown image action: {$this->action}"),
        };
    }

    protected function processMedia(MediaService $service, FileUploadService $upload): string
    {
        return match ($this->action) {
            'mp3-to-wav' => $service->mp3ToWav($this->inputPath, $upload->getOutputPath('wav')),
            'wav-to-mp3' => $service->wavToMp3(
                $this->inputPath, $upload->getOutputPath('mp3'), (int)($this->params['bitrate'] ?? 192)
            ),
            'extract-audio' => $service->extractAudio(
                $this->inputPath, $upload->getOutputPath($this->params['format'] ?? 'mp3'), $this->params['format'] ?? 'mp3'
            ),
            'mp4-to-avi' => $service->mp4ToAvi($this->inputPath, $upload->getOutputPath('avi')),
            'compress-video' => $service->compressVideo(
                $this->inputPath, $upload->getOutputPath('mp4'),
                match ($this->params['quality'] ?? 'medium') {
                    'low' => '32', 'high' => '20', default => '28',
                }
            ),
            'trim-audio' => $service->trimAudio(
                $this->inputPath, $upload->getOutputPath(pathinfo($this->inputPath, PATHINFO_EXTENSION)),
                $this->params['start'], $this->params['duration']
            ),
            'trim-video' => $service->trimVideo(
                $this->inputPath, $upload->getOutputPath(pathinfo($this->inputPath, PATHINFO_EXTENSION)),
                $this->params['start'], $this->params['duration']
            ),
            'video-to-gif' => $service->videoToGif(
                $this->inputPath, $upload->getOutputPath('gif'),
                (int)($this->params['fps'] ?? 10), (int)($this->params['width'] ?? 480)
            ),
            'mp4-to-gif' => $service->videoToGif(
                $this->inputPath, $upload->getOutputPath('gif'),
                (int)($this->params['fps'] ?? 10), (int)($this->params['width'] ?? 480)
            ),
            'audio-to-mp4' => $service->audioToMp4($this->inputPath, $upload->getOutputPath('mp4')),
            'gif-to-mp4'   => $service->gifToMp4($this->inputPath, $upload->getOutputPath('mp4')),
            'mp4-to-mp3'   => $service->mp4ToMp3($this->inputPath, $upload->getOutputPath('mp3')),
            'mov-to-mp3'   => $service->movToMp3($this->inputPath, $upload->getOutputPath('mp3'), (int)($this->params['bitrate'] ?? 192)),
            'mov-to-mp4'   => $service->movToMp4($this->inputPath, $upload->getOutputPath('mp4')),
            'change-audio-speed' => $service->changeAudioSpeed(
                $this->inputPath,
                $upload->getOutputPath(pathinfo($this->inputPath, PATHINFO_EXTENSION)),
                (float)($this->params['speed'] ?? 1.5)
            ),
            default => throw new \RuntimeException("Unknown media action: {$this->action}"),
        };
    }
}
