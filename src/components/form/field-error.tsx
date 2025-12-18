import type { ActionState } from "./utils/to-action-state";

type Props = {
    actionState: ActionState;
    name: string;
};

const FieldError = ({ actionState, name }: Props) => {
    const message = actionState.fieldError?.[name]?.[0];

    if (!message) return null;

    return <span className="text-sm text-destructive">{message}</span>;
};

export { FieldError };
