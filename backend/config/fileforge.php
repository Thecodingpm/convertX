<?php

return [
    /*
    |--------------------------------------------------------------------------
    | FileForge Configuration
    |--------------------------------------------------------------------------
    */

    // Maximum file upload size in bytes (default: 100MB)
    'max_file_size' => env('MAX_FILE_SIZE', 104857600),

    // Temporary file lifetime in seconds (default: 1 hour)
    'temp_file_lifetime' => env('TEMP_FILE_LIFETIME', 3600),

    // Rate limiting: requests per minute for conversion endpoints
    'rate_limit_per_minute' => env('RATE_LIMIT_PER_MINUTE', 60),

    // Free plan daily conversion limit
    'free_daily_limit' => env('FREE_DAILY_LIMIT', 5),

    // Pro plan daily conversion limit (0 = unlimited)
    'pro_daily_limit' => env('PRO_DAILY_LIMIT', 0),

    // Free plan max file size in MB
    'free_max_file_size_mb' => env('FREE_MAX_FILE_SIZE_MB', 25),

    // Pro plan max file size in MB
    'pro_max_file_size_mb' => env('PRO_MAX_FILE_SIZE_MB', 500),

    // Supported tools per module
    'pdf_actions' => [
        'pdf-to-word', 'pdf-to-excel', 'pdf-to-jpg',
        'merge', 'split', 'compress',
        'add-password', 'remove-password', 'watermark', 'extract-pages',
    ],

    'image_actions' => [
        'jpg-to-png', 'png-to-jpg', 'to-webp',
        'resize', 'compress', 'crop', 'rotate',
        'to-pdf', 'remove-background',
    ],

    'media_actions' => [
        'mp3-to-wav', 'wav-to-mp3', 'extract-audio',
        'mp4-to-avi', 'compress-video',
        'trim-audio', 'trim-video', 'video-to-gif',
    ],
];
