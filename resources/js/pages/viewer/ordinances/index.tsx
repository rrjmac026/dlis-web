import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status-badge';
import type { Auth } from '@/types';
import type { OrdinanceRecord } from './form';

type Option = { value: string; label: string };
type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    ordinances: {
        data: OrdinanceRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { search?: string; status?: string };
    statuses: Option[];
    basePath: string;
};

export default function OrdinanceIndex({
    ordinances,
    filters,
    statuses,
    basePath,
}: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const canManage = auth.user.role >= 1; // Encoder and above

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Ordinances" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Ordinances"
                    description="Browse and manage legislative ordinances."
                />
                {canManage && (
                    <Button asChild>
                        <Link href={`${basePath}/create`}>
                            <Plus /> Add ordinance
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
                        placeholder="Search number, title, or subject"
                        className="pl-9"
                    />
                </div>
                <select
                    name="status"
                    defaultValue={filters.status ?? ''}
                    className="bg-background h-9 rounded-md border px-3 text-sm"
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
                                <th className="px-4 py-3 font-medium">
                                    Number
                                </th>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Date passed
                                </th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {ordinances.data.map((ordinance) => (
                                <tr
                                    key={ordinance.id}
                                    className="hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${ordinance.id}`}
                                            className="hover:underline"
                                        >
                                            {ordinance.ordinance_number}
                                        </Link>
                                    </td>
                                    <td className="max-w-md px-4 py-3">
                                        {ordinance.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={ordinance.status} />
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {ordinance.date_passed ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${ordinance.id}`}
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
                                                            href={`${basePath}/${ordinance.id}/edit`}
                                                            title="Edit"
                                                        >
                                                            <Edit />
                                                        </Link>
                                                    </Button>
                                                    <Form
                                                        action={`${basePath}/${ordinance.id}`}
                                                        method="delete"
                                                        onSubmit={(event) => {
                                                            if (
                                                                !window.confirm(
                                                                    `Delete ordinance "${ordinance.ordinance_number}"?`,
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
                {ordinances.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No ordinances found.
                    </p>
                )}
            </div>

            {ordinances.last_page > 1 && (
                <nav
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label="Pagination"
                >
                    {ordinances.links.map((link, index) =>
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

OrdinanceIndex.layout = (props?: Props) => ({
    breadcrumbs: [{ title: 'Ordinances', href: props?.basePath ?? '/ordinances' }],
});