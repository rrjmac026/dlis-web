import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ResolutionForm from './form';
import type { ResolutionRecord } from './form';

type Props = {
    resolution: ResolutionRecord;
    basePath: string;
};

export default function EditResolution(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit ${props.resolution.resolution_number}`} />
            <Heading
                title="Edit resolution"
                description={`Update ${props.resolution.resolution_number}.`}
            />
            <ResolutionForm key={props.resolution.id} {...props} />
        </div>
    );
}

EditResolution.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Resolutions', href: props?.basePath ?? '/encoder/resolutions' },
        { title: 'Edit', href: props ? `${props.basePath}/${props.resolution.id}/edit` : '/encoder/resolutions' },
    ],
});