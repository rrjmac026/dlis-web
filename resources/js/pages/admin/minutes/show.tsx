import { Form, Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { MinutesRecord } from './form';

type Props = {
    minutes: MinutesRecord;
    documentUrl: string | null;
    basePath: string;
};

export default function ShowMinutes({ minutes, documentUrl, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Minutes #${minutes.id}`} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={minutes.session_type}
                    description={minutes.date ?? 'No date recorded'}
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
                    <Form
                        action={`${basePath}/${minutes.id}`}
                        method="delete"
                        onSubmit={(event) => {
                            if (!window.confirm('Delete these minutes?')) {
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

            <section className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">
                    Minutes details
                </h2>
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <Detail label="Session type" value={minutes.session_type} />
                    <Detail label="Date" value={minutes.date} />
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

ShowMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/minutes' },
        { title: props?.minutes ? `#${props.minutes.id}` : '', href: props ? `${props.basePath}/${props.minutes.id}` : '/minutes' },
    ],
});