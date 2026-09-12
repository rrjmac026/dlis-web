import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Option = { value: string; label: string };

type Props = {
    types: Option[];
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

export default function FeedbackForm({ types }: Props) {
    return (
        <Form
            action="/encoder/feedback"
            method="post"
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                className="bg-background h-9 rounded-md border px-3 text-sm"
                            >
                                <option value="">Select type</option>
                                {types.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.type} />
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
                    </section>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Submitting...' : 'Submit feedback'}
                    </Button>
                </>
            )}
        </Form>
    );
}