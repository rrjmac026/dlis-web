<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        abort_unless($user, 403);

        $required = UserRole::from((int) $role);

        abort_unless($user->role->value >= $required->value, 403);

        return $next($request);
    }
}