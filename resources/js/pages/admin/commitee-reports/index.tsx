import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Auth } from '@/types';
import type { CommitteeReportRecord } from './form';

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    reports: {
        data: (CommitteeReportRecord & { attachments_count: number })[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { search?: string };
    basePath: string;
};

export default function CommitteeReportIndex({
    reports,
    filters,
    basePath,
}: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const canManage = auth.user.role >= 1; // Encoder and above

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Committee Reports" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Committee Reports"
                    description="Browse and manage committee reports."
                />
                {canManage && (
                    <Button asChild>
                        <Link href={`${basePath}/create`}>
                            <Plus /> Add report
                        </Link>
                    </Button>
                )}
            </div>

            <Form
                action={basePath}
                method="get"
                className="mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                        name="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="Search number, subject, or submitter"
                        className="pl-9"
                    />
                </div>
                <Button type="submit">Filter</Button>
            </Form>

            <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Number
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Submitted by
                                </th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">
                                    Attachments
                                </th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.data.map((report) => (
                                <tr key={report.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${report.id}`}
                                            className="hover:underline"
                                        >
                                            {report.report_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        {report.submitted_by ?? '—'}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {report.date ?? '—'}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {report.attachments_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${report.id}`}
                                                    title="View"
                                                >
                                                    <Eye />
                                                </Link>
                                            </Button>
                                            {canManage && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`${basePath}/${report.id}/edit`}
                                                            title="Edit"
                                                        >
                                                            <Edit />
                                                        </Link>
                                                    </Button>
                                                    <Form
                                                        action={`${basePath}/${report.id}`}
                                                        method="delete"
                                                        onSubmit={(event) => {
                                                            if (
                                                                !window.confirm(
                                                                    `Delete report "${report.report_number}"?`,
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
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {reports.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No committee reports found.
                    </p>
                )}
            </div>

            {reports.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
                    {reports.links.map((link, index) =>
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

CommitteeReportIndex.layout = (props?: Props) => ({
    breadcrumbs: [{ title: 'Committee Reports', href: props?.basePath ?? '/committee-reports' }],
});