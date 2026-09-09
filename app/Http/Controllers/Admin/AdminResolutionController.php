<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Models\Resolution;
use App\Models\ResolutionClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminResolutionController extends Controller
{
    public function index(Request $request)
    {
        $query = Resolution::query()->latest('date_approved');

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('resolution_number', 'like', "%{$term}%")
                    ->orWhere('title', 'like', "%{$term}%")
                    ->orWhere('sponsor', 'like', "%{$term}%");
            });
        }

        $resolutions = $query->paginate(20)->withQueryString();

        return view('resolutions.index', compact('resolutions'));
    }

    public function create()
    {
        return view('resolutions.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $resolution = Resolution::create([
            ...collect($data)->except('document')->all(),
            'document_path' => $request->hasFile('document')
                ? $request->file('document')->store('resolutions', 'public')
                : null,
            'added_by' => auth()->user()?->username,
            'added_at' => now(),
        ]);

        $this->syncClauses($request, $resolution);

        AuditLogController::log('Resolution Created', "Created resolution '{$resolution->resolution_number}'");

        return redirect()->route('resolutions.show', $resolution)->with('success', 'Resolution created.');
    }

    public function show(Resolution $resolution)
    {
        $resolution->load('clauses');

        return view('resolutions.show', compact('resolution'));
    }

    public function edit(Resolution $resolution)
    {
        $resolution->load('clauses');

        return view('resolutions.edit', compact('resolution'));
    }

    public function update(Request $request, Resolution $resolution)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('document')) {
            if ($resolution->document_path) {
                Storage::disk('public')->delete($resolution->document_path);
            }
            $data['document_path'] = $request->file('document')->store('resolutions', 'public');
        }

        $resolution->update(collect($data)->except('document')->all());

        $this->syncClauses($request, $resolution);

        AuditLogController::log('Resolution Updated', "Updated resolution '{$resolution->resolution_number}'");

        return redirect()->route('resolutions.show', $resolution)->with('success', 'Resolution updated.');
    }

    public function destroy(Resolution $resolution)
    {
        if ($resolution->document_path) {
            Storage::disk('public')->delete($resolution->document_path);
        }

        $number = $resolution->resolution_number;
        $resolution->delete(); // clauses cascade via FK

        AuditLogController::log('Resolution Deleted', "Deleted resolution '{$number}'");

        return redirect()->route('resolutions.index')->with('success', 'Resolution deleted.');
    }

    /**
     * Add a single Whereas/Resolved clause without touching the rest of the resolution.
     */
    public function storeClause(Request $request, Resolution $resolution)
    {
        $data = $request->validate([
            'clause_type' => ['required', 'string', 'in:Whereas,Resolved'],
            'text' => ['required', 'string', 'max:5000'],
        ]);

        $nextOrder = ($resolution->clauses()
            ->where('clause_type', $data['clause_type'])
            ->max('order') ?? 0) + 1;

        $resolution->clauses()->create([
            ...$data,
            'order' => $nextOrder,
        ]);

        AuditLogController::log('Resolution Clause Added', "Added {$data['clause_type']} clause to resolution '{$resolution->resolution_number}'");

        return back()->with('success', 'Clause added.');
    }

    public function destroyClause(Resolution $resolution, ResolutionClause $clause)
    {
        abort_if($clause->resolution_id !== $resolution->id, 404);

        $clause->delete();

        AuditLogController::log('Resolution Clause Deleted', "Removed a clause from resolution '{$resolution->resolution_number}'");

        return back()->with('success', 'Clause removed.');
    }

    /**
     * Accepts optional bulk clause arrays from the create/edit form, e.g.
     * whereas_clauses[] and resolved_clauses[], and replaces existing clauses.
     */
    protected function syncClauses(Request $request, Resolution $resolution): void
    {
        if (!$request->has('whereas_clauses') && !$request->has('resolved_clauses')) {
            return;
        }

        $resolution->clauses()->delete();

        foreach ($request->input('whereas_clauses', []) as $i => $text) {
            if (trim($text) === '') {
                continue;
            }
            $resolution->clauses()->create([
                'clause_type' => 'Whereas',
                'order' => $i + 1,
                'text' => $text,
            ]);
        }

        foreach ($request->input('resolved_clauses', []) as $i => $text) {
            if (trim($text) === '') {
                continue;
            }
            $resolution->clauses()->create([
                'clause_type' => 'Resolved',
                'order' => $i + 1,
                'text' => $text,
            ]);
        }
    }

    protected function rules(): array
    {
        return [
            'resolution_number' => ['required', 'string', 'max:255'],
            'sb_term' => ['nullable', 'string', 'max:255'],
            'session_info' => ['nullable', 'string', 'max:255'],
            'committee' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'sponsor' => ['nullable', 'string', 'max:255'],
            'date_approved' => ['nullable', 'date'],
            'affirmative_votes' => ['nullable', 'string', 'max:255'],
            'negative_votes' => ['nullable', 'string', 'max:255'],
            'abstained_votes' => ['nullable', 'string', 'max:255'],
            'absent_votes' => ['nullable', 'string', 'max:255'],
            'certified_adopted_by' => ['nullable', 'string', 'max:255'],
            'certified_date' => ['nullable', 'date'],
            'verified_by' => ['nullable', 'string', 'max:255'],
            'verified_date' => ['nullable', 'date'],
            'attested_by' => ['nullable', 'string', 'max:255'],
            'attested_date' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ];
    }
}
