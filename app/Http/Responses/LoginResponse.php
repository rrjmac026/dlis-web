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
        $isAdmin = UserRole::from((int) $user->getRawOriginal('role'))->value >= UserRole::Admin->value;

        return redirect()->route(
            $isAdmin ? 'admin.dashboard' : 'dashboard',
        );
    }
}