<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        /** @var Request $request */
        $user = $request->user();
        $role = UserRole::from((int) $user->getRawOriginal('role'))->value;

        $route = match (true) {
            $role >= UserRole::Admin->value => 'admin.dashboard',
            $role >= UserRole::Encoder->value => 'encoder.dashboard',
            default => 'viewer.dashboard',
        };

        return redirect()->route($route);
    }
}