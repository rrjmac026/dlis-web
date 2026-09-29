<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommitteeReport;
use App\Models\Ordinance;
use App\Models\Resolution;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $year = now()->year;

        // toBase() skips Eloquent casts so `status` stays the raw string value
        // (grouping by an enum-cast column as a key would blow up otherwise).
        $byStatus = Ordinance::query()->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($n) => (int) $n);

        $recent = collect()
            ->concat($this->recentFrom(Ordinance::class, 'date_passed', 'ordinance', 'ordinance_number', 'status'))
            ->concat($this->recentFrom(Resolution::class, 'date_approved', 'resolution', 'resolution_number', null))
            ->concat($this->recentFrom(CommitteeReport::class, 'date', 'committee_report', 'report_number', 'subject'))
            ->sortByDesc('date')
            ->take(6)
            ->values();

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
            'recent' => $recent,
        ]);
    }

    protected function recentFrom(
        string $model,
        string $dateColumn,
        string $type,
        string $numberColumn,
        ?string $detailColumn
    ) {
        $columns = array_values(array_filter([$numberColumn, $detailColumn, $dateColumn]));

        return $model::query()->toBase()
            ->whereNotNull($dateColumn)
            ->orderByDesc($dateColumn)
            ->limit(6)
            ->get($columns)
            ->map(fn ($row) => [
                'type' => $type,
                'number' => $row->{$numberColumn},
                'detail' => $detailColumn ? $row->{$detailColumn} : null,
                'date' => Carbon::parse($row->{$dateColumn})->toDateString(),
            ]);
    }
}