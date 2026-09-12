import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ResolutionClause = {
    id: number;
    clause_type: 'Whereas' | 'Resolved';
    order: number;
    text: string;
};

export type ResolutionRecord = {
    id: number;
    resolution_number: string;
    sb_term: string | null;
    session_info: string | null;
    committee: string | null;
    title: string;
    sponsor: string | null;
    date_approved: string | null;
    affirmative_votes: string | null;
    negative_votes: string | null;
    abstained_votes: string | null;
    absent_votes: string | null;
    certified_adopted_by: string | null;
    certified_date: string | null;
    verified_by: string | null;
    verified_date: string | null;
    attested_by: string | null;
    attested_date: string | null;
    document_path: string | null;
    added_by: string | null;
    added_at: string | null;
    clauses?: ResolutionClause[];
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

function ClauseList({
    label,
    inputName,
    initial,
}: {
    label: string;
    inputName: string;
    initial: string[];
}) {
    const [items, setItems] = useState<string[]>(
        initial.length > 0 ? initial : [''],
    );

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="space-y-2">
                {items.map((value, index) => (
                    <div key={index} className="flex gap-2">
                        <textarea
                            name={`${inputName}[]`}
                            defaultValue={value}
                            className="bg-background min-h-16 flex-1 rounded-md border px-3 py-2 text-sm"
                            placeholder={`${label.slice(0, -1)} text`}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setItems((prev) =>
                                    prev.filter((_, i) => i !== index),
                                )
                            }
                        >
                            <X />
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setItems((prev) => [...prev, ''])}
            >
                <Plus /> Add {label.slice(0, -1).toLowerCase()}
            </Button>
        </div>
    );
}

export default function ResolutionForm({ resolution, basePath }: Props) {
    const isEditing = Boolean(resolution);
    const whereasInitial = (resolution?.clauses ?? [])
        .filter((c) => c.clause_type === 'Whereas')
        .sort((a, b) => a.order - b.order)
        .map((c) => c.text);
    const resolvedInitial = (resolution?.clauses ?? [])
        .filter((c) => c.clause_type === 'Resolved')
        .sort((a, b) => a.order - b.order)
        .map((c) => c.text);

    return (
        <Form
            action={isEditing ? `${basePath}/${resolution?.id}` : basePath}
            method={isEditing ? 'put' : 'post'}
            encType="multipart/form-data"
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

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <h3 className="font-medium md:col-span-2">Votes</h3>
                        <TextField
                            name="affirmative_votes"
                            label="Affirmative"
                            defaultValue={resolution?.affirmative_votes}
                            error={errors.affirmative_votes}
                        />
                        <TextField
                            name="negative_votes"
                            label="Negative"
                            defaultValue={resolution?.negative_votes}
                            error={errors.negative_votes}
                        />
                        <TextField
                            name="abstained_votes"
                            label="Abstained"
                            defaultValue={resolution?.abstained_votes}
                            error={errors.abstained_votes}
                        />
                        <TextField
                            name="absent_votes"
                            label="Absent"
                            defaultValue={resolution?.absent_votes}
                            error={errors.absent_votes}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <h3 className="font-medium md:col-span-2">
                            Certification
                        </h3>
                        <TextField
                            name="certified_adopted_by"
                            label="Certified adopted by"
                            defaultValue={resolution?.certified_adopted_by}
                            error={errors.certified_adopted_by}
                        />
                        <TextField
                            name="certified_date"
                            label="Certified date"
                            type="date"
                            defaultValue={resolution?.certified_date}
                            error={errors.certified_date}
                        />
                        <TextField
                            name="verified_by"
                            label="Verified by"
                            defaultValue={resolution?.verified_by}
                            error={errors.verified_by}
                        />
                        <TextField
                            name="verified_date"
                            label="Verified date"
                            type="date"
                            defaultValue={resolution?.verified_date}
                            error={errors.verified_date}
                        />
                        <TextField
                            name="attested_by"
                            label="Attested by"
                            defaultValue={resolution?.attested_by}
                            error={errors.attested_by}
                        />
                        <TextField
                            name="attested_date"
                            label="Attested date"
                            type="date"
                            defaultValue={resolution?.attested_date}
                            error={errors.attested_date}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6">
                        <ClauseList
                            label="Whereas clauses"
                            inputName="whereas_clauses"
                            initial={whereasInitial}
                        />
                        <ClauseList
                            label="Resolved clauses"
                            inputName="resolved_clauses"
                            initial={resolvedInitial}
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