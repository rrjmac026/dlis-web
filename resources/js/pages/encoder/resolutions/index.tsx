import { Form, Head, Link } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ResolutionRecord } from './form';

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    resolutions: {
        data: ResolutionRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: { search?: string };
    basePath: string;
};

export default function ResolutionIndex({ resolutions, filters, basePath }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Resolutions" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Resolutions"
                    description="Browse and manage resolutions."
                />
                <Button asChild>
                    <Link href={`${basePath}/create`}>
                        <Plus /> Add resolution
                    </Link>
                </Button>
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
                        placeholder="Search number, title, or sponsor"
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
                                <th className="px-4 py-3 font-medium">Number</th>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Sponsor</th>
                                <th className="px-4 py-3 font-medium">Date approved</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {resolutions.data.map((resolution) => (
                                <tr key={resolution.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${resolution.id}`}
                                            className="hover:underline"
                                        >
                                            {resolution.resolution_number}
                                        </Link>
                                    </td>
                                    <td className="max-w-md px-4 py-3">
                                        {resolution.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        {resolution.sponsor ?? '—'}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {resolution.date_approved ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`${basePath}/${resolution.id}`} title="View">
                                                    <Eye />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`${basePath}/${resolution.id}/edit`} title="Edit">
                                                    <Edit />
                                                </Link>
                                            </Button>
                                            <Form
                                                action={`${basePath}/${resolution.id}`}
                                                method="delete"
                                                onSubmit={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            `Delete resolution "${resolution.resolution_number}"?`,
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
                {resolutions.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No resolutions found.
                    </p>
                )}
            </div>

            {resolutions.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
                    {resolutions.links.map((link, index) =>
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

ResolutionIndex.layout = (props?: Props) => ({
    breadcrumbs: [{ title: 'Resolutions', href: props?.basePath ?? '/encoder/resolutions' }],
});