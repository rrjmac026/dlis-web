import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import CommitteeReportForm from './form';

type Props = {
    basePath: string;
};

export default function CreateCommitteeReport(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Create Committee Report" />
            <Heading
                title="Create committee report"
                description="Add a new committee report to the library."
            />
            <CommitteeReportForm {...props} />
        </div>
    );
}

CreateCommitteeReport.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Committee Reports', href: props?.basePath ?? '/committee-reports' },
        { title: 'Create', href: props ? `${props.basePath}/create` : '/committee-reports/create' },
    ],
});