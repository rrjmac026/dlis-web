import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Activity,
    FileCheck2,
    FileText,
    LayoutDashboard,
    MessageSquareText,
    ScrollText,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

// base (Viewer) paths — bare, read-only
const viewerNavItems: NavItem[] = [
    {
        title: 'Committee reports',
        href: '/committee-reports',
        icon: FileText,
    },
    {
        title: 'Minutes',
        href: '/minutes',
        icon: FileCheck2,
    },
    {
        title: 'Ordinances',
        href: '/ordinances',
        icon: ScrollText,
    },
    {
        title: 'Resolutions',
        href: '/resolutions',
        icon: FileCheck2,
    },
    {
        title: 'Audit logs',
        href: '/audit-logs',
        icon: Activity,
    },
];

const encoderNavItems: NavItem[] = [
    {
        title: 'Feedback',
        href: '/encoder/feedback',
        icon: MessageSquareText,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [];

// Resources that get a role-prefixed href swap. Audit logs are excluded —
// Encoder has no audit-log route at all, and Viewer/Admin share the bare
// read route, so it never needs prefixing.
const PREFIXABLE_TITLES = [
    'Committee reports',
    'Minutes',
    'Ordinances',
    'Resolutions',
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };
    const role = auth.user.role;

    // Fixed: was only branching for Admin (role >= 2), so Encoder (role 1)
    // fell through to the bare dashboard() helper instead of /encoder/dashboard.
    const dashboardHref =
        role >= 2 ? '/admin/dashboard' : role >= 1 ? '/encoder/dashboard' : dashboard();

    const recordsNavItems = viewerNavItems.map((item) => {
        if (!PREFIXABLE_TITLES.includes(item.title)) {
            return item;
        }

        if (role >= 2) {
            return { ...item, href: `/admin${item.href}` };
        }

        if (role >= 1) {
            return { ...item, href: `/encoder${item.href}` };
        }

        return item;
    });

    const overviewNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardHref,
            icon: LayoutDashboard,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={overviewNavItems} label="Overview" />
                <NavMain items={recordsNavItems} label="Records" />
                {role >= 1 && (
                    <NavMain items={encoderNavItems} label="Workflow" />
                )}
                {role >= 2 && (
                    <NavMain
                        items={adminNavItems.filter(
                            (item) => item.href !== dashboardHref,
                        )}
                        label="Administration"
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}