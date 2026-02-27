<?php

namespace App\Services;

use App\Models\Conversion;
use App\Models\ToolStat;
use Illuminate\Support\Facades\Log;

class ConversionTracker
{
    /**
     * Create a new conversion record.
     */
    public function create(array $data): Conversion
    {
        $conversion = Conversion::create([
            'user_id' => $data['user_id'] ?? null,
            'tool_slug' => $data['tool_slug'],
            'module' => $data['module'],
            'original_filename' => $data['original_filename'],
            'original_mime' => $data['original_mime'],
            'original_size' => $data['original_size'],
            'status' => 'pending',
            'expires_at' => now()->addHour(),
            'metadata' => $data['metadata'] ?? null,
        ]);

        // Track tool usage
        ToolStat::track($data['tool_slug'], $data['module'], $data['tool_name'] ?? $data['tool_slug']);

        Log::info('Conversion created', ['id' => $conversion->id, 'tool' => $data['tool_slug']]);

        return $conversion;
    }

    /**
     * Mark conversion as processing.
     */
    public function markProcessing(Conversion $conversion): void
    {
        $conversion->update(['status' => 'processing']);
    }

    /**
     * Mark conversion as completed.
     */
    public function markCompleted(Conversion $conversion, array $output): void
    {
        $conversion->update([
            'status' => 'completed',
            'output_filename' => $output['filename'],
            'output_mime' => $output['mime'],
            'output_size' => $output['size'],
            'output_path' => $output['path'],
        ]);

        Log::info('Conversion completed', ['id' => $conversion->id]);
    }

    /**
     * Mark conversion as failed.
     */
    public function markFailed(Conversion $conversion, string $error): void
    {
        $conversion->update([
            'status' => 'failed',
            'error_message' => $error,
        ]);

        Log::error('Conversion failed', ['id' => $conversion->id, 'error' => $error]);
    }

    /**
     * Increment download count.
     */
    public function trackDownload(Conversion $conversion): void
    {
        $conversion->increment('download_count');
    }

    /**
     * Get user's conversion history.
     */
    public function getUserHistory(int $userId, int $perPage = 20)
    {
        return Conversion::forUser($userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get admin stats.
     */
    public function getStats(): array
    {
        return [
            'total_conversions' => Conversion::count(),
            'completed_conversions' => Conversion::completed()->count(),
            'failed_conversions' => Conversion::where('status', 'failed')->count(),
            'pending_conversions' => Conversion::pending()->count(),
            'popular_tools' => ToolStat::orderBy('usage_count', 'desc')->limit(10)->get(),
            'today_conversions' => Conversion::whereDate('created_at', today())->count(),
        ];
    }
}
