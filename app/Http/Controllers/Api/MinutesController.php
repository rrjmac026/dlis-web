<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\Minutes;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class MinutesController extends Controller
{
    public function __construct(protected DocumentService $documents) {}

    public function index(Request $request)
    {
        $query = Minutes::query()->latest('date');

        if ($request->filled('session_type')) {
            $query->where('session_type', $request->session_type);
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Minutes $minutes)
    {
        return response()->json([
            'minutes' => $minutes,
            'document_url' => $this->documents->resolveUrl($minutes->document_path),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $minutes = Minutes::create([
            'session_type' => $data['session_type'],
            'date' => $data['date'] ?? null,
            'document_path' => $request->hasFile('document')
                ? $this->documents->store($request->file('document'), 'minutes')
                : null,
        ]);

        AuditLogController::log('Minutes Created', "Created minutes for {$minutes->session_type} on {$minutes->date}");

        return response()->json($minutes, 201);
    }

    public function update(Request $request, Minutes $minutes)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('document')) {
            $data['document_path'] = $this->documents->replace(
                $minutes->document_path,
                $request->file('document'),
                'minutes'
            );
        }

        $minutes->update(collect($data)->except('document')->all());

        AuditLogController::log('Minutes Updated', "Updated minutes #{$minutes->id}");

        return response()->json($minutes);
    }

    public function destroy(Minutes $minutes)
    {
        $this->documents->delete($minutes->document_path);
        $minutes->delete();

        AuditLogController::log('Minutes Deleted', "Deleted minutes #{$minutes->id}");

        return response()->json(null, 204);
    }

    protected function rules(): array
    {
        return [
            'session_type' => ['required', 'string', 'in:Regular Session,Special Session'],
            'date' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ];
    }
}