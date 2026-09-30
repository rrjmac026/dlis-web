<?php

namespace App\Http\Controllers\Api;

use App\Casts\OrdinalEnumCast;
use App\Enums\OrdinanceStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CommitteeReport;
use App\Models\Minutes;
use App\Models\Ordinance;
use App\Models\Resolution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $year = now()->year;
        $user = $request->user();
        $isAdmin = $user->role->value >= UserRole::Admin->value;

        // toBase() skips Eloquent casts, so `status` comes back as the raw DB ordinal.
        // Convert it to the enum string ("in_effect") the WPF client expects.
        $byStatus = Ordinance::query()->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->mapWithKeys(fn ($n, $status) => [
                (OrdinalEnumCast::valueOf(OrdinanceStatus::class, $status) ?? (string) $status) => (int) $n,
            ]);

        $recent = collect()
            ->concat($this->recentFrom(Ordinance::class, 'date_passed', 'ordinance', 'ordinance_number', 'status', OrdinanceStatus::class))
            ->concat($this->recentFrom(Resolution::class, 'date_approved', 'resolution', 'resolution_number', null))
            ->concat($this->recentFrom(CommitteeReport::class, 'date', 'committee_report', 'report_number', 'subject'))
            ->sortByDesc('date')
            ->take(6)
            ->values();

        // Admins see everyone's activity; everyone else sees only their own.
        $activity = AuditLog::query()
            ->when(! $isAdmin, fn ($q) => $q->where('user_id', $user->id))
            ->latest('created_at')
            ->take(6)
            ->get(['id', 'username', 'action', 'details', 'source', 'created_at']);

        return response()->json([
            'ordinances' => [
                'total' => Ordinance::query()->count(),
                'this_year' => Ordinance::query()->whereYear('date_passed', $year)->count(),
                // (object) so an empty result serializes as {} instead of [] (the WPF client expects a dictionary)
                'by_status' => (object) $byStatus->all(),
            ],
            'resolutions' => [
                'total' => Resolution::query()->count(),
                'this_year' => Resolution::query()->whereYear('date_approved', $year)->count(),
            ],
            'committee_reports' => [
                'total' => CommitteeReport::query()->count(),
                'this_year' => CommitteeReport::query()->whereYear('date', $year)->count(),
            ],
            'minutes' => [
                'total' => Minutes::query()->count(),
                'this_year' => Minutes::query()->whereYear('date', $year)->count(),
            ],
            'users' => $isAdmin ? [
                'total' => User::query()->count(),
                'active' => User::query()->where('is_active', true)->count(),
            ] : null,
            'recent' => $recent,
            'recent_activity' => $activity,
            'activity_scope' => $isAdmin ? 'all' : 'own',
        ]);
    }

    /**
     * @param class-string<\BackedEnum>|null $enumClass  set when $detailColumn holds a DB ordinal
     */
    protected function recentFrom(
        string $model,
        string $dateColumn,
        string $type,
        string $numberColumn,
        ?string $detailColumn,
        ?string $enumClass = null
    ) {
        $columns = array_values(array_filter([$numberColumn, $detailColumn, $dateColumn]));

        return $model::query()->toBase()
            ->whereNotNull($dateColumn)
            ->orderByDesc($dateColumn)
            ->limit(6)
            ->get($columns)
            ->map(function ($row) use ($type, $numberColumn, $detailColumn, $dateColumn, $enumClass) {
                $detail = $detailColumn ? $row->{$detailColumn} : null;

                if ($detail !== null && $enumClass) {
                    $detail = OrdinalEnumCast::valueOf($enumClass, $detail);
                }

                return [
                    'type' => $type,
                    'number' => $row->{$numberColumn},
                    'detail' => $detail !== null ? (string) $detail : null,
                    'date' => Carbon::parse($row->{$dateColumn})->toDateString(),
                ];
            });
    }
}