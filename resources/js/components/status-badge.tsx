const STATUS_STYLES: Record<string, string> = {
    in_effect: 'bg-[var(--status-in-effect-bg)] text-[var(--status-in-effect-fg)]',
    amended: 'bg-[var(--status-amended-bg)] text-[var(--status-amended-fg)]',
    repealed: 'bg-[var(--status-repealed-bg)] text-[var(--status-repealed-fg)]',
    under_review: 'bg-[var(--status-review-bg)] text-[var(--status-review-fg)]',
    superseded: 'bg-[var(--status-superseded-bg)] text-[var(--status-superseded-fg)]',
};

export function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground';

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
        >
            {status.replaceAll('_', ' ')}
        </span>
    );
}
