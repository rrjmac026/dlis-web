<?php

namespace App\Console\Commands;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use Illuminate\Console\Command;

class TestDriveUpload extends Command
{
    protected $signature = 'drive:test';
    protected $description = 'Upload a small test file to the shared Google Drive folder';

    public function handle()
    {
        $this->info('Authenticating with OAuth credentials...');

        $client = new GoogleClient();
        $client->setApplicationName('LLOIS Test');
        $client->setAuthConfig(config('services.google_drive.oauth_client_json'));
        $client->setScopes([GoogleDrive::DRIVE]);
        $client->setAccessType('offline');

        $tokenPath = config('services.google_drive.oauth_token_json');

        if (! file_exists($tokenPath)) {
            $this->error("Token file not found at: {$tokenPath}");
            $this->error('Run the one-time get-token.php script first.');
            return 1;
        }

        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);

        if ($client->isAccessTokenExpired()) {
            $this->info('Access token expired — refreshing...');

            $refreshToken = $client->getRefreshToken() ?? $accessToken['refresh_token'] ?? null;

            if (! $refreshToken) {
                $this->error('No refresh token available — re-run get-token.php to reauthorize.');
                return 1;
            }

            $newToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);

            if (isset($newToken['error'])) {
                $this->error('Refresh failed: ' . ($newToken['error_description'] ?? $newToken['error']));
                return 1;
            }

            // Refresh responses sometimes omit refresh_token — carry the original forward.
            $newToken['refresh_token'] = $newToken['refresh_token'] ?? $refreshToken;
            file_put_contents($tokenPath, json_encode($newToken, JSON_PRETTY_PRINT));
            $client->setAccessToken($newToken);
        }

        $drive = new GoogleDrive($client);

        $this->info('Creating a test file...');

        $tempPath = storage_path('app/drive-test.txt');
        file_put_contents($tempPath, 'Hello from Laravel — ' . now());

        $rootId = config('services.google_drive.root_folder_id');

        $fileMetadata = new DriveFile([
            'name' => 'laravel-drive-test-' . now()->timestamp . '.txt',
            'parents' => [$rootId],
        ]);

        try {
            $uploaded = $drive->files->create($fileMetadata, [
                'data' => file_get_contents($tempPath),
                'mimeType' => 'text/plain',
                'uploadType' => 'multipart',
                'fields' => 'id, webViewLink',
            ]);

            $drive->permissions->create($uploaded->id, new Permission([
                'type' => 'anyone',
                'role' => 'reader',
            ]));

            $this->info('✅ Upload succeeded!');
            $this->info('File ID: ' . $uploaded->id);
            $this->info('View URL: ' . $uploaded->webViewLink);
        } catch (\Exception $e) {
            $this->error('❌ Upload failed: ' . $e->getMessage());
            return 1;
        } finally {
            @unlink($tempPath);
        }

        return 0;
    }
}