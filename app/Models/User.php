<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $username
 * @property string $password
 * @property UserRole $role
 * @property bool $is_active
 */
#[Fillable(['username', 'password', 'role', 'is_active'])]
#[Hidden(['password'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    // Reads from the 'users' view (lowercase mirror of the real "Users"
    // table used by the WPF app). The view is updatable, so create/update/
    // delete through Eloquent pass straight through to the real table.
    protected $table = 'users';

    protected $connection = 'pgsql';

    // The underlying "Users" table has no created_at/updated_at columns.
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}