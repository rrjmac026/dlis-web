import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type CommitteeReportAttachment = {
    id: number;
    file_name: string;
    file_path: string;
};

export type CommitteeReportRecord = {
    id: number;
    report_number: string;
    date: string | null;
    submitted_by: string | null;
    sponsored_by: string | null;
    subject: string | null;
    added_by: string | null;
    added_at: string | null;
    attachments?: CommitteeReportAttachment[];
    attachments_count?: number;
};

type Props = {
    report?: CommitteeReportRecord;
    basePath: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

export default function CommitteeReportForm({ report, basePath }: Props) {
    const isEditing = Boolean(report);
    const value = (
        key: Exclude<keyof CommitteeReportRecord, 'attachments' | 'attachments_count'>,
    ): string | number => {
        const current = report?.[key];

        return typeof current === 'string' || typeof current === 'number'
            ? current
            : '';
    };

    return (
        <Form
            action={isEditing ? `${basePath}/${report?.id}` : basePath}
            method="post"
            transform={(data) => (isEditing ? { ...data, _method: 'put' } : data)}
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="report_number">
                                Report number
                            </Label>
                            <Input
                                id="report_number"
                                name="report_number"
                                defaultValue={value('report_number')}
                                required
                            />
                            <FieldError message={errors.report_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                defaultValue={value('date')}
                            />
                            <FieldError message={errors.date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="submitted_by">Submitted by</Label>
                            <Input
                                id="submitted_by"
                                name="submitted_by"
                                defaultValue={value('submitted_by')}
                            />
                            <FieldError message={errors.submitted_by} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sponsored_by">Sponsored by</Label>
                            <Input
                                id="sponsored_by"
                                name="sponsored_by"
                                defaultValue={value('sponsored_by')}
                            />
                            <FieldError message={errors.sponsored_by} />
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

                    <section className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="attachments">Attachments</Label>
                            <Input
                                id="attachments"
                                name="attachments[]"
                                type="file"
                                multiple
                            />
                            <p className="text-muted-foreground text-xs">
                                Any file type, up to 10 MB each.
                            </p>
                            <FieldError message={errors['attachments.0']} />
                        </div>

                        {isEditing && report?.attachments?.length ? (
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Existing attachments
                                </p>
                                <ul className="divide-y rounded-md border">
                                    {report.attachments.map((attachment) => (
                                        <li
                                            key={attachment.id}
                                            className="flex items-center justify-between px-3 py-2 text-sm"
                                        >
                                            <span>{attachment.file_name}</span>
                                            <Form
                                                action={`${basePath}/${report.id}/attachments/${attachment.id}`}
                                                method="delete"
                                                onSubmit={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            `Remove "${attachment.file_name}"?`,
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    type="submit"
                                                >
                                                    Remove
                                                </Button>
                                            </Form>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </section>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? 'Saving...'
                            : isEditing
                              ? 'Save changes'
                              : 'Create report'}
                    </Button>
                </>
            )}
        </Form>
    );
}