import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import MinutesForm from './form';

type Props = {
    basePath: string;
};

export default function CreateMinutes(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Record Minutes" />
            <Heading
                title="Record minutes"
                description="Add new session minutes."
            />
            <MinutesForm {...props} />
        </div>
    );
}

CreateMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/encoder/minutes' },
        { title: 'Create', href: props ? `${props.basePath}/create` : '/encoder/minutes/create' },
    ],
});