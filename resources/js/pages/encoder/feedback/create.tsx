import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = { value: string; label: string };

type Props = {
    types: Option[];
};

const basePath = '/admin/feedback';

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

export default function CreateFeedback({ types }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Submit Feedback" />
            <Heading
                title="Submit feedback"
                description="Report a bug, concern, or suggestion."
            />

            <Form action={basePath} method="post" className="space-y-6">
                {({ processing, errors }) => (
                    <section className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                className="bg-background h-9 rounded-md border px-3 text-sm"
                            >
                                {types.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="submitted_by">
                                Submitted by
                                <span className="text-muted-foreground ml-1 font-normal">
                                    (optional — defaults to you)
                                </span>
                            </Label>
                            <Input id="submitted_by" name="submitted_by" />
                            <FieldError message={errors.submitted_by} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="bg-background min-h-32 rounded-md border px-3 py-2 text-sm"
                            />
                            <FieldError message={errors.message} />
                        </div>
                        <Button type="submit" disabled={processing} className="w-fit">
                            {processing ? 'Submitting...' : 'Submit feedback'}
                        </Button>
                    </section>
                )}
            </Form>
        </div>
    );
}

CreateFeedback.layout = () => ({
    breadcrumbs: [
        { title: 'Feedback', href: basePath },
        { title: 'Create', href: `${basePath}/create` },
    ],
});