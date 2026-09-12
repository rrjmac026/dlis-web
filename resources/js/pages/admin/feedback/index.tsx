import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export type FeedbackRecord = {
    id: number;
    submitted_by: string | null;
    type: 'bug' | 'concern' | 'suggestion';
    status: 'open' | 'resolved';
    message: string;
    created_at: string;
};

type Option = { value: string; label: string };
type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    feedback: {
        data: FeedbackRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { status?: string; type?: string };
    types: Option[];
    statuses: Option[];
};

const basePath = '/admin/feedback';

const STATUS_STYLES: Record<string, string> = {
    open: 'bg-status-amended-bg text-status-amended-fg',
    resolved: 'bg-status-in-effect-bg text-status-in-effect-fg',
};

export default function FeedbackIndex({ feedback, filters, types, statuses }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Feedback" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Feedback"
                    description="Bug reports, concerns, and suggestions."
                />
                <Button asChild>
                    <Link href={`${basePath}/create`}>
                        <Plus /> Submit feedback
                    </Link>
                </Button>
            </div>

            <Form
                action={basePath}
                method="get"
                className="mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row"
            >
                <select
                    name="type"
                    defaultValue={filters.type ?? ''}
                    className="bg-background h-9 flex-1 rounded-md border px-3 text-sm"
                >
                    <option value="">All types</option>
                    {types.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <select
                    name="status"
                    defaultValue={filters.status ?? ''}
                    className="bg-background h-9 flex-1 rounded-md border px-3 text-sm"
                >
                    <option value="">All statuses</option>
                    {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <Button type="submit">Filter</Button>
            </Form>

            <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">
                                    Message
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Submitted by
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {feedback.data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium capitalize">
                                        <Link
                                            href={`${basePath}/${item.id}`}
                                            className="hover:underline"
                                        >
                                            {item.type}
                                        </Link>
                                    </td>
                                    <td className="text-muted-foreground max-w-md truncate px-4 py-3">
                                        {item.message}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.submitted_by ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[item.status]}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link
                                                    href={`${basePath}/${item.id}`}
                                                    title="View"
                                                >
                                                    <Eye />
                                                </Link>
                                            </Button>
                                            <Form
                                                action={`${basePath}/${item.id}`}
                                                method="delete"
                                                onSubmit={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            'Delete this feedback?',
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    type="submit"
                                                    title="Delete"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </Form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {feedback.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No feedback found.
                    </p>
                )}
            </div>

            {feedback.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
                    {feedback.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url}
                                className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={`${link.label}-${index}`}
                                className="text-muted-foreground px-3 py-1.5 text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </nav>
            )}
        </div>
    );
}

FeedbackIndex.layout = () => ({
    breadcrumbs: [{ title: 'Feedback', href: basePath }],
});