<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminCommitteeReportController;
use App\Http\Controllers\Admin\AdminMinutesController;
use App\Http\Controllers\Admin\AdminOrdinanceController;
use App\Http\Controllers\Admin\AdminResolutionController;
use App\Http\Controllers\Admin\AdminFeedbackController;
use App\Http\Controllers\Encoder\EncoderCommitteeReportController;
use App\Http\Controllers\Encoder\EncoderFeedbackController;
use App\Http\Controllers\Encoder\EncoderMinutesController;
use App\Http\Controllers\Encoder\EncoderOrdinanceController;
use App\Http\Controllers\Encoder\EncoderResolutionController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    // ─────────────────────────────────────────────
    // Viewer and above — read-only access
    // ─────────────────────────────────────────────
    Route::middleware('role:viewer')->group(function () {
        Route::get('committee-reports', [AdminCommitteeReportController::class, 'index'])->name('committee-reports.index');
        Route::get('committee-reports/{committeeReport}', [AdminCommitteeReportController::class, 'show'])->name('committee-reports.show');

        Route::get('minutes', [AdminMinutesController::class, 'index'])->name('minutes.index');
        Route::get('minutes/{minute}', [AdminMinutesController::class, 'show'])->name('minutes.show');

        Route::get('ordinances', [AdminOrdinanceController::class, 'index'])->name('ordinances.index');
        Route::get('ordinances/{ordinance}', [AdminOrdinanceController::class, 'show'])->name('ordinances.show');

        Route::get('resolutions', [AdminResolutionController::class, 'index'])->name('resolutions.index');
        Route::get('resolutions/{resolution}', [AdminResolutionController::class, 'show'])->name('resolutions.show');
    });

    // ─────────────────────────────────────────────
    // Encoder only — full CRUD on content
    // (Admin/SuperAdmin are routed separately below via their own
    // controllers, so this block is scoped to the Encoder tier alone.)
    // ─────────────────────────────────────────────
    Route::middleware('role:encoder')->group(function () {
        Route::resource('committee-reports', EncoderCommitteeReportController::class)->except(['index', 'show']);
        Route::delete('committee-reports/{committeeReport}/attachments/{attachment}', [EncoderCommitteeReportController::class, 'destroyAttachment'])
            ->name('committee-reports.attachments.destroy');

        // Feedback CRUD — everyone Encoder+ can manage their own feedback.
        // index/show visibility is scoped in the controller: SuperAdmin sees
        // everyone's feedback, everyone else (Encoder/Admin) sees only their own.
        Route::resource('feedback', EncoderFeedbackController::class)->except(['edit']);

        Route::resource('minutes', EncoderMinutesController::class)->except(['index', 'show']);

        Route::resource('ordinances', EncoderOrdinanceController::class)->except(['index', 'show']);
        Route::post('ordinances/{ordinance}/versions', [EncoderOrdinanceController::class, 'storeVersion'])
            ->name('ordinances.versions.store');
        Route::delete('ordinances/{ordinance}/versions/{version}', [EncoderOrdinanceController::class, 'destroyVersion'])
            ->name('ordinances.versions.destroy');

        Route::resource('resolutions', EncoderResolutionController::class)->except(['index', 'show']);
        Route::post('resolutions/{resolution}/clauses', [EncoderResolutionController::class, 'storeClause'])
            ->name('resolutions.clauses.store');
        Route::delete('resolutions/{resolution}/clauses/{clause}', [EncoderResolutionController::class, 'destroyClause'])
            ->name('resolutions.clauses.destroy');
    });

    // ─────────────────────────────────────────────
    // Admin and above — full CRUD via Admin controllers,
    // plus user account management and audit log CRUD
    // ─────────────────────────────────────────────
    Route::prefix('admin')->as('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', AdminDashboardController::class)->name('dashboard');
        Route::resource('users', UserController::class);

        Route::resource('committee-reports', AdminCommitteeReportController::class); // remove except(['index','show'])
        Route::resource('feedback', AdminFeedbackController::class)->except(['edit']);
        Route::resource('minutes', AdminMinutesController::class); // remove except
        Route::resource('ordinances', AdminOrdinanceController::class); // remove except
        Route::resource('resolutions', AdminResolutionController::class); // remove except

        Route::resource('audit-logs', AdminAuditLogController::class);
    });

});

require __DIR__.'/settings.php';