import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import type { MinutesRecord } from './form';

type Option = { value: string; label: string };
type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    minutes: {
        data: MinutesRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { session_type?: string };
    sessionTypes: Option[];
    basePath: string;
};

export default function MinutesIndex({
    minutes,
    filters,
    sessionTypes,
    basePath,
}: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const canManage = auth.user.role >= 1; // Encoder and above

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Minutes" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Minutes"
                    description="Browse and manage council session minutes."
                />
                {canManage && (
                    <Button asChild>
                        <Link href={`${basePath}/create`}>
                            <Plus /> Add minutes
                        </Link>
                    </Button>
                )}
            </div>

            <Form
                action={basePath}
                method="get"
                className="mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row"
            >
                <select
                    name="session_type"
                    defaultValue={filters.session_type ?? ''}
                    className="bg-background h-9 rounded-md border px-3 text-sm"
                >
                    <option value="">All session types</option>
                    {sessionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
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
                                    Session type
                                </th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {minutes.data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${item.id}`}
                                            className="hover:underline"
                                        >
                                            {item.session_type}
                                        </Link>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {item.date ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${item.id}`}
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
                                                            href={`${basePath}/${item.id}/edit`}
                                                            title="Edit"
                                                        >
                                                            <Edit />
                                                        </Link>
                                                    </Button>
                                                    <Form
                                                        action={`${basePath}/${item.id}`}
                                                        method="delete"
                                                        onSubmit={(event) => {
                                                            if (
                                                                !window.confirm(
                                                                    `Delete minutes "${item.session_type}"?`,
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
                {minutes.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No minutes found.
                    </p>
                )}
            </div>

            {minutes.last_page > 1 && (
                <nav
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label="Pagination"
                >
                    {minutes.links.map((link, index) =>
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

MinutesIndex.layout = (props?: Props) => ({
    breadcrumbs: [{ title: 'Minutes', href: props?.basePath ?? '/minutes' }],
});