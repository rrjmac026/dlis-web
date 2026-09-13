<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use App\Enums\UserRole;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EncoderFeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query()->latest();

        $user = auth()->user();
        if ($user && $user->role->value < UserRole::SuperAdmin->value) {
            $query->where('submitted_by', $user->username);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $feedback = $query->paginate(20)->withQueryString();

        return Inertia::render('encoder/feedback/index', [
            'feedback' => $feedback,
            'filters' => $request->only(['status', 'type']),
            'types' => $this->enumOptions(FeedbackType::cases()),
            'statuses' => $this->enumOptions(FeedbackStatus::cases()),
        ]);
    }

    public function create()
    {
        return Inertia::render('encoder/feedback/create', [
            'types' => $this->enumOptions(FeedbackType::cases()),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::enum(FeedbackType::class)],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $data['submitted_by'] = auth()->user()?->username;

        $feedback = Feedback::create($data);

        AuditLogController::log('Feedback Submitted', "New {$feedback->type->value} feedback (#{$feedback->id})");

        return redirect()->route('encoder.feedback.index')->with('success', 'Feedback submitted.');
    }

    public function show(Feedback $feedback)
    {
        return Inertia::render('encoder/feedback/show', [
            'feedback' => $feedback,
        ]);
    }

    public function update(Request $request, Feedback $feedback)
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(FeedbackStatus::class)],
        ]);

        $feedback->update($data);

        AuditLogController::log('Feedback Updated', "Feedback #{$feedback->id} marked as {$feedback->status->value}");

        return redirect()->route('encoder.feedback.index')->with('success', 'Feedback updated.');
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        AuditLogController::log('Feedback Deleted', "Deleted feedback #{$feedback->id}");

        return redirect()->route('encoder.feedback.index')->with('success', 'Feedback deleted.');
    }

    private function enumOptions(array $cases): array
    {
        return array_map(
            fn ($case) => [
                'value' => $case->value,
                'label' => ucfirst($case->value),
            ],
            $cases,
        );
    }
}