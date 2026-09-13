import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BookOpen,
    FileCheck2,
    FileText,
    MessageSquareText,
    ScrollText,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';

type DashboardStats = {
    users: number;
    activeUsers: number;
    ordinances: number;
    resolutions: number;
    minutes: number;
    committeeReports: number;
    feedback: number;
};

type ActivityItem = {
    id: number;
    username: string;
    action: string;
    details: string | null;
    created_at: string;
};

type Props = {
    stats: DashboardStats;
    recentActivity: ActivityItem[];
};

const statCards = [
    { key: 'users', label: 'Total users', icon: Users },
    { key: 'ordinances', label: 'Ordinances', icon: ScrollText },
    { key: 'resolutions', label: 'Resolutions', icon: FileCheck2 },
    { key: 'minutes', label: 'Minutes', icon: FileText },
] as const;

const contentLinks = [
    { label: 'Committee reports', path: '/committee-reports', icon: BookOpen },
    { label: 'Feedback', path: '/feedback', icon: MessageSquareText },
];

function timeOfDayGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

export default function AdminDashboard({ stats, recentActivity }: Props) {
    const { auth } = usePage().props as { auth: Auth };
    // Fixed: auth.user.name doesn't exist — the User model only has
    // 'username' (no 'name' column on the real WPF-sourced table).
    const displayName = auth.user.username ?? 'there';

    return (
        <>
            <Head title="Admin Dashboard" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm font-medium">
                        Administration
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {timeOfDayGreeting()}, {displayName}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Monitor the document library, users, and recent
                        activity.
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ key, label, icon: Icon }) => (
                        <Card key={key}>
                            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-muted-foreground text-sm font-medium">
                                    {label}
                                </CardTitle>
                                <Icon className="text-muted-foreground size-4" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold tabular-nums">
                                    {stats[key].toLocaleString()}
                                </p>
                                {key === 'users' && (
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {stats.activeUsers.toLocaleString()}{' '}
                                        active accounts
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent activity</CardTitle>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    The latest changes made in the system.
                                </p>
                            </div>
                            <Activity className="text-muted-foreground size-5" />
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length > 0 ? (
                                <div className="divide-y">
                                    {recentActivity.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium">
                                                    {item.action}
                                                </p>
                                                <p className="text-muted-foreground truncate text-sm">
                                                    {item.details ||
                                                        `By ${item.username}`}
                                                </p>
                                            </div>
                                            <time className="text-muted-foreground shrink-0 text-xs">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString()}
                                            </time>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground py-6 text-sm">
                                    No activity has been recorded yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content management</CardTitle>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Quick access to administrative workspaces.
                            </p>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {contentLinks.map(({ label, path, icon: Icon }) => (
                                <Link
                                    key={path}
                                    href={path}
                                    className="hover:bg-muted flex items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors"
                                >
                                    <Icon className="text-muted-foreground size-4" />
                                    <span className="flex-1">{label}</span>
                                    <ArrowRight className="text-muted-foreground size-4" />
                                </Link>
                            ))}
                            <Link
                                href="/users"
                                className="hover:bg-muted flex items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors"
                            >
                                <ShieldCheck className="text-muted-foreground size-4" />
                                <span className="flex-1">Manage users</span>
                                <ArrowRight className="text-muted-foreground size-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin Dashboard', href: '/admin/dashboard' }],
};