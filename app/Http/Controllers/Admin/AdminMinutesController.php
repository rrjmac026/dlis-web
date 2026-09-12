<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Models\Minutes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminMinutesController extends Controller
{
    public function index(Request $request)
    {
        $query = Minutes::query()->latest('date');

        if ($request->filled('session_type')) {
            $query->where('session_type', $request->session_type);
        }

        $minutes = $query->paginate(20)->withQueryString();

        return Inertia::render($this->pagePath($request, 'index'), [
            'minutes' => $minutes,
            'filters' => $request->only(['session_type']),
            'sessionTypes' => $this->sessionTypeOptions(),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render($this->pagePath($request, 'create'), [
            'sessionTypes' => $this->sessionTypeOptions(),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $minutes = Minutes::create([
            ...collect($data)->except('document')->all(),
            'document_path' => $request->hasFile('document')
                ? $request->file('document')->store('minutes', 'public')
                : null,
        ]);

        AuditLogController::log('Minutes Created', "Created minutes for {$minutes->session_type} on {$minutes->date}");

        return redirect()->route($this->routeName($request, 'show'), $minutes)->with('success', 'Minutes recorded.');
    }

    public function show(Request $request, Minutes $minutes)
    {
        return Inertia::render($this->pagePath($request, 'show'), [
            'minutes' => $minutes,
            'documentUrl' => $minutes->document_path
                ? Storage::disk('public')->url($minutes->document_path)
                : null,
            'basePath' => $this->basePath($request),
        ]);
    }

    public function edit(Request $request, Minutes $minutes)
    {
        return Inertia::render($this->pagePath($request, 'edit'), [
            'minutes' => $minutes,
            'sessionTypes' => $this->sessionTypeOptions(),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function update(Request $request, Minutes $minutes)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('document')) {
            if ($minutes->document_path) {
                Storage::disk('public')->delete($minutes->document_path);
            }
            $data['document_path'] = $request->file('document')->store('minutes', 'public');
        }

        $minutes->update(collect($data)->except('document')->all());

        AuditLogController::log('Minutes Updated', "Updated minutes #{$minutes->id}");

        return redirect()->route($this->routeName($request, 'show'), $minutes)->with('success', 'Minutes updated.');
    }

    public function destroy(Minutes $minutes)
    {
        if ($minutes->document_path) {
            Storage::disk('public')->delete($minutes->document_path);
        }

        $minutes->delete();

        AuditLogController::log('Minutes Deleted', "Deleted minutes #{$minutes->id}");

        return redirect()->route($this->routeName(request(), 'index'))->with('success', 'Minutes deleted.');
    }

    protected function rules(): array
    {
        return [
            'session_type' => ['required', 'string', 'in:Regular Session,Special Session'],
            'date' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ];
    }

    private function sessionTypeOptions(): array
    {
        return [
            ['value' => 'Regular Session', 'label' => 'Regular Session'],
            ['value' => 'Special Session', 'label' => 'Special Session'],
        ];
    }

    private function basePath(Request $request): string
    {
        return $request->is('admin/minutes*') ? '/admin/minutes' : '/minutes';
    }

    private function routeName(Request $request, string $action): string
    {
        return ($request->is('admin/minutes*') ? 'admin.minutes.' : 'minutes.') . $action;
    }

    /**
     * Resolve which page folder to render into, since this controller
     * serves both Admin's '/admin/minutes' routes and Viewer's plain
     * '/minutes' read-only routes, which live in separate folders
     * under resources/js/pages (admin/minutes vs viewer/minutes).
     */
    private function pagePath(Request $request, string $view): string
    {
        $folder = $request->is('admin/minutes*') ? 'admin/minutes' : 'viewer/minutes';

        return "{$folder}/{$view}";
    }
}