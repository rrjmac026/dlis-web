<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\CommitteeReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MinutesController;
use App\Http\Controllers\OrdinanceController;
use App\Http\Controllers\ResolutionController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    // ─────────────────────────────────────────────
    // Viewer and above (role 0+) — read-only access
    // ─────────────────────────────────────────────
    Route::middleware('role:0')->group(function () {
        Route::get('committee-reports', [CommitteeReportController::class, 'index'])->name('committee-reports.index');
        Route::get('committee-reports/{committeeReport}', [CommitteeReportController::class, 'show'])->name('committee-reports.show');

        Route::get('minutes', [MinutesController::class, 'index'])->name('minutes.index');
        Route::get('minutes/{minute}', [MinutesController::class, 'show'])->name('minutes.show');

        Route::get('ordinances', [OrdinanceController::class, 'index'])->name('ordinances.index');
        Route::get('ordinances/{ordinance}', [OrdinanceController::class, 'show'])->name('ordinances.show');

        Route::get('resolutions', [ResolutionController::class, 'index'])->name('resolutions.index');
        Route::get('resolutions/{resolution}', [ResolutionController::class, 'show'])->name('resolutions.show');

        // Audit logs — read-only by nature, viewable by anyone authenticated
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    });

    // ─────────────────────────────────────────────
    // Encoder and above (role 1+) — full CRUD on content
    // ─────────────────────────────────────────────
    Route::middleware('role:1')->group(function () {
        Route::resource('committee-reports', CommitteeReportController::class)->except(['index', 'show']);
        Route::delete('committee-reports/{committeeReport}/attachments/{attachment}', [CommitteeReportController::class, 'destroyAttachment'])
            ->name('committee-reports.attachments.destroy');

        // Feedback CRUD — everyone Encoder+ can manage their own feedback.
        // index/show visibility is scoped in FeedbackController: SuperAdmin sees
        // everyone's feedback, everyone else (Encoder/Admin) sees only their own.
        Route::resource('feedback', FeedbackController::class)->except(['edit']);

        Route::resource('minutes', MinutesController::class)->except(['index', 'show']);

        Route::resource('ordinances', OrdinanceController::class)->except(['index', 'show']);
        Route::post('ordinances/{ordinance}/versions', [OrdinanceController::class, 'storeVersion'])
            ->name('ordinances.versions.store');
        Route::delete('ordinances/{ordinance}/versions/{version}', [OrdinanceController::class, 'destroyVersion'])
            ->name('ordinances.versions.destroy');

        Route::resource('resolutions', ResolutionController::class)->except(['index', 'show']);
        Route::post('resolutions/{resolution}/clauses', [ResolutionController::class, 'storeClause'])
            ->name('resolutions.clauses.store');
        Route::delete('resolutions/{resolution}/clauses/{clause}', [ResolutionController::class, 'destroyClause'])
            ->name('resolutions.clauses.destroy');
    });

    // ─────────────────────────────────────────────
    // Admin and above (role 2+) — user account management
    // ─────────────────────────────────────────────
    Route::middleware('role:2')->group(function () {
        Route::get('admin/dashboard', AdminDashboardController::class)->name('admin.dashboard');
        Route::resource('users', UserController::class);
    });

});

require __DIR__.'/settings.php';