import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ResolutionRecord = {
    id: number;
    resolution_number: string;
    sb_term: string | null;
    session_info: string | null;
    committee: string | null;
    title: string;
    sponsor: string | null;
    date_approved: string | null;
    document_path: string | null;
    added_by: string | null;
    added_at: string | null;
};

type Props = {
    resolution?: ResolutionRecord;
    basePath: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

function TextField({
    name,
    label,
    defaultValue,
    error,
    type = 'text',
}: {
    name: string;
    label: string;
    defaultValue?: string | null;
    error?: string;
    type?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue ?? ''}
            />
            <FieldError message={error} />
        </div>
    );
}

export default function ResolutionForm({ resolution, basePath }: Props) {
    const isEditing = Boolean(resolution);

    return (
        <Form
            action={isEditing ? `${basePath}/${resolution?.id}` : basePath}
            method="post"
            transform={(data) => (isEditing ? { ...data, _method: 'put' } : data)}
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <TextField
                            name="resolution_number"
                            label="Resolution number"
                            defaultValue={resolution?.resolution_number}
                            error={errors.resolution_number}
                        />
                        <TextField
                            name="sb_term"
                            label="SB term"
                            defaultValue={resolution?.sb_term}
                            error={errors.sb_term}
                        />
                        <TextField
                            name="session_info"
                            label="Session info"
                            defaultValue={resolution?.session_info}
                            error={errors.session_info}
                        />
                        <TextField
                            name="committee"
                            label="Committee"
                            defaultValue={resolution?.committee}
                            error={errors.committee}
                        />
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={resolution?.title ?? ''}
                                required
                            />
                            <FieldError message={errors.title} />
                        </div>
                        <TextField
                            name="sponsor"
                            label="Sponsor"
                            defaultValue={resolution?.sponsor}
                            error={errors.sponsor}
                        />
                        <TextField
                            name="date_approved"
                            label="Date approved"
                            type="date"
                            defaultValue={resolution?.date_approved}
                            error={errors.date_approved}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
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
                              : 'Create resolution'}
                    </Button>
                </>
            )}
        </Form>
    );
}