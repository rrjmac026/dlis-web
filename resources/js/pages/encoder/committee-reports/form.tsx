import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Attachment = {
    id: number;
    file_name: string;
    file_path: string;
    url: string | null;
    viewUrl: string | null;
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
    attachments?: Attachment[];
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

    return (
        <Form
            action={isEditing ? `${basePath}/${report?.id}` : basePath}
            method={isEditing ? 'put' : 'post'}
            encType="multipart/form-data"
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
                                defaultValue={report?.report_number ?? ''}
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
                                defaultValue={report?.date ?? ''}
                            />
                            <FieldError message={errors.date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="submitted_by">Submitted by</Label>
                            <Input
                                id="submitted_by"
                                name="submitted_by"
                                defaultValue={report?.submitted_by ?? ''}
                            />
                            <FieldError message={errors.submitted_by} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sponsored_by">Sponsored by</Label>
                            <Input
                                id="sponsored_by"
                                name="sponsored_by"
                                defaultValue={report?.sponsored_by ?? ''}
                            />
                            <FieldError message={errors.sponsored_by} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="subject">Subject</Label>
                            <textarea
                                id="subject"
                                name="subject"
                                defaultValue={report?.subject ?? ''}
                                className="bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                            />
                            <FieldError message={errors.subject} />
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="attachments">
                                Add attachments
                            </Label>
                            <Input
                                id="attachments"
                                name="attachments[]"
                                type="file"
                                multiple
                            />
                            <p className="text-muted-foreground text-xs">
                                Any file type, up to 10 MB each. Existing
                                attachments are kept — use the show page to
                                remove one.
                            </p>
                            <FieldError message={errors['attachments.0' as never]} />
                        </div>
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