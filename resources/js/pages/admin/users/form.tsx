import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = { value: number; label: string };

export type UserRecord = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: number;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    user?: UserRecord;
    basePath: string;
    roles: Option[];
};

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-destructive text-sm">{message}</p>
    ) : null;
}

export default function UserForm({ user, basePath, roles }: Props) {
    const isEditing = Boolean(user);

    return (
        <Form
            action={isEditing ? `${basePath}/${user?.id}` : basePath}
            method={isEditing ? 'put' : 'post'}
            className="space-y-8"
        >
            {({ processing, errors }) => (
                <>
                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user?.name ?? ''}
                                required
                            />
                            <FieldError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                defaultValue={user?.username ?? ''}
                                required
                            />
                            <FieldError message={errors.username} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user?.email ?? ''}
                                required
                            />
                            <FieldError message={errors.email} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="password">
                                Password
                                {isEditing && (
                                    <span className="text-muted-foreground ml-1 font-normal">
                                        (leave blank to keep current password)
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required={!isEditing}
                            />
                            <FieldError message={errors.password} />
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-lg border p-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                name="role"
                                defaultValue={user?.role ?? roles[0]?.value}
                                required
                                className="bg-background h-9 rounded-md border px-3 text-sm"
                            >
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            <FieldError message={errors.role} />
                        </div>
                        <div className="flex items-end gap-2 pb-2">
                            <input
                                id="is_active"
                                name="is_active"
                                type="checkbox"
                                value="1"
                                defaultChecked={user?.is_active ?? true}
                                className="size-4 rounded border"
                            />
                            <Label htmlFor="is_active" className="mb-0">
                                Active account
                            </Label>
                            <FieldError message={errors.is_active} />
                        </div>
                    </section>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? 'Saving...'
                            : isEditing
                              ? 'Save changes'
                              : 'Create user'}
                    </Button>
                </>
            )}
        </Form>
    );
}
