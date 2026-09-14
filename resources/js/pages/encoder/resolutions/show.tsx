import { Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import ConfirmDeleteForm from '@/components/confirm-delete-form';
import { Button } from '@/components/ui/button';
import type { ResolutionRecord } from './form';

type Props = {
    resolution: ResolutionRecord;
    documentUrl: string | null;
    documentViewUrl: string | null;
    basePath: string;
};

export default function ShowResolution({ resolution, documentUrl, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={resolution.resolution_number} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={resolution.resolution_number}
                    description={resolution.title}
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
                        <Link href={`${basePath}/${resolution.id}/edit`}>
                            <Edit /> Edit
                        </Link>
                    </Button>
                    <ConfirmDeleteForm
                        action={`${basePath}/${resolution.id}`}
                        title="Delete this resolution?"
                        description={`This will permanently delete "${resolution.resolution_number}". This cannot be undone.`}
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
                    <Detail label="SB term" value={resolution.sb_term} />
                    <Detail label="Session info" value={resolution.session_info} />
                    <Detail label="Committee" value={resolution.committee} />
                    <Detail label="Sponsor" value={resolution.sponsor} />
                    <Detail label="Date approved" value={resolution.date_approved} />
                    <Detail label="Added by" value={resolution.added_by} />
                </dl>
            </section>
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {label}
            </dt>
            <dd className="mt-1">{value || '—'}</dd>
        </div>
    );
}

ShowResolution.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Resolutions', href: props?.basePath ?? '/encoder/resolutions' },
        { title: props?.resolution?.resolution_number ?? '', href: props ? `${props.basePath}/${props.resolution.id}` : '/encoder/resolutions' },
    ],
});