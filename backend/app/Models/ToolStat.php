<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'tool_slug',
        'module',
        'name',
        'description',
        'usage_count',
    ];

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    public static function track(string $toolSlug, string $module, string $name): void
    {
        $stat = static::firstOrCreate(
            ['tool_slug' => $toolSlug],
            ['module' => $module, 'name' => $name]
        );
        $stat->incrementUsage();
    }
}
