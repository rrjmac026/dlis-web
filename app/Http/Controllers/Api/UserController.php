<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::latest('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'integer', 'in:0,1,2,3'],
        ]);

        $user = User::create([
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'is_active' => true,
        ]);

        AuditLogController::log('User Created', "Created user '{$user->username}' with role {$user->role->name}");

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id . ',id'],
            'role' => ['required', 'integer', 'in:0,1,2,3'],
        ]);

        $user->update($data);

        AuditLogController::log('User Updated', "Updated user '{$user->username}'");

        return response()->json($user);
    }

    public function resetPassword(Request $request, User $user)
    {
        $data = $request->validate(['password' => ['required', 'string', 'min:8']]);

        $user->update(['password' => Hash::make($data['password'])]);

        AuditLogController::log('Password Reset', "Reset password for '{$user->username}'");

        return response()->json(['message' => 'Password reset.']);
    }

    public function setStatus(Request $request, User $user)
    {
        $data = $request->validate(['is_active' => ['required', 'boolean']]);

        $user->update(['is_active' => $data['is_active']]);

        AuditLogController::log(
            $data['is_active'] ? 'User Reactivated' : 'User Deactivated',
            "User '{$user->username}' set to " . ($data['is_active'] ? 'active' : 'inactive')
        );

        return response()->json($user);
    }

    private function guardSuperAdmin(Request $request, ?User $target = null, ?int $newRole = null): void
    {
        if ($request->user()->role === UserRole::SuperAdmin) {
            return;
        }

        abort_if($newRole === UserRole::SuperAdmin->value, 403, 'Only a SuperAdmin can assign the SuperAdmin role.');
        abort_if($target?->role === UserRole::SuperAdmin, 403, 'Only a SuperAdmin can modify a SuperAdmin account.');
    }
}