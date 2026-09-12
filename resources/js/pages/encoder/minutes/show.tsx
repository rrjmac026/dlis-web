import { Form, Head, Link } from '@inertiajs/react';
import { Download, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { MinutesRecord } from './form';

type Props = {
    minutes: MinutesRecord;
    basePath: string;
};

export default function ShowMinutes({ minutes, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={minutes.session_type} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={minutes.session_type}
                    description={minutes.date ?? undefined}
                />
                <div className="flex gap-2">
                    {minutes.document_path && (
                        <Button variant="outline" asChild>
                            <a
                                href={`/storage/${minutes.document_path}`}
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
                <h2 className="mb-4 text-lg font-semibold">Details</h2>
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
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
        { title: props?.minutes?.session_type ?? '', href: props ? `${props.basePath}/${props.minutes.id}` : '/encoder/minutes' },
    ],
});