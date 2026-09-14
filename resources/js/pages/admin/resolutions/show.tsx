import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Download, Edit, Eye, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import type { ResolutionRecord } from './form';

type Props = {
    resolution: ResolutionRecord;
    documentUrl: string | null;
    documentViewUrl: string | null;
    basePath: string;
};

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {label}
            </dt>
            <dd className="mt-1">{value || '—'}</dd>
        </div>
    );
}

export default function ShowResolution({
    resolution,
    documentUrl,
    documentViewUrl,
    basePath,
}: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const canManage = auth.user.role >= 1;

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
                        <>
                            {documentViewUrl && (
                                <Button variant="outline" asChild>
                                    <a
                                        href={documentViewUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Eye /> View
                                    </a>
                                </Button>
                            )}
                            <Button variant="outline" asChild>
                                <a
                                    href={`${basePath}/${resolution.id}/document/download`}
                                >
                                    <Download /> Download
                                </a>
                            </Button>
                        </>
                    )}
                    {canManage && (
                        <>
                            <Button variant="outline" asChild>
                                <Link href={`${basePath}/${resolution.id}/edit`}>
                                    <Edit /> Edit
                                </Link>
                            </Button>
                            <Form
                                action={`${basePath}/${resolution.id}`}
                                method="delete"
                                onSubmit={(event) => {
                                    if (!window.confirm('Delete this resolution?')) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                <Button variant="destructive" type="submit">
                                    <Trash2 /> Delete
                                </Button>
                            </Form>
                        </>
                    )}
                </div>
            </div>

            <section className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Resolution details
                </h2>
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

ShowResolution.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Resolutions', href: props?.basePath ?? '/resolutions' },
        { title: props?.resolution?.resolution_number ?? '', href: props ? `${props.basePath}/${props.resolution.id}` : '/resolutions' },
    ],
});