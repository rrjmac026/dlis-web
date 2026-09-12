import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import MinutesForm from './form';

type Option = { value: string; label: string };

type Props = {
    sessionTypes: Option[];
    basePath: string;
};

export default function CreateMinutes(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Create Minutes" />
            <Heading
                title="Create minutes"
                description="Record minutes for a council session."
            />
            <MinutesForm {...props} />
        </div>
    );
}

CreateMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/minutes' },
        { title: 'Create', href: props ? `${props.basePath}/create` : '/minutes/create' },
    ],
});