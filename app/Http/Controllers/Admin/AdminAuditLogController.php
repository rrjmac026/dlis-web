<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query()->latest();

        if ($request->filled('username')) {
            $query->where('username', 'like', '%' . $request->username . '%');
        }

        if ($request->filled('action')) {
            $query->where('action', 'like', '%' . $request->action . '%');
        }

        $logs = $query->paginate(30)->withQueryString();

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['username', 'action']),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        return Inertia::render('admin/audit-logs/show', [
            'log' => $auditLog,
        ]);
    }

    /**
     * Helper used by other controllers to record an action.
     * Usage: AuditLogController::log('Ordinance Created', "Created ordinance #123");
     */
    public static function log(string $action, string $details = ''): AuditLog
    {
        $user = auth()->user();

        return AuditLog::create([
            'user_id' => $user?->id,
            'username' => $user?->username ?? 'system',
            'action' => $action,
            'details' => $details,
        ]);
    }
}