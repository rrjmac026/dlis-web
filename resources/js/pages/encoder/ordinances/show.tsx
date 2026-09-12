import { Form, Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import type { OrdinanceRecord, OrdinanceVersion } from './form';

type Props = {
    ordinance: OrdinanceRecord;
    documentUrl: string | null;
    basePath: string;
};

export default function ShowOrdinance({ ordinance, documentUrl, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={ordinance.ordinance_number} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={ordinance.ordinance_number}
                    description={ordinance.title}
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
                        <Link href={`${basePath}/${ordinance.id}/edit`}>
                            <Edit /> Edit
                        </Link>
                    </Button>
                    <Form
                        action={`${basePath}/${ordinance.id}`}
                        method="delete"
                        onSubmit={(event) => {
                            if (!window.confirm('Delete this ordinance?')) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <Button variant="destructive" type="submit">
                            <Trash2 /> Delete
                        </Button>
                    </Form>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-lg border p-6 lg:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold">
                        Ordinance details
                    </h2>
                    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        <Detail
                            label="Series number"
                            value={ordinance.series_number}
                        />
                        <div>
                            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Status
                            </dt>
                            <dd className="mt-1">
                                <StatusBadge status={ordinance.status} />
                            </dd>
                        </div>
                        <Detail label="State" value={ordinance.state} />
                        <Detail label="Type" value={ordinance.type} />
                        <Detail label="Sponsor" value={ordinance.sponsor} />
                        <Detail label="Committee" value={ordinance.committee} />
                        <Detail
                            label="Date passed"
                            value={ordinance.date_passed}
                        />
                        <Detail
                            label="Date approved"
                            value={ordinance.date_approved}
                        />
                        <Detail
                            label="Date published"
                            value={ordinance.date_published}
                        />
                        <Detail
                            label="Reference number"
                            value={ordinance.reference_number}
                        />
                        <Detail label="NRS / NSB" value={ordinance.nrs_nsb} />
                        <Detail
                            label="Nomenclature"
                            value={ordinance.nomenclature}
                        />
                        <Detail
                            label="Final action"
                            value={ordinance.final_action}
                        />
                        <Detail label="Location" value={ordinance.location} />
                        <Detail label="Added by" value={ordinance.added_by} />
                    </dl>
                    {ordinance.subject && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="mb-2 font-medium">Subject</h3>
                            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                {ordinance.subject}
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-lg border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Amendment versions
                    </h2>
                    {ordinance.versions?.length ? (
                        <div className="space-y-4">
                            {ordinance.versions.map((version) => (
                                <Version key={version.id} version={version} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No amendments recorded.
                        </p>
                    )}
                </section>
            </div>
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
            <dd className="mt-1 capitalize">{value || '—'}</dd>
        </div>
    );
}

function Version({ version }: { version: OrdinanceVersion }) {
    return (
        <article className="border-l-2 pl-3">
            <p className="font-medium">Version {version.version_number}</p>
            <p className="text-muted-foreground text-sm">{version.title}</p>
            <p className="text-muted-foreground mt-1 text-xs">
                {version.date_enacted} · {version.enacted_by}
            </p>
            {version.amendment_notes && (
                <p className="mt-2 text-sm">{version.amendment_notes}</p>
            )}
        </article>
    );
}

// Fixed: breadcrumbs now read basePath from the page's actual props instead
// of a hardcoded '/ordinances', so Admin's '/admin/ordinances' links correctly.
ShowOrdinance.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Ordinances', href: props?.basePath ?? '/ordinances' },
        { title: props?.ordinance?.ordinance_number ?? '', href: props ? `${props.basePath}/${props.ordinance.id}` : '/ordinances' },
    ],
});