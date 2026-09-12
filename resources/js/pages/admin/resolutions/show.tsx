import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import type { ResolutionClause, ResolutionRecord } from './form';

type Props = {
    resolution: ResolutionRecord;
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

function ClauseSection({
    title,
    clauses,
    basePath,
    resolutionId,
    canManage,
}: {
    title: string;
    clauses: ResolutionClause[];
    basePath: string;
    resolutionId: number;
    canManage: boolean;
}) {
    return (
        <div>
            <h3 className="mb-2 font-medium">{title}</h3>
            {clauses.length > 0 ? (
                <ol className="space-y-2">
                    {clauses
                        .sort((a, b) => a.order - b.order)
                        .map((clause) => (
                            <li
                                key={clause.id}
                                className="flex items-start justify-between gap-2 border-b pb-2 last:border-b-0"
                            >
                                <p className="text-sm">{clause.text}</p>
                                {canManage && (
                                    <Form
                                        action={`${basePath}/${resolutionId}/clauses/${clause.id}`}
                                        method="delete"
                                        onSubmit={(event) => {
                                            if (!window.confirm('Remove this clause?')) {
                                                event.preventDefault();
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="submit"
                                            title="Remove clause"
                                        >
                                            <Trash2 className="text-destructive size-4" />
                                        </Button>
                                    </Form>
                                )}
                            </li>
                        ))}
                </ol>
            ) : (
                <p className="text-muted-foreground text-sm">None recorded.</p>
            )}
        </div>
    );
}

export default function ShowResolution({ resolution, basePath }: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const canManage = auth.user.role >= 1;
    const whereas = (resolution.clauses ?? []).filter((c) => c.clause_type === 'Whereas');
    const resolved = (resolution.clauses ?? []).filter((c) => c.clause_type === 'Resolved');

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={resolution.resolution_number} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={resolution.resolution_number}
                    description={resolution.title}
                />
                <div className="flex gap-2">
                    {resolution.document_path && (
                        <Button variant="outline" asChild>
                            <a
                                href={`/storage/${resolution.document_path}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download /> Document
                            </a>
                        </Button>
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

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-lg border p-6 lg:col-span-2">
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

                    <div className="mt-6 border-t pt-4">
                        <h3 className="mb-2 font-medium">Votes</h3>
                        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <Detail label="Affirmative" value={resolution.affirmative_votes} />
                            <Detail label="Negative" value={resolution.negative_votes} />
                            <Detail label="Abstained" value={resolution.abstained_votes} />
                            <Detail label="Absent" value={resolution.absent_votes} />
                        </dl>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <h3 className="mb-2 font-medium">Certification</h3>
                        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                            <Detail label="Certified adopted by" value={resolution.certified_adopted_by} />
                            <Detail label="Certified date" value={resolution.certified_date} />
                            <Detail label="Verified by" value={resolution.verified_by} />
                            <Detail label="Verified date" value={resolution.verified_date} />
                            <Detail label="Attested by" value={resolution.attested_by} />
                            <Detail label="Attested date" value={resolution.attested_date} />
                        </dl>
                    </div>
                </section>

                <section className="space-y-6 rounded-lg border p-6">
                    <ClauseSection
                        title="Whereas clauses"
                        clauses={whereas}
                        basePath={basePath}
                        resolutionId={resolution.id}
                        canManage={canManage}
                    />
                    <ClauseSection
                        title="Resolved clauses"
                        clauses={resolved}
                        basePath={basePath}
                        resolutionId={resolution.id}
                        canManage={canManage}
                    />
                </section>
            </div>
        </div>
    );
}

ShowResolution.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Resolutions', href: props?.basePath ?? '/resolutions' },
        { title: props?.resolution?.resolution_number ?? '', href: props ? `${props.basePath}/${props.resolution.id}` : '/resolutions' },
    ],
});