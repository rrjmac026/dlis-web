<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Records in this database are shared with the WPF (LLOIS) desktop app,
 * whose StorageService writes a full external URL (Supabase Storage or
 * Google Drive) straight into *_path columns. Laravel-created records
 * store a plain relative path instead, meant for Storage::disk('public').
 *
 * Storage::disk('public')->url() blindly prefixes whatever it's given
 * with this app's own /storage/ URL, so passing it an already-absolute
 * URL produces a broken link like:
 *   http://127.0.0.1:8000/storage/https://xyz.supabase.co/...
 * which 403s because nothing exists at that local path.
 *
 * This trait picks the right behavior based on what the stored value
 * actually looks like, so both sources of data resolve correctly.
 */
trait ResolvesDocumentUrls
{
    /**
     * Resolve a stored path/URL into a URL usable by the frontend.
     * Returns null if $path is null/empty.
     */
    protected function resolveDocumentUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // Already a full URL (Supabase Storage, Google Drive, or any
        // other absolute link written by the WPF app) — use as-is.
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Otherwise treat it as a relative path on Laravel's own
        // public disk, as produced by $file->store(..., 'public').
        return Storage::disk('public')->url($path);
    }

    /**
     * Same resolution, applied to every item in a collection of models
     * that expose a $path attribute (e.g. committee report attachments).
     * Returns a plain array of ['...model fields..., 'url' => ...].
     */
    protected function resolveDocumentUrls(iterable $items, string $pathAttribute = 'file_path'): array
    {
        $resolved = [];

        foreach ($items as $item) {
            $url = $this->resolveDocumentUrl($item->{$pathAttribute});

            $resolved[] = [
                ...$item->toArray(),
                'url' => $url,
                'viewUrl' => $this->resolveViewUrl($url),
            ];
        }

        return $resolved;
    }

    /**
     * A URL the browser can open directly to VIEW the file inline,
     * never downloading it. PDFs and images already render natively in
     * every browser, so they pass through unchanged. Office formats
     * (docx/xlsx/pptx/doc/xls/ppt) have no native browser renderer, so
     * those are routed through Microsoft's free Office Online Viewer,
     * which requires the source URL to be publicly reachable — true
     * here since these buckets are public.
     */
    protected function resolveViewUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        $extension = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));

        if (in_array($extension, $officeExtensions, true)) {
            return 'https://view.officeapps.live.com/op/view.aspx?src=' . urlencode($url);
        }

        return $url;
    }

    /**
     * Streams a file back to the browser with a forced attachment
     * disposition, guaranteeing an actual download regardless of file
     * type or whether the source URL is cross-origin (Supabase/Drive).
     * Cross-origin links can't reliably force a download via the HTML
     * `download` attribute alone — browsers often ignore it for
     * cross-origin URLs — so this proxies the bytes through Laravel
     * with the right header instead.
     */
    protected function streamDownload(string $sourceUrl, string $downloadName): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return response()->streamDownload(function () use ($sourceUrl) {
            echo file_get_contents($sourceUrl);
        }, $downloadName);
    }
}