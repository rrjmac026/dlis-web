import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type AuditLogRecord = {
    id: number;
    user_id: number | null;
    username: string;
    action: string;
    details: string | null;
    created_at: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    logs: {
        data: AuditLogRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { username?: string; action?: string };
};

const basePath = '/admin/audit-logs';

export default function AuditLogIndex({ logs, filters }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Audit Logs" />
            <Heading
                title="Audit logs"
                description="Track changes made across the system."
            />

            <Form
                action={basePath}
                method="get"
                className="mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                        name="username"
                        defaultValue={filters.username ?? ''}
                        placeholder="Filter by username"
                        className="pl-9"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        name="action"
                        defaultValue={filters.action ?? ''}
                        placeholder="Filter by action"
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
                                    Action
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Username
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Details
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Date
                                </th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        {log.action}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.username}
                                    </td>
                                    <td className="text-muted-foreground max-w-md truncate px-4 py-3">
                                        {log.details ?? '—'}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link
                                                    href={`${basePath}/${log.id}`}
                                                    title="View"
                                                >
                                                    <Eye />
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No activity recorded.
                    </p>
                )}
            </div>

            {logs.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
                    {logs.links.map((link, index) =>
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

AuditLogIndex.layout = () => ({
    breadcrumbs: [{ title: 'Audit logs', href: basePath }],
});