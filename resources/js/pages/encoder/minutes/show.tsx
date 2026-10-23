import { Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import ConfirmDeleteForm from '@/components/confirm-delete-form';
import { Button } from '@/components/ui/button';
import type { MinutesRecord } from './form';

type Props = {
    minutes: MinutesRecord;
    documentUrl: string | null;
    documentViewUrl: string | null;
    basePath: string;
};

function displayTitle(minutes: MinutesRecord): string {
    return minutes.session_number
        ? `No. ${minutes.session_number} · ${minutes.session_type}`
        : minutes.session_type;
}

export default function ShowMinutes({ minutes, documentUrl, basePath }: Props) {
    const title = displayTitle(minutes);

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={title} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={title}
                    description={minutes.date ?? undefined}
                />
                <div className="flex gap-2">
                    {documentUrl && (
                        <Button variant="outline" asChild>
                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download /> Document
                            </a>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={`${basePath}/${minutes.id}/edit`}>
                            <Edit /> Edit
                        </Link>
                    </Button>
                    <ConfirmDeleteForm
                        action={`${basePath}/${minutes.id}`}
                        title="Delete these minutes?"
                        description={`This will permanently delete the minutes for "${title}". This cannot be undone.`}
                        trigger={
                            <Button variant="destructive">
                                <Trash2 /> Delete
                            </Button>
                        }
                    />
                </div>
            </div>

            <section className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">Details</h2>
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Session number
                        </dt>
                        <dd className="mt-1">{minutes.session_number ?? '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Session type
                        </dt>
                        <dd className="mt-1">{minutes.session_type}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Date
                        </dt>
                        <dd className="mt-1">{minutes.date || '—'}</dd>
                    </div>
                </dl>
            </section>
        </div>
    );
}

ShowMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/encoder/minutes' },
        {
            title: props?.minutes ? displayTitle(props.minutes) : '',
            href: props ? `${props.basePath}/${props.minutes.id}` : '/encoder/minutes',
        },
    ],
});