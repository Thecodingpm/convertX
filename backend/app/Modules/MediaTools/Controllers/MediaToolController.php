<?php

namespace App\Modules\MediaTools\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessConversion;
use App\Modules\MediaTools\Requests\MediaRequest;
use App\Modules\MediaTools\Services\MediaService;
use App\Services\ConversionTracker;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;

class MediaToolController extends Controller
{
    public function __construct(
        protected MediaService $mediaService,
        protected FileUploadService $uploadService,
        protected ConversionTracker $tracker
    ) {}

    public function process(MediaRequest $request, string $action): JsonResponse
    {
        try {
            $toolSlug = "media-{$action}";
            $uploaded = $this->uploadService->store($request->file('file'));

            $conversion = $this->tracker->create([
                'user_id' => $request->user()?->id,
                'tool_slug' => $toolSlug,
                'module' => 'media',
                'tool_name' => $this->getToolName($action),
                'original_filename' => $uploaded['original_name'],
                'original_mime' => $uploaded['mime_type'],
                'original_size' => $uploaded['size'],
                'metadata' => $request->only(['bitrate', 'format', 'quality', 'start', 'duration', 'fps', 'width']),
            ]);

            ProcessConversion::dispatch($conversion, $uploaded['path'], $action, $request->except(['file', 'files']));

            return response()->json([
                'success' => true,
                'message' => 'File uploaded. Processing started.',
                'data' => [
                    'conversion_id' => $conversion->id,
                    'status' => 'pending',
                ],
            ], 202);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Processing failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function getToolName(string $action): string
    {
        return match ($action) {
            'mp3-to-wav' => 'MP3 to WAV',
            'wav-to-mp3' => 'WAV to MP3',
            'extract-audio' => 'Extract Audio',
            'mp4-to-avi' => 'MP4 to AVI',
            'compress-video' => 'Compress Video',
            'trim-audio' => 'Trim Audio',
            'trim-video' => 'Trim Video',
            'video-to-gif' => 'Video to GIF',
            'mp4-to-gif' => 'MP4 to GIF',
            'mp4-to-mp3' => 'MP4 to MP3',
            'mov-to-mp3' => 'MOV to MP3',
            'mov-to-mp4' => 'MOV to MP4',
            default => ucfirst(str_replace('-', ' ', $action)),
        };
    }
}
