<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CommitteeReport;
use App\Models\Feedback;
use App\Models\Minutes;
use App\Models\Ordinance;
use App\Models\Resolution;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EncoderDashboardController extends Controller
{
	public function __invoke(): Response
	{
		return Inertia::render('encoder/dashboard', [
			'stats' => [
				'ordinances' => Ordinance::count(),
				'resolutions' => Resolution::count(),
				'minutes' => Minutes::count(),
				'committeeReports' => CommitteeReport::count(),
				'feedback' => Feedback::count(),
			],
			// Scoped to the logged-in Encoder's own activity, unlike Admin's
			// dashboard which shows activity across every user.
			'recentActivity' => AuditLog::query()
				->where('username', Auth::user()?->username)
				->latest('created_at')
				->limit(8)
				->get(['id', 'username', 'action', 'details', 'created_at']),
		]);
	}
}