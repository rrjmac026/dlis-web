import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type MinutesRecord = {
    id: number;
    session_type: string;
    date: string | null;
    document_path: string | null;
};

type Props = {
    minutes?: MinutesRecord;
    basePath: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

const SESSION_TYPES = ['Regular Session', 'Special Session'];

export default function MinutesForm({ minutes, basePath }: Props) {
    const isEditing = Boolean(minutes);

    return (
        <Form
            action={isEditing ? `${basePath}/${minutes?.id}` : basePath}
            method="post"
            transform={(data) => (isEditing ? { ...data, _method: 'put' } : data)}
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="session_type">Session type</Label>
                            <select
                                id="session_type"
                                name="session_type"
                                defaultValue={minutes?.session_type ?? ''}
                                required
                                className="bg-background h-9 rounded-md border px-3 text-sm"
                            >
                                <option value="">Select session type</option>
                                {SESSION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.session_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                defaultValue={minutes?.date ?? ''}
                            />
                            <FieldError message={errors.date} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="document">Document</Label>
                            <Input
                                id="document"
                                name="document"
                                type="file"
                                accept=".pdf,.doc,.docx"
                            />
                            <p className="text-muted-foreground text-xs">
                                PDF, DOC, or DOCX up to 20 MB.
                            </p>
                            <FieldError message={errors.document} />
                        </div>
                    </section>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? 'Saving...'
                            : isEditing
                              ? 'Save changes'
                              : 'Create minutes'}
                    </Button>
                </>
            )}
        </Form>
    );
}