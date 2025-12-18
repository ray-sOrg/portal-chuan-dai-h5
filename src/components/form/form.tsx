"use client";

import { toast } from "sonner";

import { useActionFeedback } from "./hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type Props = {
    action: (payload: FormData) => void;
    children: React.ReactNode;
    actionState: ActionState;
    className?: string;
    onSuccess?: (actionState: ActionState) => void;
    onError?: (actionState: ActionState) => void;
};

const Form = ({
    action,
    className,
    actionState,
    onSuccess,
    onError,
    children,
}: Props) => {
    useActionFeedback(actionState, {
        onSuccess: ({ actionState }) => {
            if (actionState.message) {
                toast.success(actionState.message);
                onSuccess?.(actionState);
            }
        },
        onError: ({ actionState }) => {
            if (actionState.message) {
                toast.error(actionState.message);
                onError?.(actionState);
            }
        },
    });

    return (
        <form action={action} className={className}>
            {children}
        </form>
    );
};

export { Form };
