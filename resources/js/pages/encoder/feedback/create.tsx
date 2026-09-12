import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import FeedbackForm from './form';

type Option = { value: string; label: string };

type Props = {
    types: Option[];
};

export default function CreateFeedback({ types }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Submit Feedback" />
            <Heading
                title="Submit feedback"
                description="Report a bug, concern, or suggestion."
            />
            <FeedbackForm types={types} />
        </div>
    );
}

CreateFeedback.layout = {
    breadcrumbs: [
        { title: 'Feedback', href: '/encoder/feedback' },
        { title: 'Submit', href: '/encoder/feedback/create' },
    ],
};