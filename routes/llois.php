<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\CommitteeReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MinutesController;
use App\Http\Controllers\OrdinanceController;
use App\Http\Controllers\ResolutionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    Route::resource('users', UserController::class);

    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');

    Route::resource('committee-reports', CommitteeReportController::class);
    Route::delete('committee-reports/{committeeReport}/attachments/{attachment}', [CommitteeReportController::class, 'destroyAttachment'])
        ->name('committee-reports.attachments.destroy');

    Route::resource('feedback', FeedbackController::class)->except(['edit']);

    Route::resource('minutes', MinutesController::class);

    Route::resource('ordinances', OrdinanceController::class);
    Route::post('ordinances/{ordinance}/versions', [OrdinanceController::class, 'storeVersion'])
        ->name('ordinances.versions.store');
    Route::delete('ordinances/{ordinance}/versions/{version}', [OrdinanceController::class, 'destroyVersion'])
        ->name('ordinances.versions.destroy');

    Route::resource('resolutions', ResolutionController::class);
    Route::post('resolutions/{resolution}/clauses', [ResolutionController::class, 'storeClause'])
        ->name('resolutions.clauses.store');
    Route::delete('resolutions/{resolution}/clauses/{clause}', [ResolutionController::class, 'destroyClause'])
        ->name('resolutions.clauses.destroy');

});
