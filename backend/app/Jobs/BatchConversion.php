<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Batch Conversion Job – Placeholder for future batch processing.
 *
 * This job will handle processing multiple files in a single batch,
 * applying the same conversion to all files.
 */
class BatchConversion implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected int $userId,
        protected array $filePaths,
        protected string $action,
        protected array $params
    ) {}

    public function handle(): void
    {
        Log::info('Batch conversion placeholder invoked', [
            'user_id' => $this->userId,
            'file_count' => count($this->filePaths),
            'action' => $this->action,
        ]);

        // TODO: Implement batch processing
        // foreach ($this->filePaths as $path) {
        //     ProcessConversion::dispatch(...);
        // }
    }
}
