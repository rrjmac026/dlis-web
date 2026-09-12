import { Form, Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { CommitteeReportRecord } from './form';

type Props = {
    report: CommitteeReportRecord;
    basePath: string;
};

export default function ShowCommitteeReport({ report, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={report.report_number} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={report.report_number}
                    description={report.submitted_by ?? undefined}
                />
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`${basePath}/${report.id}/edit`}>
                            <Edit /> Edit
                        </Link>
                    </Button>
                    <Form
                        action={`${basePath}/${report.id}`}
                        method="delete"
                        onSubmit={(event) => {
                            if (!window.confirm('Delete this committee report?')) {
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
                        Report details
                    </h2>
                    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        <Detail label="Date" value={report.date} />
                        <Detail
                            label="Submitted by"
                            value={report.submitted_by}
                        />
                        <Detail
                            label="Sponsored by"
                            value={report.sponsored_by}
                        />
                        <Detail label="Added by" value={report.added_by} />
                    </dl>
                    {report.subject && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="mb-2 font-medium">Subject</h3>
                            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                {report.subject}
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-lg border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Attachments
                    </h2>
                    {report.attachments?.length ? (
                        <ul className="space-y-2">
                            {report.attachments.map((attachment) => (
                                <li
                                    key={attachment.id}
                                    className="flex items-center justify-between gap-2 text-sm"
                                >
                                    <a
                                        href={`/storage/${attachment.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 hover:underline"
                                    >
                                        <Download className="size-4" />
                                        {attachment.file_name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No attachments.
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
            <dd className="mt-1">{value || '—'}</dd>
        </div>
    );
}

ShowCommitteeReport.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Committee Reports', href: props?.basePath ?? '/encoder/committee-reports' },
        { title: props?.report?.report_number ?? '', href: props ? `${props.basePath}/${props.report.id}` : '/encoder/committee-reports' },
    ],
});