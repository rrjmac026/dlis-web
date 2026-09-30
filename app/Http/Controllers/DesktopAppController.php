<?php

namespace App\Http\Controllers;

use App\Services\DocumentService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Number;
use Inertia\Inertia;


class DesktopAppController extends Controller
{
    public function __construct(protected DocumentService $documents) {}

    public function show()
    {
        $installer = null;

        try {
            if ($info = $this->installerInfo()) {
                $installer = [
                    'downloadUrl' => route('desktop-app.download'),
                    'size' => Number::fileSize($info['size']),
                    'updatedAt' => Carbon::parse($info['modifiedTime'])->format('M j, Y'),
                ];
            }
        } catch (\Throwable $e) {
            report($e);
        }

        return Inertia::render('desktop-app', ['installer' => $installer]);
    }

    public function download()
    {
        $info = $this->installerInfo();
        abort_unless($info, 404);

        return $this->documents->streamDriveFile($info['id'], $info['name']);
    }

    protected function installerInfo(): ?array
    {
        $fileId = config('services.google_drive.desktop_installer_id');

        if (! $fileId) {
            return null;
        }

        return Cache::remember(
            'desktop-installer-info',
            now()->addMinutes(10),
            fn () => $this->documents->fileInfo($fileId),
        );
    }

    public function dismissTutorial(Request $request)
    {
        $request->user()->forceFill([
            'desktop_tutorial_dismissed_at' => now(),
        ])->save();

        return back();
    }


    public function latest(DocumentService $documents)
    {
        $info = Cache::remember('desktop-installer-info', 300, fn () =>
            $documents->fileInfo(config('services.google_drive.desktop_installer_id'))
        );

        // Description format: line 1 = version, the rest = release notes
        $parts = preg_split('/\R/', trim($info['description'] ?? ''), 2);

        return response()->json([
            'version' => $parts[0] ?: '1.0.0',
            'minimum_version' => config('services.desktop.min_version'),
            'notes' => $parts[1] ?? '',
            'download_url' => route('desktop-app.download'),
        ]);
    }
}