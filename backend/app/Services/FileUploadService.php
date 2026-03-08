<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected string $tmpPath;

    public function __construct()
    {
        // Use the disk's actual path so we don't hardcode storage/app vs storage/app/private
        $this->tmpPath = Storage::disk('local')->path('tmp');
        if (!is_dir($this->tmpPath)) {
            mkdir($this->tmpPath, 0755, true);
        }
    }

    /**
     * Store an uploaded file securely in the temp directory.
     */
    public function store(UploadedFile $file): array
    {
        $this->validateFile($file);

        $sanitizedName = $this->sanitizeFilename($file->getClientOriginalName());
        $uniqueName = Str::uuid() . '_' . $sanitizedName;
        // Store the file and get its REAL path via the disk
        $relativePath = $file->storeAs('tmp', $uniqueName, 'local');
        $absolutePath = Storage::disk('local')->path($relativePath);
        Log::info('File uploaded', [
            'original_name' => $sanitizedName,
            'stored_name' => $uniqueName,
            'size' => $file->getSize(),
            'mime' => $file->getMimeType(),
        ]);

        return [
            'path' => $absolutePath,
            'original_name' => $sanitizedName,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'stored_name' => $uniqueName,
        ];
    }

    /**
     * Validate file meets requirements.
     */
    protected function validateFile(UploadedFile $file): void
    {
        $maxSize = config('fileforge.max_file_size', 536870912); // 512MB default

        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException(
                'File size exceeds the maximum allowed size of ' . ($maxSize / 1048576) . 'MB'
            );
        }

        // Prevent dangerous file types
        $dangerousMimes = [
            'application/x-executable',
            'application/x-sharedlib',
            'application/x-php',
            'text/x-php',
            'application/x-httpd-php',
        ];

        if (in_array($file->getMimeType(), $dangerousMimes)) {
            throw new \InvalidArgumentException('File type not allowed for security reasons.');
        }
    }

    /**
     * Sanitize filename to prevent path traversal and code execution.
     */
    protected function sanitizeFilename(string $filename): string
    {
        $filename = basename($filename);
        $filename = preg_replace('/[^\w\s\-\.]/', '', $filename);
        $filename = preg_replace('/\.{2,}/', '.', $filename);

        return $filename ?: 'unnamed_file';
    }

    /**
     * Generate an output path for converted files.
     */
    public function getOutputPath(string $extension): string
    {
        return $this->tmpPath . '/' . Str::uuid() . '.' . $extension;
    }

    /**
     * Delete a temporary file.
     */
    public function delete(string $path): void
    {
        if (file_exists($path)) {
            unlink($path);
            Log::info('Temp file deleted', ['path' => $path]);
        }
    }

    /**
     * Clean up expired temp files.
     */
    public function cleanupExpired(): int
    {
        $lifetime = config('fileforge.temp_file_lifetime', 3600);
        $count = 0;
        $files = glob($this->tmpPath . '/*');

        foreach ($files as $file) {
            if (is_file($file) && (time() - filemtime($file)) > $lifetime) {
                unlink($file);
                $count++;
            }
        }

        Log::info("Cleaned up {$count} expired temp files");
        return $count;
    }
}
