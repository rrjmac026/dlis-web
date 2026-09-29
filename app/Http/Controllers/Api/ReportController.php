<?php

namespace App\Http\Controllers\Api;

use App\Casts\OrdinalEnumCast;
use App\Enums\OrdinanceStatus;
use App\Http\Controllers\Controller;
use App\Models\Ordinance;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * Full, UNPAGINATED ordinance list for the WPF Reports page
     * (it exports/prints everything it receives, so paginating would truncate reports).
     *
     * Filters: ?year=2024  ?status=in_effect  ?amended=1 (ordinances with more than one version)
     */
    public function ordinances(Request $request)
    {
        $query = Ordinance::query()->latest('date_passed');

        if ($request->filled('year')) {
            $query->whereYear('date_passed', (int) $request->input('year'));
        }

        if ($request->filled('status')) {
            // The column stores the ordinal, so convert ("in_effect" -> 0) before filtering.
            $query->where('status', OrdinalEnumCast::toOrdinal(OrdinanceStatus::class, $request->input('status')) ?? -1);
        }

        if ($request->boolean('amended')) {
            $query->has('versions', '>', 1);
        }

        return response()->json($query->get());
    }

    /** Distinct years that have at least one ordinance, newest first — feeds the "By Year" filter. */
    public function ordinanceYears()
    {
        $years = Ordinance::query()
            ->whereNotNull('date_passed')
            ->pluck('date_passed')
            ->map(fn ($date) => Carbon::parse($date)->year)
            ->unique()
            ->sortDesc()
            ->values();

        return response()->json($years);
    }
}