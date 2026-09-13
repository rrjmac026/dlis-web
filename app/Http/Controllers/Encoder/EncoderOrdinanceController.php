<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Enums\FinalAction;
use App\Enums\OrdinanceState;
use App\Enums\OrdinanceStatus;
use App\Enums\TypeOfLaw;
use App\Models\Ordinance;
use App\Models\OrdinanceVersion;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EncoderOrdinanceController extends Controller
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

        $ordinances = $query->paginate(20)->withQueryString();

        return Inertia::render('encoder/ordinances/index', [
            'ordinances' => $ordinances,
            'filters' => $request->only(['search', 'status']),
            'statuses' => $this->enumOptions(OrdinanceStatus::cases()),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('encoder/ordinances/create', [
            ...$this->formOptions(),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $ordinance = Ordinance::create([
            ...collect($data)->except('document')->all(),
            'document_path' => $request->hasFile('document')
                ? $this->documents->store($request->file('document'), 'ordinances')
                : null,
            'added_by' => auth()->user()?->username,
            'added_at' => now(),
        ]);

        AuditLogController::log('Ordinance Created', "Created ordinance '{$ordinance->ordinance_number}'");

        return redirect()->route($this->routeName($request, 'show'), $ordinance)->with('success', 'Ordinance created.');
    }

    public function show(Request $request, Ordinance $ordinance)
    {
        $ordinance->load('versions');

        $documentUrl = $this->documents->resolveUrl($ordinance->document_path);

        return Inertia::render('encoder/ordinances/show', [
            'ordinance' => $ordinance,
            'documentUrl' => $documentUrl,
            'documentViewUrl' => $this->documents->resolveViewUrl($documentUrl),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function edit(Request $request, Ordinance $ordinance)
    {
        return Inertia::render('encoder/ordinances/edit', [
            'ordinance' => $ordinance,
            ...$this->formOptions(),
            'basePath' => $this->basePath($request),
        ]);
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

        return redirect()->route($this->routeName($request, 'show'), $ordinance)->with('success', 'Ordinance updated.');
    }

    public function destroy(Request $request, Ordinance $ordinance)
    {
        $this->documents->delete($ordinance->document_path);

        $number = $ordinance->ordinance_number;
        $ordinance->delete(); // versions cascade via FK

        AuditLogController::log('Ordinance Deleted', "Deleted ordinance '{$number}'");

        return redirect()->route($this->routeName($request, 'index'))->with('success', 'Ordinance deleted.');
    }

    /**
     * Add a new amendment version to an ordinance (mirrors HasAmendments/LatestVersion usage).
     */
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

        return redirect()->route($this->routeName($request, 'show'), $ordinance)->with('success', 'Amendment added.');
    }

    public function destroyVersion(Ordinance $ordinance, OrdinanceVersion $version)
    {
        abort_if($version->ordinance_id !== $ordinance->id, 404);

        $version->delete();

        AuditLogController::log(
            'Ordinance Version Deleted',
            "Removed version {$version->version_number} from ordinance '{$ordinance->ordinance_number}'"
        );

        return back()->with('success', 'Version removed.');
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

    private function formOptions(): array
    {
        return [
            'types' => $this->enumOptions(TypeOfLaw::cases()),
            'statuses' => $this->enumOptions(OrdinanceStatus::cases()),
            'states' => $this->enumOptions(OrdinanceState::cases()),
            'finalActions' => $this->enumOptions(FinalAction::cases()),
        ];
    }

    private function enumOptions(array $cases): array
    {
        return array_map(
            fn ($case) => [
                'value' => $case->value,
                'label' => str_replace('_', ' ', ucfirst($case->name)),
            ],
            $cases,
        );
    }

    private function basePath(Request $request): string
    {
        return '/encoder/ordinances';
    }

    private function routeName(Request $request, string $action): string
    {
        return 'encoder.ordinances.' . $action;
    }
}