<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversion;
use App\Models\ToolStat;
use App\Services\ConversionTracker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ToolController extends Controller
{
    public function __construct(protected ConversionTracker $tracker)
    {}

    /**
     * List all available tools with popularity stats.
     */
    public function index(): JsonResponse
    {
        $tools = $this->getToolDefinitions();

        // Merge with DB stats
        $stats = ToolStat::all()->keyBy('tool_slug');
        foreach ($tools as &$tool) {
            $stat = $stats->get($tool['slug']);
            $tool['usage_count'] = $stat?->usage_count ?? 0;
        }

        // Sort by popularity
        usort($tools, fn($a, $b) => $b['usage_count'] <=> $a['usage_count']);

        return response()->json([
            'success' => true,
            'data' => $tools,
        ]);
    }

    /**
     * Get conversion status and download URL.
     */
    public function conversionStatus(int $id): JsonResponse
    {
        $conversion = Conversion::findOrFail($id);

        $data = [
            'id' => $conversion->id,
            'status' => $conversion->status,
            'tool_slug' => $conversion->tool_slug,
            'original_filename' => $conversion->original_filename,
            'output_filename' => $conversion->output_filename,
            'error_message' => $conversion->error_message,
            'created_at' => $conversion->created_at,
        ];

        if ($conversion->status === 'completed' && !$conversion->isExpired()) {
            $data['download_url'] = route('api.v1.download', $conversion->id);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Download converted file.
     */
    public function download(int $id): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $conversion = Conversion::findOrFail($id);

        if ($conversion->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Conversion not yet completed.',
            ], 400);
        }

        if ($conversion->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'Download link has expired.',
            ], 410);
        }

        if (!file_exists($conversion->output_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found.',
            ], 404);
        }

        $this->tracker->trackDownload($conversion);

        return response()->download(
            $conversion->output_path,
            $conversion->output_filename,
            ['Content-Type' => $conversion->output_mime]
        );
    }

    /**
     * Get user's conversion history.
     */
    public function history(Request $request): JsonResponse
    {
        $conversions = $this->tracker->getUserHistory(
            $request->user()->id,
            $request->integer('per_page', 20)
        );

        return response()->json([
            'success' => true,
            'data' => $conversions,
        ]);
    }

    /**
     * Get file metadata.
     */
    public function metadata(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:51200'],
        ]);

        $file = $request->file('file');
        $metadata = [
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'size_human' => $this->formatBytes($file->getSize()),
            'mime_type' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
        ];

        return response()->json([
            'success' => true,
            'data' => $metadata,
        ]);
    }

    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }

    protected function getToolDefinitions(): array
    {
        return [
            // PDF Tools
            ['slug' => 'pdf-pdf-to-word', 'name' => 'PDF to Word', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Convert PDF documents to editable Word files', 'icon' => 'file-text', 'endpoint' => '/api/v1/pdf/pdf-to-word'],
            ['slug' => 'pdf-pdf-to-excel', 'name' => 'PDF to Excel', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Convert PDF tables to Excel spreadsheets', 'icon' => 'table', 'endpoint' => '/api/v1/pdf/pdf-to-excel'],
            ['slug' => 'pdf-pdf-to-jpg', 'name' => 'PDF to JPG', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Convert PDF pages to JPG images', 'icon' => 'image', 'endpoint' => '/api/v1/pdf/pdf-to-jpg'],
            ['slug' => 'pdf-merge', 'name' => 'Merge PDFs', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Combine multiple PDF files into one', 'icon' => 'git-merge', 'endpoint' => '/api/v1/pdf/merge'],
            ['slug' => 'pdf-split', 'name' => 'Split PDF', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Split PDF into separate pages', 'icon' => 'scissors', 'endpoint' => '/api/v1/pdf/split'],
            ['slug' => 'pdf-compress', 'name' => 'Compress PDF', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Reduce PDF file size', 'icon' => 'minimize-2', 'endpoint' => '/api/v1/pdf/compress'],
            ['slug' => 'pdf-add-password', 'name' => 'Add Password', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Protect PDF with a password', 'icon' => 'lock', 'endpoint' => '/api/v1/pdf/add-password'],
            ['slug' => 'pdf-remove-password', 'name' => 'Remove Password', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Remove password from PDF', 'icon' => 'unlock', 'endpoint' => '/api/v1/pdf/remove-password'],
            ['slug' => 'pdf-watermark', 'name' => 'Add Watermark', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Add watermark text to PDF pages', 'icon' => 'droplet', 'endpoint' => '/api/v1/pdf/watermark'],
            ['slug' => 'pdf-extract-pages', 'name' => 'Extract Pages', 'module' => 'pdf', 'category' => 'PDF Tools',
                'description' => 'Extract specific pages from PDF', 'icon' => 'copy', 'endpoint' => '/api/v1/pdf/extract-pages'],

            // Image Tools
            ['slug' => 'image-jpg-to-png', 'name' => 'JPG to PNG', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Convert JPG images to PNG format', 'icon' => 'image', 'endpoint' => '/api/v1/image/jpg-to-png'],
            ['slug' => 'image-png-to-jpg', 'name' => 'PNG to JPG', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Convert PNG images to JPG format', 'icon' => 'image', 'endpoint' => '/api/v1/image/png-to-jpg'],
            ['slug' => 'image-to-webp', 'name' => 'WebP Converter', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Convert images to WebP format', 'icon' => 'zap', 'endpoint' => '/api/v1/image/to-webp'],
            ['slug' => 'image-resize', 'name' => 'Resize Image', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Resize image to specific dimensions', 'icon' => 'maximize', 'endpoint' => '/api/v1/image/resize'],
            ['slug' => 'image-compress', 'name' => 'Compress Image', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Reduce image file size', 'icon' => 'minimize-2', 'endpoint' => '/api/v1/image/compress'],
            ['slug' => 'image-crop', 'name' => 'Crop Image', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Crop image to specific area', 'icon' => 'crop', 'endpoint' => '/api/v1/image/crop'],
            ['slug' => 'image-rotate', 'name' => 'Rotate Image', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Rotate image by degrees', 'icon' => 'rotate-cw', 'endpoint' => '/api/v1/image/rotate'],
            ['slug' => 'image-to-pdf', 'name' => 'Image to PDF', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Convert image to PDF document', 'icon' => 'file', 'endpoint' => '/api/v1/image/to-pdf'],
            ['slug' => 'image-remove-background', 'name' => 'Remove Background', 'module' => 'image', 'category' => 'Image Tools',
                'description' => 'Remove image background (basic)', 'icon' => 'eraser', 'endpoint' => '/api/v1/image/remove-background',
                'coming_soon' => false],

            // Media Tools
            ['slug' => 'media-mp3-to-wav', 'name' => 'MP3 to WAV', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Convert MP3 audio to WAV format', 'icon' => 'music', 'endpoint' => '/api/v1/media/mp3-to-wav'],
            ['slug' => 'media-wav-to-mp3', 'name' => 'WAV to MP3', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Convert WAV audio to MP3 format', 'icon' => 'music', 'endpoint' => '/api/v1/media/wav-to-mp3'],
            ['slug' => 'media-extract-audio', 'name' => 'Extract Audio', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Extract audio track from video', 'icon' => 'headphones', 'endpoint' => '/api/v1/media/extract-audio'],
            ['slug' => 'media-mp4-to-avi', 'name' => 'MP4 to AVI', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Convert MP4 video to AVI format', 'icon' => 'film', 'endpoint' => '/api/v1/media/mp4-to-avi'],
            ['slug' => 'media-compress-video', 'name' => 'Compress Video', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Reduce video file size', 'icon' => 'minimize-2', 'endpoint' => '/api/v1/media/compress-video'],
            ['slug' => 'media-trim-audio', 'name' => 'Trim Audio', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Cut audio to specific duration', 'icon' => 'scissors', 'endpoint' => '/api/v1/media/trim-audio'],
            ['slug' => 'media-trim-video', 'name' => 'Trim Video', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Cut video to specific duration', 'icon' => 'scissors', 'endpoint' => '/api/v1/media/trim-video'],
            ['slug' => 'media-video-to-gif', 'name' => 'Video to GIF', 'module' => 'media', 'category' => 'Media Tools',
                'description' => 'Convert video clips to animated GIFs', 'icon' => 'play-circle', 'endpoint' => '/api/v1/media/video-to-gif'],

            // AI Tools (Coming Soon)
            ['slug' => 'ai-ocr', 'name' => 'OCR (Text Recognition)', 'module' => 'ai', 'category' => 'AI Tools',
                'description' => 'Extract text from images and PDFs', 'icon' => 'scan', 'coming_soon' => true],
            ['slug' => 'ai-summarize', 'name' => 'AI Summarizer', 'module' => 'ai', 'category' => 'AI Tools',
                'description' => 'AI-powered document summarization', 'icon' => 'brain', 'coming_soon' => true],
            ['slug' => 'ai-analyze', 'name' => 'File Analyzer', 'module' => 'ai', 'category' => 'AI Tools',
                'description' => 'AI-powered file analysis and insights', 'icon' => 'search', 'coming_soon' => true],
        ];
    }
}
