import { Form, Head, Link } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/role-badge';
import type { UserRecord } from './form';

type AuditLogEntry = {
    id: number;
    action: string;
    description: string;
    created_at: string;
};

type Props = {
    user: UserRecord & { audit_logs?: AuditLogEntry[] };
};

const basePath = '/admin/users';

export default function ShowUser({ user }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={user.username} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading title={user.name} description={user.email} />
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`${basePath}/${user.id}/edit`}>
                            <Edit /> Edit
                        </Link>
                    </Button>
                    <Form
                        action={`${basePath}/${user.id}`}
                        method="delete"
                        onSubmit={(event) => {
                            if (!window.confirm(`Delete user "${user.username}"?`)) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <Button variant="destructive" type="submit">
                            <Trash2 /> Delete
                        </Button>
                    </Form>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-lg border p-6 lg:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold">
                        Account details
                    </h2>
                    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Username
                            </dt>
                            <dd className="mt-1">{user.username}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Role
                            </dt>
                            <dd className="mt-1">
                                <RoleBadge role={user.role} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Status
                            </dt>
                            <dd className="mt-1">
                                {user.is_active ? 'Active' : 'Inactive'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Created
                            </dt>
                            <dd className="mt-1">{user.created_at ?? '—'}</dd>
                        </div>
                    </dl>
                </section>

                <section className="rounded-lg border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Recent activity
                    </h2>
                    {user.audit_logs?.length ? (
                        <div className="space-y-4">
                            {user.audit_logs.map((log) => (
                                <article key={log.id} className="border-l-2 pl-3">
                                    <p className="font-medium">{log.action}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {log.description}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {log.created_at}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No activity recorded.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

ShowUser.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Users', href: basePath },
        { title: props?.user?.username ?? '', href: props ? `${basePath}/${props.user.id}` : basePath },
    ],
});
