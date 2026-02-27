<?php

namespace App\Console\Commands;

use App\Services\FileUploadService;
use Illuminate\Console\Command;

class CleanupTempFiles extends Command
{
    protected $signature = 'fileforge:cleanup';
    protected $description = 'Clean up expired temporary files';

    public function handle(FileUploadService $uploadService): int
    {
        $count = $uploadService->cleanupExpired();
        $this->info("Cleaned up {$count} expired temporary files.");

        return Command::SUCCESS;
    }
}
