import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import MinutesForm from './form';
import type { MinutesRecord } from './form';

type Props = {
    minutes: MinutesRecord;
    basePath: string;
};

export default function EditMinutes(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit ${props.minutes.session_type}`} />
            <Heading
                title="Edit minutes"
                description={`Update ${props.minutes.session_type} on ${props.minutes.date ?? 'unspecified date'}.`}
            />
            <MinutesForm {...props} />
        </div>
    );
}

EditMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/encoder/minutes' },
        { title: 'Edit', href: props ? `${props.basePath}/${props.minutes.id}/edit` : '/encoder/minutes' },
    ],
});