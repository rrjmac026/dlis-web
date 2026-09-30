import { Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const SESSION_KEY = 'dlis-desktop-tutorial-hidden';

const steps = [
    {
        title: 'Open the Desktop app page',
        description: 'Click "Desktop app" in the left menu, under Downloads.',
        image: '/images/tutorial/step-1.png',
    },
    {
        title: 'Download the installer',
        description: 'Click the blue "Download installer" button.',
        image: '/images/tutorial/step-2.png',
    },
    {
        title: 'Open the downloaded file',
        description:
            'When the download finishes, open the file. You can find it at the bottom or top of your browser, or in your Downloads folder.',
        image: '/images/tutorial/step-3.png',
    },
    {
        title: 'Allow the app and start the installation',
        description:
            'If Windows asks "Do you want to allow this app to make changes to your device?", click Yes. Then click Install in the setup window.',
        image: '/images/tutorial/step-4.png',
    },
    {
        title: 'Sign in',
        description:
            'When the app opens, sign in with the same username and password you use on the website.',
        image: '/images/tutorial/step-5.png',
    },
];

export function DesktopTutorialDialog() {
    const { auth } = usePage().props as unknown as {
        auth: { user: { desktop_tutorial_dismissed_at?: string | null } };
    };

    const [open, setOpen] = useState(() => {
        try {
            return sessionStorage.getItem(SESSION_KEY) !== '1';
        } catch {
            return true;
        }
    });
    const [step, setStep] = useState(0);

    if (auth.user.desktop_tutorial_dismissed_at) {
        return null;
    }

    const current = steps[step];
    const isLast = step === steps.length - 1;

    const remindLater = () => {
        try {
            sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
            // ignore
        }
        setOpen(false);
    };

    const alreadyInstalled = () => {
        setOpen(false);
        router.post('/desktop-app/tutorial/dismiss', {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && remindLater()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        How to install the DLIS desktop app
                    </DialogTitle>
                    <DialogDescription>
                        Step {step + 1} of {steps.length}: {current.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        <img
                            key={current.image}
                            src={current.image}
                            alt={current.title}
                            className="max-h-80 w-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    <p className="text-base">{current.description}</p>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setStep((s) => s - 1)}
                            disabled={step === 0}
                        >
                            <ChevronLeft className="size-4" />
                            Back
                        </Button>

                        {isLast ? (
                            <Button asChild onClick={remindLater}>
                                <Link href="/desktop-app">Go to download page</Link>
                            </Button>
                        ) : (
                            <Button onClick={() => setStep((s) => s + 1)}>
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={remindLater}>
                            Remind me later
                        </Button>
                        <Button variant="secondary" onClick={alreadyInstalled}>
                            I already installed it
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}