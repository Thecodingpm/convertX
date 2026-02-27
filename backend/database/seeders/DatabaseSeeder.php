<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\ToolStat;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed plans
        Plan::create([
            'slug' => 'free',
            'name' => 'Free',
            'description' => 'Basic file conversion for everyone',
            'price' => 0,
            'billing_cycle' => 'monthly',
            'daily_conversion_limit' => 5,
            'max_file_size_mb' => 25,
            'priority_processing' => false,
            'batch_conversion' => false,
            'api_access' => false,
            'features' => [
                'All basic conversion tools',
                '5 conversions per day',
                'Max 25MB file size',
                'Standard processing speed',
            ],
        ]);

        Plan::create([
            'slug' => 'pro',
            'name' => 'Pro',
            'description' => 'Unlimited conversions for professionals',
            'price' => 9.99,
            'billing_cycle' => 'monthly',
            'daily_conversion_limit' => 0,
            'max_file_size_mb' => 500,
            'priority_processing' => true,
            'batch_conversion' => true,
            'api_access' => true,
            'features' => [
                'All conversion tools',
                'Unlimited conversions',
                'Max 500MB file size',
                'Priority processing',
                'Batch conversion',
                'API access',
                'No ads',
            ],
        ]);

        // Seed tool stats
        $tools = [
            ['tool_slug' => 'pdf-pdf-to-word', 'module' => 'pdf', 'name' => 'PDF to Word'],
            ['tool_slug' => 'pdf-compress', 'module' => 'pdf', 'name' => 'Compress PDF'],
            ['tool_slug' => 'pdf-merge', 'module' => 'pdf', 'name' => 'Merge PDFs'],
            ['tool_slug' => 'image-jpg-to-png', 'module' => 'image', 'name' => 'JPG to PNG'],
            ['tool_slug' => 'image-compress', 'module' => 'image', 'name' => 'Compress Image'],
            ['tool_slug' => 'media-mp3-to-wav', 'module' => 'media', 'name' => 'MP3 to WAV'],
            ['tool_slug' => 'media-compress-video', 'module' => 'media', 'name' => 'Compress Video'],
        ];

        foreach ($tools as $tool) {
            ToolStat::create($tool);
        }
    }
}
