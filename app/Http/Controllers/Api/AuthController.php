<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if (! $user || ! password_verify($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Invalid credentials.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'username' => ['This account is inactive.'],
            ]);
        }

        AdminAuditLogController::log('Login', "User '{$user->username}' logged in", $user);

        $token = $user->createToken('lois-desktop')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'role' => $user->role->value,
                'role_name' => $user->role->name,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        AdminAuditLogController::log('Logout', "User '{$request->user()->username}' logged out");

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role->value,
            'role_name' => $user->role->name,
        ]);
    }
}