<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'plan',
        'daily_conversions',
        'daily_reset_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'daily_reset_at' => 'date',
        ];
    }

    public function conversions()
    {
        return $this->hasMany(Conversion::class);
    }

    public function isPro(): bool
    {
        return $this->plan === 'pro';
    }

    public function canConvert(): bool
    {
        if ($this->isPro()) {
            return true;
        }

        if ($this->daily_reset_at === null || !$this->daily_reset_at->isToday()) {
            $this->update([
                'daily_conversions' => 0,
                'daily_reset_at' => now(),
            ]);
        }

        return $this->daily_conversions < 5;
    }

    public function incrementConversions(): void
    {
        $this->increment('daily_conversions');
    }
}
