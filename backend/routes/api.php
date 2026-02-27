<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ToolController;
use App\Modules\ImageTools\Controllers\ImageToolController;
use App\Modules\MediaTools\Controllers\MediaToolController;
use App\Modules\PdfTools\Controllers\PdfToolController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes – v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Auth ─────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/google', [AuthController::class, 'googleAuth']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/user', [AuthController::class, 'user']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // ── Tools (public) ──────────────────────────────
    Route::get('/tools', [ToolController::class, 'index']);

    // ── File metadata (public) ──────────────────────
    Route::post('/metadata', [ToolController::class, 'metadata']);

    // ── Conversion status (public) ──────────────────
    Route::get('/conversions/{id}/status', [ToolController::class, 'conversionStatus']);

    // ── Download (public) ───────────────────────────
    Route::get('/download/{id}', [ToolController::class, 'download'])->name('api.v1.download');

    // ── PDF Tools ───────────────────────────────────
    Route::post('/pdf/{action}', [PdfToolController::class, 'process'])
        ->where('action', '[a-z0-9\-]+')
        ->middleware('throttle:conversions');

    // ── Image Tools ─────────────────────────────────
    Route::post('/image/{action}', [ImageToolController::class, 'process'])
        ->where('action', '[a-z0-9\-]+')
        ->middleware('throttle:conversions');

    // ── Media Tools ─────────────────────────────────
    Route::post('/media/{action}', [MediaToolController::class, 'process'])
        ->where('action', '[a-z0-9\-]+')
        ->middleware('throttle:conversions');

    // ── Authenticated routes ────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/conversions', [ToolController::class, 'history']);
    });

    // ── Admin (authenticated) ───────────────────────
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
    });

    // ── Future: Public API access placeholder ───────
    // Route::prefix('public')->middleware('auth:sanctum')->group(function () {
    //     Route::post('/convert', [PublicApiController::class, 'convert']);
    //     Route::get('/formats', [PublicApiController::class, 'formats']);
    // });
});
