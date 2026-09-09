<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CommitteeReport;
use App\Models\Feedback;
use App\Models\Minutes;
use App\Models\Ordinance;
use App\Models\Resolution;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
	public function __invoke(): Response
	{
		return Inertia::render('admin/dashboard', [
			'stats' => [
				'users' => User::count(),
				'activeUsers' => User::where('is_active', true)->count(),
				'ordinances' => Ordinance::count(),
				'resolutions' => Resolution::count(),
				'minutes' => Minutes::count(),
				'committeeReports' => CommitteeReport::count(),
				'feedback' => Feedback::count(),
			],
			'recentActivity' => AuditLog::query()
				->latest('created_at')
				->limit(8)
				->get(['id', 'username', 'action', 'details', 'created_at']),
		]);
	}
}
