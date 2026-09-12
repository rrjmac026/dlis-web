import { Form, Head, Link } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/role-badge';
import type { UserRecord } from './form';

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    users: {
        data: UserRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
};

const basePath = '/admin/users';

export default function UserIndex({ users }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Users" />
            <div className="flex items-start justify-between gap-4">
                <Heading
                    title="Users"
                    description="Manage system accounts and roles."
                />
                <Button asChild>
                    <Link href={`${basePath}/create`}>
                        <Plus /> Add user
                    </Link>
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">
                                    Username
                                </th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`${basePath}/${user.id}`}
                                            className="hover:underline"
                                        >
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.username}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                user.is_active
                                                    ? 'text-status-in-effect-fg'
                                                    : 'text-muted-foreground'
                                            }
                                        >
                                            {user.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`${basePath}/${user.id}`}
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
                                                    href={`${basePath}/${user.id}/edit`}
                                                    title="Edit"
                                                >
                                                    <Edit />
                                                </Link>
                                            </Button>
                                            <Form
                                                action={`${basePath}/${user.id}`}
                                                method="delete"
                                                onSubmit={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            `Delete user "${user.username}"?`,
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
                {users.data.length === 0 && (
                    <p className="text-muted-foreground p-8 text-center text-sm">
                        No users found.
                    </p>
                )}
            </div>

            {users.last_page > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Pagination">
                    {users.links.map((link, index) =>
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

UserIndex.layout = () => ({
    breadcrumbs: [{ title: 'Users', href: basePath }],
});
