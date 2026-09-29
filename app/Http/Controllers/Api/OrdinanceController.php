<?php

namespace App\Http\Controllers\Api;

use App\Enums\FinalAction;
use App\Enums\OrdinanceState;
use App\Enums\OrdinanceStatus;
use App\Enums\TypeOfLaw;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\Ordinance;
use App\Models\OrdinanceVersion;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrdinanceController extends Controller
{
    public function __construct(protected DocumentService $documents) {}

    public function index(Request $request)
    {
        $query = Ordinance::query()->with('versions')->latest('date_passed');

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('ordinance_number', 'like', "%{$term}%")
                    ->orWhere('title', 'like', "%{$term}%")
                    ->orWhere('subject', 'like', "%{$term}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Ordinance $ordinance)
    {
        $ordinance->load('versions');

        // Fixed: was wrapping the response in {ordinance, document_url},
        // which broke ApiOrdinance deserialization on the C# side (it expects
        // the ordinance's fields at the top level, same shape store()/update()
        // already return). document_path is already a field on the model
        // itself, so no wrapper/extra resolution is needed here.
        return response()->json($ordinance);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $ordinance = Ordinance::create([
            ...collect($data)->except('document')->all(),
            'document_path' => $request->hasFile('document')
                ? $this->documents->store($request->file('document'), 'ordinances')
                : null,
            'added_by' => $request->user()->username,
            'added_at' => now(),
        ]);

        AuditLogController::log('Ordinance Created', "Created ordinance '{$ordinance->ordinance_number}'");

        return response()->json($ordinance->load('versions'), 201);
    }

    public function update(Request $request, Ordinance $ordinance)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('document')) {
            $data['document_path'] = $this->documents->replace(
                $ordinance->document_path,
                $request->file('document'),
                'ordinances'
            );
        }

        $ordinance->update(collect($data)->except('document')->all());

        AuditLogController::log('Ordinance Updated', "Updated ordinance '{$ordinance->ordinance_number}'");

        return response()->json($ordinance->load('versions'));
    }

    public function destroy(Ordinance $ordinance)
    {
        $this->documents->delete($ordinance->document_path);
        $number = $ordinance->ordinance_number;
        $ordinance->delete();

        AuditLogController::log('Ordinance Deleted', "Deleted ordinance '{$number}'");

        return response()->json(null, 204);
    }

    public function storeVersion(Request $request, Ordinance $ordinance)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'date_enacted' => ['required', 'date'],
            'enacted_by' => ['required', 'string', 'max:255'],
            'amendment_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $nextVersion = ($ordinance->versions()->max('version_number') ?? 0) + 1;

        $version = OrdinanceVersion::create([
            ...$data,
            'ordinance_id' => $ordinance->id,
            'version_number' => $nextVersion,
        ]);

        $ordinance->update(['status' => OrdinanceStatus::Amended->value]);

        AuditLogController::log(
            'Ordinance Amended',
            "Added version {$version->version_number} to ordinance '{$ordinance->ordinance_number}'"
        );

        return response()->json($version, 201);
    }

    protected function rules(): array
    {
        return [
            'ordinance_number' => ['required', 'string', 'max:255'],
            'series_number' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:2000'],
            'type' => ['required', Rule::enum(TypeOfLaw::class)],
            'status' => ['required', Rule::enum(OrdinanceStatus::class)],
            'sponsor' => ['nullable', 'string', 'max:255'],
            'committee' => ['nullable', 'string', 'max:255'],
            'date_passed' => ['nullable', 'date'],
            'date_approved' => ['nullable', 'date'],
            'date_published' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'nrs_nsb' => ['nullable', 'string', 'max:255'],
            'nomenclature' => ['nullable', 'string', 'max:255'],
            'final_action' => ['nullable', Rule::enum(FinalAction::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', Rule::enum(OrdinanceState::class)],
        ];
    }
}