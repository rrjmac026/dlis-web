import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
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
    defaultValue: string;
    error?: string;
    type?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} defaultValue={defaultValue} />
            <FieldError message={error} />
        </div>
    );
}

export default function ResolutionForm({ resolution, basePath }: Props) {
    const isEditing = Boolean(resolution);
    const value = (
        key: Exclude<keyof ResolutionRecord, 'clauses'>,
    ): string => {
        const current = resolution?.[key];
        return typeof current === 'string' ? current : '';
    };

    const [whereasClauses, setWhereasClauses] = useState<string[]>(
        resolution?.clauses
            ?.filter((c) => c.clause_type === 'Whereas')
            .sort((a, b) => a.order - b.order)
            .map((c) => c.text) ?? [''],
    );
    const [resolvedClauses, setResolvedClauses] = useState<string[]>(
        resolution?.clauses
            ?.filter((c) => c.clause_type === 'Resolved')
            .sort((a, b) => a.order - b.order)
            .map((c) => c.text) ?? [''],
    );

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
                            defaultValue={value('resolution_number')}
                            error={errors.resolution_number}
                        />
                        <TextField
                            name="title"
                            label="Title"
                            defaultValue={value('title')}
                            error={errors.title}
                        />
                        <TextField
                            name="sb_term"
                            label="SB term"
                            defaultValue={value('sb_term')}
                            error={errors.sb_term}
                        />
                        <TextField
                            name="session_info"
                            label="Session info"
                            defaultValue={value('session_info')}
                            error={errors.session_info}
                        />
                        <TextField
                            name="committee"
                            label="Committee"
                            defaultValue={value('committee')}
                            error={errors.committee}
                        />
                        <TextField
                            name="sponsor"
                            label="Sponsor"
                            defaultValue={value('sponsor')}
                            error={errors.sponsor}
                        />
                        <TextField
                            name="date_approved"
                            label="Date approved"
                            type="date"
                            defaultValue={value('date_approved')}
                            error={errors.date_approved}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2 lg:grid-cols-4">
                        <TextField
                            name="affirmative_votes"
                            label="Affirmative votes"
                            defaultValue={value('affirmative_votes')}
                            error={errors.affirmative_votes}
                        />
                        <TextField
                            name="negative_votes"
                            label="Negative votes"
                            defaultValue={value('negative_votes')}
                            error={errors.negative_votes}
                        />
                        <TextField
                            name="abstained_votes"
                            label="Abstained votes"
                            defaultValue={value('abstained_votes')}
                            error={errors.abstained_votes}
                        />
                        <TextField
                            name="absent_votes"
                            label="Absent votes"
                            defaultValue={value('absent_votes')}
                            error={errors.absent_votes}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-3">
                        <TextField
                            name="certified_adopted_by"
                            label="Certified adopted by"
                            defaultValue={value('certified_adopted_by')}
                            error={errors.certified_adopted_by}
                        />
                        <TextField
                            name="certified_date"
                            label="Certified date"
                            type="date"
                            defaultValue={value('certified_date')}
                            error={errors.certified_date}
                        />
                        <div />
                        <TextField
                            name="verified_by"
                            label="Verified by"
                            defaultValue={value('verified_by')}
                            error={errors.verified_by}
                        />
                        <TextField
                            name="verified_date"
                            label="Verified date"
                            type="date"
                            defaultValue={value('verified_date')}
                            error={errors.verified_date}
                        />
                        <div />
                        <TextField
                            name="attested_by"
                            label="Attested by"
                            defaultValue={value('attested_by')}
                            error={errors.attested_by}
                        />
                        <TextField
                            name="attested_date"
                            label="Attested date"
                            type="date"
                            defaultValue={value('attested_date')}
                            error={errors.attested_date}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <ClauseListEditor
                            label="Whereas clauses"
                            fieldName="whereas_clauses"
                            values={whereasClauses}
                            onChange={setWhereasClauses}
                        />
                        <ClauseListEditor
                            label="Resolved clauses"
                            fieldName="resolved_clauses"
                            values={resolvedClauses}
                            onChange={setResolvedClauses}
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

function ClauseListEditor({
    label,
    fieldName,
    values,
    onChange,
}: {
    label: string;
    fieldName: string;
    values: string[];
    onChange: (values: string[]) => void;
}) {
    const update = (index: number, text: string) => {
        const next = [...values];
        next[index] = text;
        onChange(next);
    };

    const add = () => onChange([...values, '']);

    const remove = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="space-y-2">
                {values.map((text, index) => (
                    <div key={index} className="flex gap-2">
                        <textarea
                            name={`${fieldName}[]`}
                            value={text}
                            onChange={(e) => update(index, e.target.value)}
                            className="bg-background min-h-16 flex-1 rounded-md border px-3 py-2 text-sm"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={add}>
                <Plus /> Add clause
            </Button>
        </div>
    );
}