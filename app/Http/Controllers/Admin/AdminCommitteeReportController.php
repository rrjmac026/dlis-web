<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Models\CommitteeReport;
use App\Models\CommitteeReportAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCommitteeReportController extends Controller
{
    public function index(Request $request)
    {
        $query = CommitteeReport::query()->withCount('attachments')->latest('date');

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('report_number', 'like', "%{$term}%")
                    ->orWhere('subject', 'like', "%{$term}%")
                    ->orWhere('submitted_by', 'like', "%{$term}%");
            });
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render($this->pagePath($request, 'index'), [
            'reports' => $reports,
            'filters' => $request->only(['search']),
            'basePath' => $this->basePath($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render($this->pagePath($request, 'create'), [
            'basePath' => $this->basePath($request),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $report = CommitteeReport::create([
            ...collect($data)->except('attachments')->all(),
            'added_by' => auth()->user()?->username,
            'added_at' => now(),
        ]);

        $this->storeAttachments($request, $report);

        AuditLogController::log('Committee Report Created', "Created report '{$report->report_number}'");

        return redirect()->route($this->routeName($request, 'show'), $report)->with('success', 'Committee report created.');
    }

    public function show(Request $request, CommitteeReport $committeeReport)
    {
        $committeeReport->load('attachments');

        return Inertia::render($this->pagePath($request, 'show'), [
            'report' => $committeeReport,
            'basePath' => $this->basePath($request),
        ]);
    }

    public function edit(Request $request, CommitteeReport $committeeReport)
    {
        $committeeReport->load('attachments');

        return Inertia::render($this->pagePath($request, 'edit'), [
            'report' => $committeeReport,
            'basePath' => $this->basePath($request),
        ]);
    }

    public function update(Request $request, CommitteeReport $committeeReport)
    {
        $data = $request->validate($this->rules());

        $committeeReport->update(collect($data)->except('attachments')->all());

        $this->storeAttachments($request, $committeeReport);

        AuditLogController::log('Committee Report Updated', "Updated report '{$committeeReport->report_number}'");

        return redirect()->route($this->routeName($request, 'show'), $committeeReport)->with('success', 'Committee report updated.');
    }

    public function destroy(Request $request, CommitteeReport $committeeReport)
    {
        foreach ($committeeReport->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $reportNumber = $committeeReport->report_number;
        $committeeReport->delete();

        AuditLogController::log('Committee Report Deleted', "Deleted report '{$reportNumber}'");

        return redirect()->route($this->routeName($request, 'index'))->with('success', 'Committee report deleted.');
    }

    public function destroyAttachment(CommitteeReport $committeeReport, CommitteeReportAttachment $attachment)
    {
        abort_if($attachment->committee_report_id !== $committeeReport->id, 404);

        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        AuditLogController::log('Attachment Deleted', "Deleted attachment '{$attachment->file_name}' from report '{$committeeReport->report_number}'");

        return back()->with('success', 'Attachment removed.');
    }

    protected function storeAttachments(Request $request, CommitteeReport $report): void
    {
        if (!$request->hasFile('attachments')) {
            return;
        }

        foreach ($request->file('attachments') as $file) {
            $path = $file->store('committee-reports/' . $report->id, 'public');

            $report->attachments()->create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
            ]);
        }
    }

    protected function rules(): array
    {
        return [
            'report_number' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'submitted_by' => ['nullable', 'string', 'max:255'],
            'sponsored_by' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:1000'],
            'attachments.*' => ['nullable', 'file', 'max:10240'],
        ];
    }

    private function basePath(Request $request): string
    {
        return $request->is('admin/committee-reports*') ? '/admin/committee-reports' : '/committee-reports';
    }

    private function routeName(Request $request, string $action): string
    {
        return ($request->is('admin/committee-reports*') ? 'admin.committee-reports.' : 'committee-reports.') . $action;
    }

    /**
     * Resolve which page folder to render into, mirroring AdminOrdinanceController:
     * serves both Admin's '/admin/committee-reports' routes and Viewer's read-only
     * '/committee-reports' routes from separate folders under resources/js/pages.
     */
    private function pagePath(Request $request, string $view): string
    {
        $folder = $request->is('admin/committee-reports*') ? 'admin/commitee-reports' : 'viewer/committee-reports';

        return "{$folder}/{$view}";
    }
}