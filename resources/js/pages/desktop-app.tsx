import { Head } from '@inertiajs/react';
import { Download, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Installer = {
    downloadUrl: string;
    version?: string;
    size?: string;
    updatedAt?: string;
};

export default function DesktopApp({
    installer = null,
}: {
    installer?: Installer | null;
}) {
    const details = [
        { label: 'Version', value: installer?.version },
        { label: 'Size', value: installer?.size },
        { label: 'Last updated', value: installer?.updatedAt },
    ].filter((detail) => detail.value);

    return (
        <>
            <Head title="Desktop app" />

            <div className="flex max-w-3xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Desktop app
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Install DLIS on your Windows computer to work with
                        the same records as the website.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-6 text-card-foreground">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                                <Monitor className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    DLIS for Windows
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Damulog Legislative Information System
                                </p>
                            </div>
                        </div>

                        {installer?.downloadUrl ? (
                            <Button asChild size="lg">
                                <a href={installer.downloadUrl} download>
                                    <Download className="size-4" />
                                    Download installer
                                </a>
                            </Button>
                        ) : (
                            <Button size="lg" disabled>
                                <Download className="size-4" />
                                Not available yet
                            </Button>
                        )}
                    </div>

                    {details.length > 0 && (
                        <dl className="mt-5 grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-3">
                            {details.map((detail) => (
                                <div key={detail.label}>
                                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                                        {detail.label}
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {detail.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold">Before you install</h3>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                            <li>Windows 10 or 11 (64-bit).</li>
                            <li>
                                Everything the app needs is included, so
                                there is nothing else to install.
                            </li>
                            <li>An internet connection is required.</li>
                            <li>
                                Sign in with the same username and password
                                you use on the website.
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold">How to install</h3>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                            <li>Click Download installer.</li>
                            <li>Open the downloaded file.</li>
                            <li>
                                If Windows shows a blue &quot;protected your
                                PC&quot; screen, click More info, then Run
                                anyway.
                            </li>
                            <li>Sign in when the app opens.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
}