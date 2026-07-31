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

const isSensitiveField = (name: string) => {
  const normalizedName = name.toLowerCase();

  return (
    normalizedName.includes("password") ||
    normalizedName === "code" ||
    normalizedName.includes("otp") ||
    normalizedName.includes("token")
  );
};

export const sanitizeActionPayload = (formData?: FormData) => {
  if (!formData) {
    return undefined;
  }

  const sanitized = new FormData();
  for (const [name, value] of formData.entries()) {
    if (!isSensitiveField(name)) {
      sanitized.append(name, value);
    }
  }

  return sanitized;
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
      payload: sanitizeActionPayload(formData),
      timestamp: Date.now(),
    };
  }

  // case2, prisma error
  if (error instanceof Error) {
    console.error("Form action failed", error);

    return {
      status: "ERROR",
      message: "操作失败，请稍后重试",
      payload: sanitizeActionPayload(formData),
      fieldError: {},
      timestamp: Date.now(),
    };
  }

  // case3, unknown error
  console.error("Form action failed with a non-Error value", error);

  return {
    status: "ERROR",
    message: "错误: 发生了意外错误",
    payload: sanitizeActionPayload(formData),
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
    payload: sanitizeActionPayload(formData),
    timestamp: Date.now(),
  };
};
