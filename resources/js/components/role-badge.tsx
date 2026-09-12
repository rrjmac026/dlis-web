const ROLE_LABELS: Record<number, string> = {
    0: 'Viewer',
    1: 'Encoder',
    2: 'Admin',
    3: 'SuperAdmin',
};

const ROLE_STYLES: Record<number, string> = {
    0: 'bg-status-review-bg text-status-review-fg',
    1: 'bg-status-superseded-bg text-status-superseded-fg',
    2: 'bg-status-amended-bg text-status-amended-fg',
    3: 'bg-status-in-effect-bg text-status-in-effect-fg',
};

export function RoleBadge({ role }: { role: number }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role] ?? 'bg-muted text-muted-foreground'}`}
        >
            {ROLE_LABELS[role] ?? 'Unknown'}
        </span>
    );
}
