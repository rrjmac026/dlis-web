import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(at_top_left,_#0D1526_0%,_#0F1B30_40%,_#070B14_70%,_#060A12_100%)] p-6">
            <Head title="Log in" />

            <div
                className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[60px]"
                style={{
                    background:
                        'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 70%)',
                }}
            />
            <div
                className="pointer-events-none absolute -right-24 -bottom-24 h-[400px] w-[400px] rounded-full blur-[50px]"
                style={{
                    background:
                        'radial-gradient(circle, rgba(200,144,42,0.25) 0%, rgba(200,144,42,0) 70%)',
                }}
            />
            <div
                className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-y-1/2 translate-x-[100px] rounded-full blur-[40px]"
                style={{
                    background:
                        'radial-gradient(circle, rgba(139,32,32,0.19) 0%, rgba(139,32,32,0) 70%)',
                }}
            />

            <div className="relative w-full max-w-[420px] rounded-3xl border border-white/[0.13] bg-white/[0.07] px-10 py-9 shadow-[0_0_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <div className="mb-4 flex flex-col items-center">
                    <div className="mb-4 flex h-[110px] w-[110px] items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.09]">
                        <img
                            src="/assets/icons/logo.png"
                            alt="Logo"
                            className="h-[70px] w-[70px] object-contain"
                        />
                    </div>
                    <h1 className="mb-1 text-2xl font-bold text-white">
                        DLIS
                    </h1>
                    <p className="mb-5 max-w-[280px] text-center text-xs text-white/50">
                        Damulog Legislative Information System
                    </p>

                    <div className="mb-7 flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.07] px-3 py-1.5">
                        <span className="h-[7px] w-[7px] rounded-full bg-emerald-400" />
                        <span className="text-[11px] text-white/50">
                            System online — Secure portal
                        </span>
                    </div>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {status && (
                                <div className="rounded-[10px] border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-center text-sm font-medium text-emerald-400">
                                    {status}
                                </div>
                            )}

                            {(errors.username || errors.password) && (
                                <div className="rounded-[10px] border border-red-500/25 bg-red-500/[0.15] px-3 py-2.5">
                                    <p className="text-sm text-red-300">
                                        ⚠ {errors.username ?? errors.password}
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="username"
                                        className="text-[11px] font-semibold tracking-wide text-white/60 uppercase"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="Enter your username"
                                        className="h-11 rounded-xl border border-white/[0.13] bg-white/[0.07] px-3.5 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:bg-white/10 focus-visible:ring-blue-500/30"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-[11px] font-semibold tracking-wide text-white/60 uppercase"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm text-white/60 hover:text-white"
                                                tabIndex={5}
                                            >
                                                Forgot your password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="h-11 rounded-xl border border-white/[0.13] bg-white/[0.07] px-3.5 text-white placeholder:text-white/30 focus-visible:border-blue-500/50 focus-visible:bg-white/10 focus-visible:ring-blue-500/30"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-white/70"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                    className="h-[46px] w-full rounded-xl border-0 bg-gradient-to-r from-blue-700 to-blue-500 font-semibold text-white shadow-none transition-opacity hover:opacity-90 hover:from-blue-700 hover:to-blue-500"
                                >
                                    {processing && <Spinner />}
                                    Sign in →
                                </Button>
                            </div>

                            <div className="text-center text-sm text-white/50">
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="text-white/80 hover:text-white"
                                >
                                    Sign up
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>

                <p className="mt-5 text-center text-[11px] text-white/20">
                    © 2026 LGU Damulog, Bukidnon — All rights reserved
                </p>
            </div>
        </div>
    );
}

// Layout for this page is resolved centrally in app.tsx by page path
// (see the `name.startsWith('auth/')` case) — a `.layout` static property
// here is ignored by this app's createInertiaApp setup, so it's omitted.