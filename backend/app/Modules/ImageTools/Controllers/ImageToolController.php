<?php

namespace App\Modules\ImageTools\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessConversion;
use App\Modules\ImageTools\Requests\ImageRequest;
use App\Modules\ImageTools\Services\ImageService;
use App\Services\ConversionTracker;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;

class ImageToolController extends Controller
{
    public function __construct(
        protected ImageService $imageService,
        protected FileUploadService $uploadService,
        protected ConversionTracker $tracker
    ) {}

    public function process(ImageRequest $request, string $action): JsonResponse
    {
        try {
            $toolSlug = "image-{$action}";
            $uploaded = $this->uploadService->store($request->file('file'));

            $conversion = $this->tracker->create([
                'user_id' => $request->user()?->id,
                'tool_slug' => $toolSlug,
                'module' => 'image',
                'tool_name' => $this->getToolName($action),
                'original_filename' => $uploaded['original_name'],
                'original_mime' => $uploaded['mime_type'],
                'original_size' => $uploaded['size'],
                'metadata' => $request->only(['width', 'height', 'quality', 'degrees', 'x', 'y']),
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
            'jpg-to-png'        => 'JPG to PNG',
            'png-to-jpg'        => 'PNG to JPG',
            'to-webp'           => 'WebP Converter',
            'webp-to-jpg'       => 'WebP to JPG',
            'resize-image'      => 'Resize Image',
            'compress-image'    => 'Compress Image',
            'crop-image'        => 'Crop Image',
            'rotate-image'      => 'Rotate Image',
            'to-pdf'            => 'Image to PDF',
            'remove-background' => 'Remove Background',
            'flip'              => 'Flip Image',
            'bmp-to-png'        => 'BMP to PNG',
            default             => ucfirst(str_replace('-', ' ', $action)),
        };
    }
}
