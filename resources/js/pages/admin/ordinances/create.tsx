import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import OrdinanceForm from './form';

type Option = { value: string; label: string };

type Props = {
    types: Option[];
    statuses: Option[];
    states: Option[];
    finalActions: Option[];
    basePath: string;
};

export default function CreateOrdinance(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Create Ordinance" />
            <Heading
                title="Create ordinance"
                description="Add a new ordinance to the legislative library."
            />
            <OrdinanceForm {...props} />
        </div>
    );
}

CreateOrdinance.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Ordinances', href: props?.basePath ?? '/ordinances' },
        { title: 'Create', href: props ? `${props.basePath}/create` : '/ordinances/create' },
    ],
});