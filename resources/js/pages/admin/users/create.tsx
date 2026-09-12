import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import UserForm from './form';

type Option = { value: number; label: string };

type Props = {
    roles: Option[];
};

const basePath = '/admin/users';

export default function CreateUser({ roles }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Create User" />
            <Heading
                title="Create user"
                description="Add a new account and assign its role."
            />
            <UserForm basePath={basePath} roles={roles} />
        </div>
    );
}

CreateUser.layout = () => ({
    breadcrumbs: [
        { title: 'Users', href: basePath },
        { title: 'Create', href: `${basePath}/create` },
    ],
});
