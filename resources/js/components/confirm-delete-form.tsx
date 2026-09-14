import { Form } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
    /** The delete route, e.g. `${basePath}/${report.id}` */
    action: string;
    /** Dialog heading, e.g. "Delete this committee report?" */
    title: string;
    /** Supporting text, e.g. `This will permanently delete "${report.report_number}". This cannot be undone.` */
    description: string;
    /**
     * The element that opens the dialog when clicked — usually your
     * existing icon Button. Rendered as-is via asChild, so it keeps
     * whatever variant/size/title it already has.
     */
    trigger: ReactNode;
    /** Label for the destructive confirm button. Defaults to "Delete". */
    confirmLabel?: string;
};

/**
 * Drop-in replacement for the window.confirm() + onSubmit-preventDefault
 * pattern used across index/show pages. Wraps Inertia's <Form> in a
 * shadcn AlertDialog so the confirmation is a real, styled modal instead
 * of the browser's native confirm() popup — and it's the same component
 * everywhere, so Encoder and Admin pages (and any future ones) look and
 * behave identically.
 *
 * Usage (replaces a <Form method="delete" onSubmit={...}><Button.../></Form> block):
 *
 *   <ConfirmDeleteForm
 *       action={`${basePath}/${report.id}`}
 *       title="Delete this committee report?"
 *       description={`This will permanently delete "${report.report_number}". This cannot be undone.`}
 *       trigger={
 *           <Button variant="destructive" size="icon" title="Delete">
 *               <Trash2 />
 *           </Button>
 *       }
 *   />
 */
export default function ConfirmDeleteForm({
    action,
    title,
    description,
    trigger,
    confirmLabel = 'Delete',
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form action={action} method="delete">
                    {({ processing }) => (
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Deleting...'
                                        : confirmLabel}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    )}
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}