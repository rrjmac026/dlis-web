import { Form, Head, Link } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { MinutesRecord } from './form';

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    minutes: {
        data: MinutesRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { session_type?: string };
    basePath: string;
};

const SESSION_TYPES = ['Regular Session', 'Special Session'];

export default function MinutesIndex({ minutes, filters, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Minutes" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Minutes"
                    description="Browse and manage session minutes."
                />
                <Button asChild>
                    <Link href={`${basePath}/create`}>
                        <Plus /> Add minutes
                    </Link>
                </Button>
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
                    {SESSION_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
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
                            {minutes.data.map((entry) => (
                                <tr key={entry.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${entry.id}`}
                                            className="hover:underline"
                                        >
                                            {entry.session_type}
                                        </Link>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {entry.date ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${entry.id}`}
                                                    title="View"
                                                >
                                                    <Eye />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${entry.id}/edit`}
                                                    title="Edit"
                                                >
                                                    <Edit />
                                                </Link>
                                            </Button>
                                            <Form
                                                action={`${basePath}/${entry.id}`}
                                                method="delete"
                                                onSubmit={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            `Delete minutes for "${entry.session_type}"?`,
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
                {minutes.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No minutes found.
                    </p>
                )}
            </div>

            {minutes.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
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
    breadcrumbs: [{ title: 'Minutes', href: props?.basePath ?? '/encoder/minutes' }],
});