<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * LOCAL TESTING VERSION — stores files in storage/app/public.
 * Same public API as the Google Drive DocumentService.
 */
class DocumentService
{
    protected const DISK = 'public';

    protected const FOLDER_MAP = [
        'resolutions' => 'Resolutions',
        'ordinances' => 'Ordinances',
        'minutes' => 'Minutes',
        'committee-reports' => 'Committee Reports',
    ];

    public function store(UploadedFile $file, string $folder): string
    {
        $dir = $this->resolveFolderName($folder);
        $name = uniqid() . '_' . $file->getClientOriginalName();

        $relative = $file->storeAs($dir, $name, self::DISK);

        return url('storage/' . $relative);
    }

    public function storeMany(array $files, string $folder): array
    {
        $results = [];

        foreach ($files as $file) {
            $results[] = [
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $this->store($file, $folder),
            ];
        }

        return $results;
    }

    public function replace(?string $oldPath, UploadedFile $newFile, string $folder): string
    {
        $this->delete($oldPath);

        return $this->store($newFile, $folder);
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        $relative = $this->extractLocalPath($path);

        if ($relative && Storage::disk(self::DISK)->exists($relative)) {
            Storage::disk(self::DISK)->delete($relative);
        }
    }

    public function resolveUrl(?string $path): ?string
    {
        return $path ?: null;
    }

    public function resolveUrls(iterable $items, string $pathAttribute = 'file_path'): array
    {
        $resolved = [];

        foreach ($items as $item) {
            $url = $this->resolveUrl($item->{$pathAttribute});

            $resolved[] = [
                ...$item->toArray(),
                'url' => $url,
                'viewUrl' => $this->resolveViewUrl($url),
            ];
        }

        return $resolved;
    }

    public function resolveViewUrl(?string $url): ?string
    {
        return $url;
    }

    public function streamDownload(string $sourceUrl, string $downloadName): StreamedResponse
    {
        $relative = $this->extractLocalPath($sourceUrl);

        if ($relative && Storage::disk(self::DISK)->exists($relative)) {
            return Storage::disk(self::DISK)->download($relative, $downloadName);
        }

        return response()->streamDownload(function () use ($sourceUrl) {
            echo file_get_contents($sourceUrl);
        }, $downloadName);
    }

    public function fileInfo(string $fileId): array
    {
        $disk = Storage::disk(self::DISK);

        abort_unless($disk->exists($fileId), 404, 'File not found.');

        return [
            'id' => $fileId,
            'name' => basename($fileId),
            'size' => (int) $disk->size($fileId),
            'modifiedTime' => date('c', $disk->lastModified($fileId)),
            'description' => null,
        ];
    }

    public function streamDriveFile(string $fileId, string $downloadName): StreamedResponse
    {
        $disk = Storage::disk(self::DISK);

        abort_unless($disk->exists($fileId), 404, 'File not found.');

        return $disk->download($fileId, $downloadName);
    }

    // ── internals ──────────────────────────────────────────────

    protected function resolveFolderName(string $folder): string
    {
        $baseKey = explode('/', $folder)[0];

        return self::FOLDER_MAP[$baseKey] ?? $folder;
    }

    protected function extractLocalPath(string $url): ?string
    {
        $pos = strpos($url, '/storage/');

        if ($pos === false) {
            return null;
        }

        return urldecode(substr($url, $pos + strlen('/storage/')));
    }
}