<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\Resolution;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class ResolutionController extends Controller
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

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Resolution $resolution)
    {
        $resolution->load('clauses');

        return response()->json([
            'resolution' => $resolution,
            'document_url' => $this->documents->resolveUrl($resolution->document_path),
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
            'added_by' => $request->user()->username,
            'added_at' => now(),
        ]);

        AuditLogController::log('Resolution Created', "Created resolution '{$resolution->resolution_number}'");

        return response()->json($resolution, 201);
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

        return response()->json($resolution);
    }

    public function destroy(Resolution $resolution)
    {
        $this->documents->delete($resolution->document_path);
        $number = $resolution->resolution_number;
        $resolution->delete();

        AuditLogController::log('Resolution Deleted', "Deleted resolution '{$number}'");

        return response()->json(null, 204);
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