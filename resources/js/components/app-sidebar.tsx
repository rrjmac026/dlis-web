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
        href: '/feedback',
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
        href: '/users',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };
    const role = auth.user.role;
    const dashboardHref = role >= 2 ? '/admin/dashboard' : dashboard();
    const recordsNavItems = viewerNavItems.map((item) =>
        item.title === 'Ordinances' && role >= 2
            ? { ...item, href: '/admin/ordinances' }
            : item,
    );
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
