<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentService
{
    protected ?GoogleDrive $drive = null;

    // Mirrors the folder names used by LLOIS.Services.StorageService (WPF app)
    // so both apps write into the same named subfolders under the shared root.
    protected const FOLDER_MAP = [
        'resolutions' => 'Resolutions',
        'ordinances' => 'Ordinances',
        'minutes' => 'Minutes',
        'committee-reports' => 'Committee Reports',
    ];

    public function store(UploadedFile $file, string $folder): string
    {
        $drive = $this->getDriveService();
        $parentId = $this->getOrCreateSubfolder($drive, $this->resolveFolderName($folder));

        $fileMetadata = new DriveFile([
            'name' => uniqid() . '_' . $file->getClientOriginalName(),
            'parents' => [$parentId],
        ]);

        $uploaded = $drive->files->create($fileMetadata, [
            'data' => file_get_contents($file->getRealPath()),
            'mimeType' => $file->getMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id, webViewLink',
        ]);

        $drive->permissions->create($uploaded->id, new Permission([
            'type' => 'anyone',
            'role' => 'reader',
        ]));

        return $uploaded->webViewLink ?? "https://drive.google.com/file/d/{$uploaded->id}/view";
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
        if (! $path || ! $this->isDriveUrl($path)) {
            return;
        }

        $fileId = $this->extractDriveFileId($path);

        if ($fileId) {
            try {
                $this->getDriveService()->files->delete($fileId);
            } catch (\Google\Service\Exception $e) {
                // File already gone / no access — ignore so destroy() flows aren't blocked.
            }
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
        $downloadUrl = $sourceUrl;

        if ($this->isDriveUrl($sourceUrl)) {
            $fileId = $this->extractDriveFileId($sourceUrl);
            if ($fileId) {
                $downloadUrl = "https://drive.google.com/uc?export=download&id={$fileId}";
            }
        }

        return response()->streamDownload(function () use ($downloadUrl) {
            echo file_get_contents($downloadUrl);
        }, $downloadName);
    }

    // ── internals ──────────────────────────────────────────────

    protected function getDriveService(): GoogleDrive
    {
        if ($this->drive !== null) {
            return $this->drive;
        }

        $client = new GoogleClient();
        $client->setApplicationName('LLOIS');
        $client->setAuthConfig(config('services.google_drive.oauth_client_json'));
        $client->setScopes([GoogleDrive::DRIVE]);
        $client->setAccessType('offline');

        $tokenPath = config('services.google_drive.oauth_token_json');
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);

        if ($client->isAccessTokenExpired()) {
            $refreshToken = $client->getRefreshToken() ?? $accessToken['refresh_token'] ?? null;

            if (! $refreshToken) {
                throw new \RuntimeException(
                    'Google Drive refresh token missing — re-run the one-time OAuth setup script.'
                );
            }

            $newToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);

            if (isset($newToken['error'])) {
                throw new \RuntimeException(
                    'Google Drive token refresh failed: ' . ($newToken['error_description'] ?? $newToken['error'])
                );
            }

            $newToken['refresh_token'] = $newToken['refresh_token'] ?? $refreshToken;
            file_put_contents($tokenPath, json_encode($newToken, JSON_PRETTY_PRINT));
            $client->setAccessToken($newToken);
        }

        return $this->drive = new GoogleDrive($client);
    }

    protected function getOrCreateSubfolder(GoogleDrive $drive, string $folderName): string
    {
        $rootId = config('services.google_drive.root_folder_id');
        $escapedName = str_replace("'", "\\'", $folderName);

        $results = $drive->files->listFiles([
            'q' => "'{$rootId}' in parents and name = '{$escapedName}' " .
                   "and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            'fields' => 'files(id, name)',
            'spaces' => 'drive',
        ]);

        $existing = $results->getFiles()[0] ?? null;
        if ($existing) {
            return $existing->getId();
        }

        $folder = $drive->files->create(new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$rootId],
        ]), ['fields' => 'id']);

        return $folder->getId();
    }

    protected function resolveFolderName(string $folder): string
    {
        $baseKey = explode('/', $folder)[0];

        return self::FOLDER_MAP[$baseKey] ?? $folder;
    }

    protected function isDriveUrl(string $path): bool
    {
        return str_contains($path, 'drive.google.com');
    }

    protected function extractDriveFileId(string $driveUrl): ?string
    {
        if (preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $driveUrl, $m)) {
            return $m[1];
        }

        if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $driveUrl, $m)) {
            return $m[1];
        }

        return null;
    }
}