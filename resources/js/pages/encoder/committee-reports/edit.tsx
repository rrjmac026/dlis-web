import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import CommitteeReportForm from './form';
import type { CommitteeReportRecord } from './form';

type Props = {
    report: CommitteeReportRecord;
    basePath: string;
};

export default function EditCommitteeReport(props: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={`Edit ${props.report.report_number}`} />
            <Heading
                title="Edit committee report"
                description={`Update ${props.report.report_number}.`}
            />
            <CommitteeReportForm {...props} />
        </div>
    );
}

EditCommitteeReport.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Committee Reports', href: props?.basePath ?? '/encoder/committee-reports' },
        { title: 'Edit', href: props ? `${props.basePath}/${props.report.id}/edit` : '/encoder/committee-reports' },
    ],
});