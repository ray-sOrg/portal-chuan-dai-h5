import { useEffect, useRef } from "react";

import type { ActionState } from "../utils/to-action-state";

type OnArgs = {
  actionState: ActionState;
};

type Options = {
  onSuccess?: (onArgs: OnArgs) => void;
  onError?: (onArgs: OnArgs) => void;
};

const useActionFeedback = (actionState: ActionState, options: Options) => {
  const prevTimestamp = useRef(actionState.timestamp);

  const isUpdate = actionState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (!isUpdate) return;
    if (actionState.status === "SUCCESS") {
      options?.onSuccess?.({ actionState });
    }
    if (actionState.status === "ERROR") {
      options?.onError?.({ actionState });
    }

    prevTimestamp.current = actionState.timestamp;
  }, [isUpdate, actionState, options]);
};

export { useActionFeedback };
