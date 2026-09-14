<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Models\Resolution;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EncoderResolutionController extends Controller
{
    public function __construct(protected DocumentService $documents) {}

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

        return Inertia::render('encoder/resolutions/index', [
            'resolutions' => $resolutions,
            'filters' => $request->only(['search']),
            'basePath' => '/encoder/resolutions',
        ]);
    }

    public function create()
    {
        return Inertia::render('encoder/resolutions/create', [
            'basePath' => '/encoder/resolutions',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $resolution = Resolution::create([
            ...collect($data)->except('document')->all(),
            'document_path' => $request->hasFile('document')
                ? $this->documents->store($request->file('document'), 'resolutions')
                : null,
            'added_by' => auth()->user()?->username,
            'added_at' => now(),
        ]);

        AuditLogController::log('Resolution Created', "Created resolution '{$resolution->resolution_number}'");

        return redirect()->route('encoder.resolutions.show', $resolution)->with('success', 'Resolution created.');
    }

    public function show(Resolution $resolution)
    {
        $documentUrl = $this->documents->resolveUrl($resolution->document_path);

        return Inertia::render('encoder/resolutions/show', [
            'resolution' => $resolution,
            'documentUrl' => $documentUrl,
            'documentViewUrl' => $this->documents->resolveViewUrl($documentUrl),
            'basePath' => '/encoder/resolutions',
        ]);
    }

    public function edit(Resolution $resolution)
    {
        return Inertia::render('encoder/resolutions/edit', [
            'resolution' => $resolution,
            'basePath' => '/encoder/resolutions',
        ]);
    }

    public function update(Request $request, Resolution $resolution)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('document')) {
            $data['document_path'] = $this->documents->replace(
                $resolution->document_path,
                $request->file('document'),
                'resolutions'
            );
        }

        $resolution->update(collect($data)->except('document')->all());

        AuditLogController::log('Resolution Updated', "Updated resolution '{$resolution->resolution_number}'");

        return redirect()->route('encoder.resolutions.show', $resolution)->with('success', 'Resolution updated.');
    }

    public function destroy(Resolution $resolution)
    {
        $this->documents->delete($resolution->document_path);

        $number = $resolution->resolution_number;
        $resolution->delete();

        AuditLogController::log('Resolution Deleted', "Deleted resolution '{$number}'");

        return redirect()->route('encoder.resolutions.index')->with('success', 'Resolution deleted.');
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
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ];
    }
}