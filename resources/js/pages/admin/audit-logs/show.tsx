import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import type { AuditLogRecord } from './index';

type Props = {
    log: AuditLogRecord;
};

const basePath = '/admin/audit-logs';

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {label}
            </dt>
            <dd className="mt-1">{value || '—'}</dd>
        </div>
    );
}

export default function ShowAuditLog({ log }: Props) {
    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title={log.action} />
            <Heading title={log.action} description={`Logged by ${log.username}`} />

            <section className="rounded-lg border p-6">
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <Detail label="Username" value={log.username} />
                    <Detail
                        label="Date"
                        value={new Date(log.created_at).toLocaleString()}
                    />
                </dl>
                {log.details && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="mb-2 font-medium">Details</h3>
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                            {log.details}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

ShowAuditLog.layout = (props?: Props) => ({
    breadcrumbs: [
        { title: 'Audit logs', href: basePath },
        { title: props?.log?.action ?? '', href: props ? `${basePath}/${props.log.id}` : basePath },
    ],
});