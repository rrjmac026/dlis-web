<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $count = min((int) $request->input('count', 200), 500); // cap to prevent abuse

        return response()->json(
            AuditLog::query()->latest('created_at')->take($count)->get()
        );
    }

    /**
     * Lets the desktop client record actions the server can't see happening
     * (exporting/printing a report happens locally). Restricted to a fixed list of
     * actions so any logged-in user can't write arbitrary entries into the audit log.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'action' => ['required', 'string', Rule::in([
                'Report Exported (PDF)',
                'Report Exported (Excel)',
                'Report Printed',
            ])],
            'details' => ['nullable', 'string', 'max:1000'],
        ]);

        AdminAuditLogController::log($data['action'], $data['details'] ?? '');

        return response()->json(['message' => 'Logged.'], 201);
    }
}