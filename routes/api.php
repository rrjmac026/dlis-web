<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrdinanceController;
use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\MinutesController;
use App\Http\Controllers\Api\CommitteeReportController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    // ─────────────────────────────────────────────
    // Viewer and above — read-only access
    // ─────────────────────────────────────────────
    Route::middleware('role:viewer')->group(function () {
        Route::get('dashboard', DashboardController::class);

        Route::get('reports/ordinances', [ReportController::class, 'ordinances']);
        Route::get('reports/ordinance-years', [ReportController::class, 'ordinanceYears']);

        Route::apiResource('ordinances', OrdinanceController::class)->only(['index', 'show']);
        Route::apiResource('resolutions', ResolutionController::class)->only(['index', 'show']);
        Route::apiResource('minutes', MinutesController::class)
            ->only(['index', 'show'])
            ->parameters(['minutes' => 'minutes']);
        Route::apiResource('committee-reports', CommitteeReportController::class)->only(['index', 'show']);

        // Lets the desktop app record client-side events (e.g. "viewed X").
        Route::post('audit-logs', [AuditLogController::class, 'store']);
    });

    // ─────────────────────────────────────────────
    // Encoder and above — create / update / delete
    // ─────────────────────────────────────────────
    Route::middleware('role:encoder')->group(function () {
        Route::apiResource('ordinances', OrdinanceController::class)->only(['store', 'update', 'destroy']);
        Route::post('ordinances/{ordinance}/versions', [OrdinanceController::class, 'storeVersion']);

        Route::apiResource('resolutions', ResolutionController::class)->only(['store', 'update', 'destroy']);

        Route::apiResource('minutes', MinutesController::class)
            ->only(['store', 'update', 'destroy'])
            ->parameters(['minutes' => 'minutes']);

        Route::apiResource('committee-reports', CommitteeReportController::class)->only(['store', 'update', 'destroy']);
        Route::delete('committee-reports/{committeeReport}/attachments/{attachment}', [CommitteeReportController::class, 'destroyAttachment']);

        Route::apiResource('feedback', FeedbackController::class)->except(['edit']);
    });

    // ─────────────────────────────────────────────
    // Admin and above — user management + reading the audit log
    // ─────────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);

        // post OR put, so both real PUT and the WPF's POST + ?_method=PUT work
        Route::match(['post', 'put'], 'users/{user}', [UserController::class, 'update']);
        Route::match(['post', 'put'], 'users/{user}/password', [UserController::class, 'resetPassword']);
        Route::match(['post', 'put'], 'users/{user}/status', [UserController::class, 'setStatus']);

        Route::get('audit-logs', [AuditLogController::class, 'index']);
    });
});