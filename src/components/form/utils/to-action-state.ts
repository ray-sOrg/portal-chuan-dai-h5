import { z } from "zod";

export type ActionState = {
  timestamp: number;
  message: string;
  fieldError: Record<string, string[] | undefined>;
  status?: "SUCCESS" | "ERROR";
  payload?: FormData;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldError: {},
  timestamp: Date.now(),
};

export const formErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  // case1，zod error
  if (error instanceof z.ZodError) {
    return {
      message: "",
      status: "ERROR",
      fieldError: error.flatten().fieldErrors as Record<string, string[] | undefined>,
      payload: formData,
      timestamp: Date.now(),
    };
  }

  // case2, prisma error
  if (error instanceof Error) {
    return {
      status: "ERROR",
      message: "错误: " + error.message,
      payload: formData,
      fieldError: {},
      timestamp: Date.now(),
    };
  }

  // case3, unknown error
  return {
    status: "ERROR",
    message: "错误: 发生了意外错误",
    payload: formData,
    fieldError: {},
    timestamp: Date.now(),
  };
};

export const toActionState = (
  status: ActionState["status"],
  message: string,
  formData?: FormData
): ActionState => {
  return {
    status,
    message,
    fieldError: {},
    payload: formData,
    timestamp: Date.now(),
  };
};
