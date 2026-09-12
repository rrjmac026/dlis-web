<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Models\Minutes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EncoderMinutesController extends Controller
{
    public function index(Request $request)
    {
        $query = Minutes::query()->latest('date');

        if ($request->filled('session_type')) {
            $query->where('session_type', $request->session_type);
        }

        $minutes = $query->paginate(20)->withQueryString();

        return Inertia::render('encoder/minutes/index', [
            'minutes' => $minutes,
            'filters' => $request->only(['session_type']),
            'basePath' => '/encoder/minutes',
        ]);
    }

    public function create()
    {
        return Inertia::render('encoder/minutes/create', [
            'basePath' => '/encoder/minutes',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'session_type' => ['required', 'string', 'in:Regular Session,Special Session'],
            'date' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ]);

        $minutes = Minutes::create([
            'session_type' => $data['session_type'],
            'date' => $data['date'] ?? null,
            'document_path' => $request->hasFile('document')
                ? $request->file('document')->store('minutes', 'public')
                : null,
        ]);

        AuditLogController::log('Minutes Created', "Created minutes for {$minutes->session_type} on {$minutes->date}");

        return redirect()->route('encoder.minutes.show', $minutes)->with('success', 'Minutes recorded.');
    }

    public function show(Minutes $minutes)
    {
        return Inertia::render('encoder/minutes/show', [
            'minutes' => $minutes,
            'basePath' => '/encoder/minutes',
        ]);
    }

    public function edit(Minutes $minutes)
    {
        return Inertia::render('encoder/minutes/edit', [
            'minutes' => $minutes,
            'basePath' => '/encoder/minutes',
        ]);
    }

    public function update(Request $request, Minutes $minutes)
    {
        $data = $request->validate([
            'session_type' => ['required', 'string', 'in:Regular Session,Special Session'],
            'date' => ['nullable', 'date'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ]);

        if ($request->hasFile('document')) {
            if ($minutes->document_path) {
                Storage::disk('public')->delete($minutes->document_path);
            }
            $data['document_path'] = $request->file('document')->store('minutes', 'public');
        }

        $minutes->update(collect($data)->except('document')->all());

        AuditLogController::log('Minutes Updated', "Updated minutes #{$minutes->id}");

        return redirect()->route('encoder.minutes.show', $minutes)->with('success', 'Minutes updated.');
    }

    public function destroy(Minutes $minutes)
    {
        if ($minutes->document_path) {
            Storage::disk('public')->delete($minutes->document_path);
        }

        $minutes->delete();

        AuditLogController::log('Minutes Deleted', "Deleted minutes #{$minutes->id}");

        return redirect()->route('encoder.minutes.index')->with('success', 'Minutes deleted.');
    }
}