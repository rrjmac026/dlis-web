import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import OrdinanceForm from './form';
import type { OrdinanceRecord } from './form';

type Option = { value: string; label: string };

type Props = {
    ordinance: OrdinanceRecord;
    types: Option[];
    statuses: Option[];
    states: Option[];
    finalActions: Option[];
    basePath: string;
};

export default function EditOrdinance(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit ${props.ordinance.ordinance_number}`} />
            <Heading
                title="Edit ordinance"
                description={`Update ${props.ordinance.ordinance_number}.`}
            />
            <OrdinanceForm {...props} />
        </div>
    );
}

EditOrdinance.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Ordinances', href: props?.basePath ?? '/ordinances' },
        { title: 'Edit', href: props ? `${props.basePath}/${props.ordinance.id}/edit` : '/ordinances' },
    ],
});