<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the "conversions" rate limiter used by throttle:conversions middleware
        RateLimiter::for('conversions', function (Request $request) {
            if ($request->user()) {
                // Authenticated users: 100 conversions/minute
                return Limit::perMinute(100)->by($request->user()->id);
            }
            // Guests: 30 conversions/minute per IP
            return Limit::perMinute(30)->by($request->ip());
        });
    }
}
