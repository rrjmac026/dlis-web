import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpen,
    FileText,
    GitBranch,
    Link2,
    LogIn,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { login, register } from '@/routes';
import { dashboard } from '@/routes';
const accessLevels = [
    {
        role: 'Admin',
        note: 'Full system access — users, configuration, everything.',
        reach: 100,
    },
    {
        role: 'Legal Officer',
        note: 'Tracks legal status and manages amendment or repeal ties.',
        reach: 70,
    },
    {
        role: 'Legislative Staff',
        note: 'Encodes records, uploads documents, maintains metadata.',
        reach: 55,
    },
    {
        role: 'Viewer',
        note: 'Read-only. Search and view what has been published.',
        reach: 25,
    },
];

const features = [
    {
        icon: Search,
        title: 'Search & filter',
        description:
            'Full-text search across title, subject, and body — narrow by status, type, date range, committee, or sponsor.',
    },
    {
        icon: GitBranch,
        title: 'Amendment history',
        description:
            'Every amendment links back to the ordinance it changes, kept in chronological order.',
    },
    {
        icon: Link2,
        title: 'Ordinance relationships',
        description:
            'Records what a law amends, repeals, supersedes, or merely relates to.',
    },
    {
        icon: FileText,
        title: 'Document attachments',
        description:
            "The original signed ordinance, attached as a PDF, alongside its metadata.",
    },
    {
        icon: BookOpen,
        title: 'Reports',
        description:
            'By year or series, every repealed or amended ordinance, print-ready detail sheets.',
    },
    {
        icon: ShieldCheck,
        title: 'Role-based access',
        description:
            'Admins, legal officers, encoders, and viewers each see only what their role needs.',
    },
];

const lifecycle = [
    {
        stage: 'Drafted',
        detail: 'Proposed and introduced to the Sanggunian.',
    },
    {
        stage: 'Passed',
        detail: 'Approved by the Sanggunian, date recorded.',
    },
    {
        stage: 'Approved',
        detail: "Signed by the Mayor, date logged.",
    },
    {
        stage: 'In effect',
        detail: 'Published and enforceable.',
    },
    {
        stage: 'Amended, superseded, or repealed',
        detail: 'Status updated, with a reference to the ordinance that caused it.',
    },
];

const statuses = [
    { label: 'In effect', color: '#34D399' },
    { label: 'Amended', color: '#FBBF24' },
    { label: 'Superseded', color: '#38BDF8' },
    { label: 'Repealed', color: '#FB7185' },
    { label: 'Under review', color: '#94A3B8' },
];

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user?: { role: number } } };

    const dashboardHref = auth.user
        ? auth.user.role >= 2
            ? '/admin/dashboard'
            : auth.user.role >= 1
              ? '/encoder/dashboard'
              : dashboard()
        : login();


    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#070B14] font-[Inter,system-ui,sans-serif] text-[#EEF2FA]">
            <Head title="Damulog Legislative Information System">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Base gradient wash */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(at_15%_0%,_#101d34_0%,_#0b1223_45%,_#070B14_75%)]" />

            {/* Faint ledger grid texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Two soft color fields — blue and ochre, echoing a wax seal */}
            <div
                className="pointer-events-none fixed -top-32 -left-32 h-[520px] w-[520px] rounded-full blur-[90px]"
                style={{
                    background:
                        'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0) 70%)',
                }}
            />
            <div
                className="pointer-events-none fixed top-[38%] -right-40 h-[460px] w-[460px] rounded-full blur-[90px]"
                style={{
                    background:
                        'radial-gradient(circle, rgba(200,144,42,0.16) 0%, rgba(200,144,42,0) 70%)',
                }}
            />

            <div className="relative">
                {/* Header */}
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06]">
                            <img
                                src="/assets/icons/LOGO.png"
                                alt="DLIS logo"
                                className="size-5 object-contain"
                            />
                        </span>
                        <span className="text-[13px] font-medium tracking-[0.14em] text-white/70">
                            DLIS
                        </span>
                    </Link>
                    {auth.user ? (
                        <Link
                            href={dashboardHref}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#0B1120] transition-opacity hover:opacity-90"
                        >
                            Dashboard <ArrowUpRight className="size-3.5" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
                            >
                                <LogIn className="size-3.5" /> Sign in
                            </Link>
                            <Link
                                href={register()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#0B1120] transition-opacity hover:opacity-90"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 lg:px-8 lg:pt-20">
                        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <h1
                                    className="max-w-lg text-[2.75rem] leading-[1.08] font-medium text-white sm:text-[3.4rem]"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    Every ordinance, its whole story, kept in
                                    order.
                                </h1>
                                <p className="mt-7 max-w-md text-[15px] leading-7 text-white/55">
                                    Damulog's Legislative Information System
                                    holds the ordinances, resolutions,
                                    minutes, and committee reports of the
                                    Sanggunian — with the amendments,
                                    repeals, and relationships between them
                                    kept intact.
                                </p>
                                <div className="mt-9 flex items-center gap-6">
                                    <Link
                                        href={auth.user ? dashboardHref : login()}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-medium text-[#0B1120] transition-opacity hover:opacity-90"
                                    >
                                        Explore the records
                                    </Link>
                                    <a
                                        href="#lifecycle"
                                        className="text-[14px] font-medium text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/85"
                                    >
                                        See how a law moves through the system
                                    </a>
                                </div>
                            </div>

                            {/* Case-file ledger card */}
                            <div className="relative">
                                <div className="rounded-[22px] border border-white/[0.12] bg-white/[0.05] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[11px] tracking-wide text-white/40">
                                                Series of 2024
                                            </p>
                                            <h2
                                                className="mt-1 text-[1.6rem] text-white"
                                                style={{
                                                    fontFamily:
                                                        "'Fraunces', serif",
                                                }}
                                            >
                                                ORD-2024-018
                                            </h2>
                                        </div>
                                        <span className="mt-1 flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                                            <span className="size-1.5 rounded-full bg-emerald-400" />
                                            In effect
                                        </span>
                                    </div>

                                    <p className="mt-5 border-t border-white/10 pt-5 text-[14.5px] leading-6 text-white/70">
                                        An ordinance supporting organized,
                                        transparent local governance.
                                    </p>

                                    <dl className="mt-5 grid grid-cols-2 gap-y-3 text-[13px]">
                                        <dt className="text-white/40">
                                            Date passed
                                        </dt>
                                        <dd className="text-right text-white/80">
                                            18 Jun 2024
                                        </dd>
                                        <dt className="text-white/40">
                                            Sponsor
                                        </dt>
                                        <dd className="text-right text-white/80">
                                            Councilor A. Reyes
                                        </dd>
                                        <dt className="text-white/40">
                                            Amendments
                                        </dt>
                                        <dd className="text-right text-white/80">
                                            2 on record
                                        </dd>
                                    </dl>
                                </div>

                                {/* peeking related-record tab */}
                                <div className="absolute -bottom-5 -left-5 hidden w-40 -rotate-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 backdrop-blur-2xl sm:block">
                                    <p className="text-[10px] text-white/35">
                                        amends
                                    </p>
                                    <p className="mt-0.5 text-[13px] text-white/70">
                                        ORD-2020-001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Access spectrum */}
                    <section className="border-t border-white/[0.08]">
                        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
                            <h2
                                className="max-w-md text-[1.9rem] text-white"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Access widens or narrows with the role.
                            </h2>

                            <div className="mt-12 space-y-7">
                                {accessLevels.map(({ role, note, reach }) => (
                                    <div
                                        key={role}
                                        className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[160px_1fr]"
                                    >
                                        <span className="text-[14px] font-medium text-white/85">
                                            {role}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <div className="h-[3px] flex-1 rounded-full bg-white/[0.08]">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8FB4FF]"
                                                    style={{
                                                        width: `${reach}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="hidden max-w-[280px] text-[13px] text-white/45 md:block">
                                                {note}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="border-t border-white/[0.08]">
                        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
                            <h2
                                className="max-w-md text-[1.9rem] text-white"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                What the record actually holds.
                            </h2>

                            <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
                                {features.map(
                                    ({ icon: Icon, title, description }) => (
                                        <div
                                            key={title}
                                            className="flex gap-4 border-t border-white/[0.08] pt-5"
                                        >
                                            <Icon className="mt-0.5 size-[18px] shrink-0 text-[#8FB4FF]" />
                                            <div>
                                                <h3 className="text-[14.5px] font-medium text-white/90">
                                                    {title}
                                                </h3>
                                                <p className="mt-1.5 text-[13.5px] leading-6 text-white/50">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Lifecycle ledger */}
                    <section
                        id="lifecycle"
                        className="border-t border-white/[0.08]"
                    >
                        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                                <div>
                                    <h2
                                        className="text-[1.9rem] text-white"
                                        style={{
                                            fontFamily: "'Fraunces', serif",
                                        }}
                                    >
                                        A law's life, end to end.
                                    </h2>
                                    <p className="mt-4 max-w-xs text-[13.5px] leading-6 text-white/45">
                                        From passage to publication, and
                                        whatever comes after — every stage is
                                        dated and kept next to the record.
                                    </p>
                                </div>

                                <ol className="relative border-l border-white/[0.12] pl-8">
                                    {lifecycle.map(({ stage, detail }, i) => (
                                        <li
                                            key={stage}
                                            className={
                                                i < lifecycle.length - 1
                                                    ? 'pb-9'
                                                    : ''
                                            }
                                        >
                                            <span className="absolute -left-[5px] mt-1.5 size-[9px] rounded-full border-2 border-[#070B14] bg-[#8FB4FF]" />
                                            <p className="text-[15px] font-medium text-white/90">
                                                {stage}
                                            </p>
                                            <p className="mt-1 text-[13.5px] leading-6 text-white/45">
                                                {detail}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-8">
                                {statuses.map(({ label, color }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-2 text-[13px] text-white/55"
                                    >
                                        <span
                                            className="size-1.5 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/[0.08]">
                    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-[12px] text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                        <span>Damulog Legislative Information System</span>
                        <span>A public record, kept traceable.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}