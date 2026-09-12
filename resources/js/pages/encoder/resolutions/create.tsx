import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ResolutionForm from './form';

type Props = {
    basePath: string;
};

export default function CreateResolution(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Create Resolution" />
            <Heading
                title="Create resolution"
                description="Add a new resolution to the legislative library."
            />
            <ResolutionForm {...props} />
        </div>
    );
}

CreateResolution.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Resolutions', href: props?.basePath ?? '/resolutions' },
        { title: 'Create', href: props ? `${props.basePath}/create` : '/resolutions/create' },
    ],
});