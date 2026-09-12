import { Form, Head, Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type FeedbackRecord = {
    id: number;
    submitted_by: string | null;
    type: string;
    status: string;
    message: string;
    created_at: string;
};

type Props = {
    feedback: FeedbackRecord;
};

export default function ShowFeedback({ feedback }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Feedback #${feedback.id}`} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading
                    title={`Feedback #${feedback.id}`}
                    description={feedback.submitted_by ?? undefined}
                />
                <Form
                    action={`/encoder/feedback/${feedback.id}`}
                    method="delete"
                    onSubmit={(event) => {
                        if (!window.confirm('Delete this feedback?')) {
                            event.preventDefault();
                        }
                    }}
                >
                    <Button variant="destructive" type="submit">
                        <Trash2 /> Delete
                    </Button>
                </Form>
            </div>

            <section className="rounded-lg border p-6">
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Type
                        </dt>
                        <dd className="mt-1 capitalize">{feedback.type}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Status
                        </dt>
                        <dd className="mt-1 capitalize">{feedback.status}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Submitted by
                        </dt>
                        <dd className="mt-1">{feedback.submitted_by ?? '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Date
                        </dt>
                        <dd className="mt-1">
                            {new Date(feedback.created_at).toLocaleDateString()}
                        </dd>
                    </div>
                </dl>
                <div className="mt-6 border-t pt-4">
                    <h3 className="mb-2 font-medium">Message</h3>
                    <p className="text-sm whitespace-pre-wrap">
                        {feedback.message}
                    </p>
                </div>
            </section>

            <Form action={`/encoder/feedback/${feedback.id}`} method="put">
                {({ processing }) => (
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Label htmlFor="status" className="text-sm font-medium">
                            Status
                        </Label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={feedback.status}
                            className="bg-background h-9 rounded-md border px-3 text-sm"
                        >
                            <option value="open">Open</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <Button type="submit" size="sm" disabled={processing}>
                            Update status
                        </Button>
                    </div>
                )}
            </Form>
        </div>
    );
}

function Label({
    htmlFor,
    className,
    children,
}: {
    htmlFor: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <label htmlFor={htmlFor} className={className}>
            {children}
        </label>
    );
}

ShowFeedback.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Feedback', href: '/encoder/feedback' },
        { title: `#${props?.feedback?.id ?? ''}`, href: props ? `/encoder/feedback/${props.feedback.id}` : '/encoder/feedback' },
    ],
});