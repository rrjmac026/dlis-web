import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = { value: string; label: string };

export type OrdinanceRecord = {
    id: number;
    ordinance_number: string;
    series_number: string | null;
    title: string;
    subject: string | null;
    type: string;
    status: string;
    sponsor: string | null;
    committee: string | null;
    date_passed: string | null;
    date_approved: string | null;
    date_published: string | null;
    reference_number: string | null;
    nrs_nsb: string | null;
    nomenclature: string | null;
    final_action: string | null;
    location: string | null;
    state: string;
    document_path: string | null;
    added_by: string | null;
    added_at: string | null;
    versions?: OrdinanceVersion[];
};

export type OrdinanceVersion = {
    id: number;
    version_number: number;
    title: string;
    content: string;
    date_enacted: string;
    enacted_by: string;
    amendment_notes: string | null;
};

type Props = {
    ordinance?: OrdinanceRecord;
    basePath: string;
    types: Option[];
    statuses: Option[];
    states: Option[];
    finalActions: Option[];
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

export default function OrdinanceForm({
    ordinance,
    basePath,
    types,
    statuses,
    states,
    finalActions,
}: Props) {
    const isEditing = Boolean(ordinance);
    const value = (
        key: Exclude<keyof OrdinanceRecord, 'versions'>,
    ): string | number => {
        const current = ordinance?.[key];

        return typeof current === 'string' || typeof current === 'number'
            ? current
            : '';
    };

    return (
        <Form
            action={isEditing ? `${basePath}/${ordinance?.id}` : basePath}
            method="post"
            transform={(data) => (isEditing ? { ...data, _method: 'put' } : data)}
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="ordinance_number">
                                Ordinance number
                            </Label>
                            <Input
                                id="ordinance_number"
                                name="ordinance_number"
                                defaultValue={value('ordinance_number')}
                                required
                            />
                            <FieldError message={errors.ordinance_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="series_number">Series number</Label>
                            <Input
                                id="series_number"
                                name="series_number"
                                defaultValue={value('series_number')}
                            />
                            <FieldError message={errors.series_number} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={value('title')}
                                required
                            />
                            <FieldError message={errors.title} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="subject">Subject</Label>
                            <textarea
                                id="subject"
                                name="subject"
                                defaultValue={value('subject')}
                                className="bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                            />
                            <FieldError message={errors.subject} />
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2 lg:grid-cols-3">
                        <SelectField
                            name="type"
                            label="Type"
                            options={types}
                            value={value('type')}
                            required
                            error={errors.type}
                        />
                        <SelectField
                            name="status"
                            label="Status"
                            options={statuses}
                            value={value('status')}
                            required
                            error={errors.status}
                        />
                        <SelectField
                            name="state"
                            label="State"
                            options={states}
                            value={value('state')}
                            error={errors.state}
                        />
                        <SelectField
                            name="final_action"
                            label="Final action"
                            options={finalActions}
                            value={value('final_action')}
                            error={errors.final_action}
                        />
                        <TextField
                            name="sponsor"
                            label="Sponsor"
                            value={value('sponsor')}
                            error={errors.sponsor}
                        />
                        <TextField
                            name="committee"
                            label="Committee"
                            value={value('committee')}
                            error={errors.committee}
                        />
                        <TextField
                            name="reference_number"
                            label="Reference number"
                            value={value('reference_number')}
                            error={errors.reference_number}
                        />
                        <TextField
                            name="nrs_nsb"
                            label="NRS / NSB"
                            value={value('nrs_nsb')}
                            error={errors.nrs_nsb}
                        />
                        <TextField
                            name="nomenclature"
                            label="Nomenclature"
                            value={value('nomenclature')}
                            error={errors.nomenclature}
                        />
                        <TextField
                            name="location"
                            label="Location"
                            value={value('location')}
                            error={errors.location}
                        />
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-3">
                        <DateField
                            name="date_passed"
                            label="Date passed"
                            value={value('date_passed')}
                            error={errors.date_passed}
                        />
                        <DateField
                            name="date_approved"
                            label="Date approved"
                            value={value('date_approved')}
                            error={errors.date_approved}
                        />
                        <DateField
                            name="date_published"
                            label="Date published"
                            value={value('date_published')}
                            error={errors.date_published}
                        />
                        <div className="grid gap-2 md:col-span-3">
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
                              : 'Create ordinance'}
                    </Button>
                </>
            )}
        </Form>
    );
}

function TextField({
    name,
    label,
    value,
    error,
}: {
    name: string;
    label: string;
    value: string | number;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} defaultValue={value} />
            <FieldError message={error} />
        </div>
    );
}

function DateField({
    name,
    label,
    value,
    error,
}: {
    name: string;
    label: string;
    value: string | number;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type="date" defaultValue={value} />
            <FieldError message={error} />
        </div>
    );
}

function SelectField({
    name,
    label,
    options,
    value,
    required = false,
    error,
}: {
    name: string;
    label: string;
    options: Option[];
    value: string | number;
    required?: boolean;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <select
                id={name}
                name={name}
                defaultValue={value}
                required={required}
                className="bg-background h-9 rounded-md border px-3 text-sm"
            >
                {!required && (
                    <option value="">Select {label.toLowerCase()}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FieldError message={error} />
        </div>
    );
}
