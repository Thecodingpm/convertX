<?php

namespace App\Modules\PdfTools\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessConversion;
use App\Models\Conversion;
use App\Modules\PdfTools\Requests\PdfRequest;
use App\Modules\PdfTools\Services\PdfService;
use App\Services\ConversionTracker;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;

class PdfToolController extends Controller
{
    public function __construct(
        protected PdfService $pdfService,
        protected FileUploadService $uploadService,
        protected ConversionTracker $tracker
    ) {}

    public function process(PdfRequest $request, string $action): JsonResponse
    {
        try {
            $toolSlug = "pdf-{$action}";

            // Handle merge (multiple files)
            if ($action === 'merge') {
                return $this->handleMerge($request, $toolSlug);
            }

            // Upload file
            $uploaded = $this->uploadService->store($request->file('file'));

            // Create conversion record
            $conversion = $this->tracker->create([
                'user_id' => $request->user()?->id,
                'tool_slug' => $toolSlug,
                'module' => 'pdf',
                'tool_name' => $this->getToolName($action),
                'original_filename' => $uploaded['original_name'],
                'original_mime' => $uploaded['mime_type'],
                'original_size' => $uploaded['size'],
                'metadata' => $request->only(['password', 'watermark_text', 'from_page', 'to_page', 'pages']),
            ]);

            // Dispatch — only pass scalar params, never UploadedFile objects
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

    protected function handleMerge(PdfRequest $request, string $toolSlug): JsonResponse
    {
        $uploadedFiles = [];
        foreach ($request->file('files') as $file) {
            $uploadedFiles[] = $this->uploadService->store($file);
        }

        $conversion = $this->tracker->create([
            'user_id' => $request->user()?->id,
            'tool_slug' => $toolSlug,
            'module' => 'pdf',
            'tool_name' => 'Merge PDFs',
            'original_filename' => 'merged.pdf',
            'original_mime' => 'application/pdf',
            'original_size' => array_sum(array_column($uploadedFiles, 'size')),
        ]);

        $paths = array_column($uploadedFiles, 'path');
        ProcessConversion::dispatch($conversion, $paths, 'merge', []);

        return response()->json([
            'success' => true,
            'message' => 'Files uploaded. Merge processing started.',
            'data' => ['conversion_id' => $conversion->id, 'status' => 'pending'],
        ], 202);
    }

    protected function getToolName(string $action): string
    {
        return match ($action) {
            'pdf-to-word'    => 'PDF to Word',
            'pdf-to-excel'   => 'PDF to Excel',
            'pdf-to-jpg'     => 'PDF to JPG',
            'merge'          => 'Merge PDFs',
            'split'          => 'Split PDF',
            'compress'       => 'Compress PDF',
            'add-password'   => 'Add Password',
            'remove-password'=> 'Remove Password',
            'watermark'      => 'Add Watermark',
            'extract-pages'  => 'Extract Pages',
            'pptx-to-pdf'    => 'PPTX to PDF',
            'pptx-to-word'   => 'PPTX to Word',
            'pptx-to-jpg'    => 'PPTX to JPG',
            'pptx-to-png'    => 'PPTX to PNG',
            default          => ucfirst(str_replace('-', ' ', $action)),
        };
    }
}
