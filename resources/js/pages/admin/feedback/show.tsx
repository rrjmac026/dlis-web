import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { FeedbackRecord } from './index';

type Option = { value: string | number; label: string };

type Props = {
    feedback: FeedbackRecord;
    statuses: Option[];
};

const basePath = '/admin/feedback';

export default function ShowFeedback({ feedback, statuses }: Props) {
    const typeLabel = String(feedback.type);

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Feedback #${feedback.id}`} />
            <Heading
                title={`${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)} report`}
                description={`Submitted by ${feedback.submitted_by ?? 'Unknown'} on ${new Date(feedback.created_at).toLocaleDateString()}`}
            />

            <section className="rounded-lg border p-6">
                <h2 className="mb-2 font-medium">Message</h2>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {feedback.message}
                </p>
            </section>

            <section className="rounded-lg border p-6">
                <h2 className="mb-4 font-medium">Update status</h2>
                <Form
                    action={`${basePath}/${feedback.id}`}
                    method="put"
                    className="flex items-end gap-3"
                >
                    {({ processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={feedback.status}
                                    className="bg-background h-9 rounded-md border px-3 text-sm"
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update'}
                            </Button>
                        </>
                    )}
                </Form>
            </section>
        </div>
    );
}

ShowFeedback.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Feedback', href: basePath },
        { title: `#${props?.feedback?.id ?? ''}`, href: props ? `${basePath}/${props.feedback.id}` : basePath },
    ],
});