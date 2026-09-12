import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import MinutesForm from './form';
import type { MinutesRecord } from './form';

type Option = { value: string; label: string };

type Props = {
    minutes: MinutesRecord;
    sessionTypes: Option[];
    basePath: string;
};

export default function EditMinutes(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit minutes #${props.minutes.id}`} />
            <Heading
                title="Edit minutes"
                description={`Update minutes for ${props.minutes.session_type}.`}
            />
            <MinutesForm {...props} />
        </div>
    );
}

EditMinutes.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Minutes', href: props?.basePath ?? '/minutes' },
        { title: 'Edit', href: props ? `${props.basePath}/${props.minutes.id}/edit` : '/minutes' },
    ],
});