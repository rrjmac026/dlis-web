<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use App\Models\Feedback;
use Illuminate\Http\Request;

class AdminFeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $feedback = $query->paginate(20)->withQueryString();
        $types = FeedbackType::cases();
        $statuses = FeedbackStatus::cases();

        return view('feedback.index', compact('feedback', 'types', 'statuses'));
    }

    public function create()
    {
        $types = FeedbackType::cases();

        return view('feedback.create', compact('types'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'submitted_by' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:bug,concern,suggestion'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $feedback = Feedback::create($data);

        AuditLogController::log('Feedback Submitted', "New {$feedback->type->value} feedback (#{$feedback->id})");

        return redirect()->route('feedback.index')->with('success', 'Feedback submitted.');
    }

    public function show(Feedback $feedback)
    {
        return view('feedback.show', compact('feedback'));
    }

    public function update(Request $request, Feedback $feedback)
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:open,resolved'],
        ]);

        $feedback->update($data);

        AuditLogController::log('Feedback Updated', "Feedback #{$feedback->id} marked as {$feedback->status->value}");

        return redirect()->route('feedback.index')->with('success', 'Feedback updated.');
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        AuditLogController::log('Feedback Deleted', "Deleted feedback #{$feedback->id}");

        return redirect()->route('feedback.index')->with('success', 'Feedback deleted.');
    }
}
