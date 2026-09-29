<?php

namespace App\Http\Controllers\Api;

use App\Casts\OrdinalEnumCast;
use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use App\Enums\UserRole;
use App\Http\Controllers\Admin\AdminAuditLogController as AuditLogController;
use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query()->latest();

        $user = $request->user();
        if ($user->role->value < UserRole::SuperAdmin->value) {
            $query->where('submitted_by', $user->username);
        }

        // The columns store ordinals, so convert ("open" -> 0) before filtering.
        if ($request->filled('status')) {
            $query->where('status', OrdinalEnumCast::toOrdinal(FeedbackStatus::class, $request->status) ?? -1);
        }

        if ($request->filled('type')) {
            $query->where('type', OrdinalEnumCast::toOrdinal(FeedbackType::class, $request->type) ?? -1);
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Request $request, Feedback $feedback)
    {
        $this->authorizeOwnerOrSuperAdmin($request, $feedback);

        return response()->json($feedback);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::enum(FeedbackType::class)],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $data['submitted_by'] = $request->user()->username;

        $feedback = Feedback::create($data);

        AuditLogController::log('Feedback Submitted', "New {$feedback->type->name} feedback (#{$feedback->id})");

        return response()->json($feedback, 201);
    }

    public function update(Request $request, Feedback $feedback)
    {
        $this->authorizeOwnerOrSuperAdmin($request, $feedback);

        $data = $request->validate([
            'status' => ['required', Rule::enum(FeedbackStatus::class)],
        ]);

        $feedback->update($data);

        AuditLogController::log('Feedback Updated', "Feedback #{$feedback->id} marked as {$feedback->status->name}");

        return response()->json($feedback);
    }

    public function destroy(Request $request, Feedback $feedback)
    {
        $this->authorizeOwnerOrSuperAdmin($request, $feedback);

        $feedback->delete();

        AuditLogController::log('Feedback Deleted', "Deleted feedback #{$feedback->id}");

        return response()->json(null, 204);
    }

    private function authorizeOwnerOrSuperAdmin(Request $request, Feedback $feedback): void
    {
        $user = $request->user();

        abort_unless(
            $user->role === UserRole::SuperAdmin || $feedback->submitted_by === $user->username,
            403
        );
    }
}