<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ConversionTracker;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function __construct(protected ConversionTracker $tracker)
    {}

    /**
     * Get admin dashboard stats.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->tracker->getStats();
        $stats['total_users'] = User::count();
        $stats['pro_users'] = User::where('plan', 'pro')->count();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
