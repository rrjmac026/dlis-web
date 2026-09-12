import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import UserForm from './form';
import type { UserRecord } from './form';

type Option = { value: number; label: string };

type Props = {
    user: UserRecord;
    roles: Option[];
};

const basePath = '/admin/users';

export default function EditUser({ user, roles }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit ${user.username}`} />
            <Heading
                title="Edit user"
                description={`Update ${user.username}'s account.`}
            />
            <UserForm user={user} basePath={basePath} roles={roles} />
        </div>
    );
}

EditUser.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Users', href: basePath },
        { title: 'Edit', href: props ? `${basePath}/${props.user.id}/edit` : basePath },
    ],
});
