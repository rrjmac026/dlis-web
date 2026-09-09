<?php

namespace App\Http\Controllers;

use App\Models\CommitteeReport;
use App\Models\CommitteeReportAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommitteeReportController extends Controller
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

        return view('committee-reports.index', compact('reports'));
    }

    public function create()
    {
        return view('committee-reports.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'report_number' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'submitted_by' => ['nullable', 'string', 'max:255'],
            'sponsored_by' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:1000'],
            'attachments.*' => ['nullable', 'file', 'max:10240'],
        ]);

        $report = CommitteeReport::create([
            ...collect($data)->except('attachments')->all(),
            'added_by' => auth()->user()?->username,
            'added_at' => now(),
        ]);

        $this->storeAttachments($request, $report);

        AuditLogController::log('Committee Report Created', "Created report '{$report->report_number}'");

        return redirect()->route('committee-reports.show', $report)->with('success', 'Committee report created.');
    }

    public function show(CommitteeReport $committeeReport)
    {
        $committeeReport->load('attachments');

        return view('committee-reports.show', ['report' => $committeeReport]);
    }

    public function edit(CommitteeReport $committeeReport)
    {
        $committeeReport->load('attachments');

        return view('committee-reports.edit', ['report' => $committeeReport]);
    }

    public function update(Request $request, CommitteeReport $committeeReport)
    {
        $data = $request->validate([
            'report_number' => ['required', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'submitted_by' => ['nullable', 'string', 'max:255'],
            'sponsored_by' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:1000'],
            'attachments.*' => ['nullable', 'file', 'max:10240'],
        ]);

        $committeeReport->update(collect($data)->except('attachments')->all());

        $this->storeAttachments($request, $committeeReport);

        AuditLogController::log('Committee Report Updated', "Updated report '{$committeeReport->report_number}'");

        return redirect()->route('committee-reports.show', $committeeReport)->with('success', 'Committee report updated.');
    }

    public function destroy(CommitteeReport $committeeReport)
    {
        foreach ($committeeReport->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $reportNumber = $committeeReport->report_number;
        $committeeReport->delete();

        AuditLogController::log('Committee Report Deleted', "Deleted report '{$reportNumber}'");

        return redirect()->route('committee-reports.index')->with('success', 'Committee report deleted.');
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
}
