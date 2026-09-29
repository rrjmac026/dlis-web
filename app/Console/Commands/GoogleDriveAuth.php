<?php

namespace App\Console\Commands;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Illuminate\Console\Command;

class GoogleDriveAuth extends Command
{
    protected $signature = 'google:drive-auth';

    protected $description = 'One-time Google Drive OAuth setup: generates the token JSON used by DocumentService';

    // Desktop-app clients accept a loopback redirect without registering it.
    // Nothing needs to be listening on this port; you just copy the URL from the browser.
    private const REDIRECT_URI = 'http://127.0.0.1:8085';

    public function handle(): int
    {
        $clientPath = config('services.google_drive.oauth_client_json');
        $tokenPath  = config('services.google_drive.oauth_token_json');
        $rootId     = config('services.google_drive.root_folder_id');

        if (! $clientPath || ! is_file($clientPath)) {
            $this->error("OAuth client JSON not found at: {$clientPath}");

            return self::FAILURE;
        }

        if (! $tokenPath) {
            $this->error('services.google_drive.oauth_token_json is not configured.');

            return self::FAILURE;
        }

        $state = bin2hex(random_bytes(16));

        $client = new GoogleClient();
        $client->setApplicationName('LLOIS');
        $client->setAuthConfig($clientPath);
        $client->setScopes([GoogleDrive::DRIVE]);
        $client->setAccessType('offline');
        $client->setPrompt('consent'); // forces Google to return a refresh token
        $client->setRedirectUri(self::REDIRECT_URI);
        $client->setState($state);

        $authUrl = $client->createAuthUrl();

        $this->newLine();
        $this->line('1. Your browser should open now. Sign in with the Google account that owns the Drive folder.');
        $this->line('   If it does not open, copy this link into the browser as ONE line with no spaces:');
        $this->newLine();
        $this->line($authUrl);
        $this->newLine();
        $this->line('2. Click Advanced > Go to app (unverified) if Google warns you, then allow access.');
        $this->line('3. The browser will end on "This site can\'t be reached". That is expected.');
        $this->line('4. Copy the FULL address from the address bar and paste it below.');
        $this->newLine();

        $this->openInBrowser($authUrl);

        $input = trim((string) $this->ask('Paste the full URL (or just the code)'));

        if (str_contains($input, 'code=')) {
            parse_str((string) parse_url($input, PHP_URL_QUERY), $query);

            if (($query['state'] ?? null) !== $state) {
                $this->error('The state in the pasted URL does not match. Run the command again and use the new link.');

                return self::FAILURE;
            }

            $code = (string) ($query['code'] ?? '');
        } else {
            $code = urldecode($input);
        }

        if ($code === '') {
            $this->error('No code found in what you pasted.');

            return self::FAILURE;
        }

        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            $this->error('Google rejected the code: ' . ($token['error_description'] ?? $token['error']));

            return self::FAILURE;
        }

        if (empty($token['refresh_token'])) {
            $this->error('Google did not return a refresh token.');
            $this->line('Remove this app at https://myaccount.google.com/permissions and run the command again.');

            return self::FAILURE;
        }

        $dir = dirname($tokenPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0700, true);
        }

        file_put_contents($tokenPath, json_encode($token, JSON_PRETTY_PRINT));
        $this->info("Token saved to {$tokenPath}");

        // Confirm this account can actually see the shared root folder.
        try {
            $client->setAccessToken($token);
            $folder = (new GoogleDrive($client))->files->get($rootId, ['fields' => 'id, name']);
            $this->info("Verified: this account can access the Drive folder '{$folder->getName()}'.");
        } catch (\Throwable $e) {
            $this->warn('Token saved, but the root folder check failed: ' . $e->getMessage());
            $this->warn('Check that you signed in with the folder owner and that GOOGLE_DRIVE_ROOT_FOLDER_ID is correct.');

            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    private function openInBrowser(string $url): void
    {
        try {
            if (PHP_OS_FAMILY === 'Windows') {
                // The empty "" is the window title; the & characters are safe inside the quotes.
                pclose(popen('start "" "' . $url . '"', 'r'));
            } elseif (PHP_OS_FAMILY === 'Darwin') {
                exec('open ' . escapeshellarg($url) . ' > /dev/null 2>&1 &');
            } else {
                exec('xdg-open ' . escapeshellarg($url) . ' > /dev/null 2>&1 &');
            }
        } catch (\Throwable) {
            // Fall back to the printed link.
        }
    }
}