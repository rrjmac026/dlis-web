<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\CommitteeReport;
use App\Models\CommitteeReportAttachment;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class CommitteeReportController extends Controller
{
    public function __construct(protected DocumentService $documents) {}

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

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(CommitteeReport $committeeReport)
    {
        $committeeReport->load('attachments');

        return response()->json([
            'report' => $committeeReport,
            'attachments' => $this->documents->resolveUrls($committeeReport->attachments, 'file_path'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        $report = CommitteeReport::create([
            ...collect($data)->except('attachments')->all(),
            'added_by' => $request->user()->username,
            'added_at' => now(),
        ]);

        $this->storeAttachments($request, $report);

        AuditLogController::log('Committee Report Created', "Created report '{$report->report_number}'");

        return response()->json($report->load('attachments'), 201);
    }

    public function update(Request $request, CommitteeReport $committeeReport)
    {
        $data = $request->validate($this->rules());

        $committeeReport->update(collect($data)->except('attachments')->all());

        $this->storeAttachments($request, $committeeReport);

        AuditLogController::log('Committee Report Updated', "Updated report '{$committeeReport->report_number}'");

        return response()->json($committeeReport->load('attachments'));
    }

    public function destroy(CommitteeReport $committeeReport)
    {
        foreach ($committeeReport->attachments as $attachment) {
            $this->documents->delete($attachment->file_path);
        }

        $reportNumber = $committeeReport->report_number;
        $committeeReport->delete();

        AuditLogController::log('Committee Report Deleted', "Deleted report '{$reportNumber}'");

        return response()->json(null, 204);
    }

    public function destroyAttachment(CommitteeReport $committeeReport, CommitteeReportAttachment $attachment)
    {
        abort_if($attachment->committee_report_id !== $committeeReport->id, 404);

        $this->documents->delete($attachment->file_path);
        $attachment->delete();

        AuditLogController::log('Attachment Deleted', "Deleted attachment '{$attachment->file_name}' from report '{$committeeReport->report_number}'");

        return response()->json(null, 204);
    }

    protected function storeAttachments(Request $request, CommitteeReport $report): void
    {
        if (!$request->hasFile('attachments')) {
            return;
        }

        $report->attachments()->createMany(
            $this->documents->storeMany($request->file('attachments'), 'committee-reports/' . $report->id)
        );
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
}