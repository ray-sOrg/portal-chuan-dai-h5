"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { cn } from "@/lib/utils";

import { sendOtp } from "../actions/send-otp";

type Props = {
    phone: string;
    type?: "register" | "login";
    className?: string;
};

export function OtpInput({ phone, type = "login", className }: Props) {
    const [countdown, setCountdown] = useState(0);
    const [actionState, action] = useActionState(sendOtp, EMPTY_ACTION_STATE);
    const prevTimestampRef = useRef(actionState.timestamp);

    // 倒计时逻辑
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // 发送成功后开始倒计时（使用 ref 避免 effect 内直接 setState）
    useEffect(() => {
        if (actionState.status === "SUCCESS" && actionState.timestamp !== prevTimestampRef.current) {
            prevTimestampRef.current = actionState.timestamp;
            // 使用 setTimeout 避免同步 setState
            setTimeout(() => setCountdown(60), 0);
        }
    }, [actionState.timestamp, actionState.status]);

    const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);
    const isDisabled = !isPhoneValid || countdown > 0;

    return (
        <form action={action} className={cn("flex gap-2", className)}>
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="type" value={type} />
            <input
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="请输入验证码"
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
                type="submit"
                disabled={isDisabled}
                className={cn(
                    "h-10 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    isDisabled
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
            >
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </button>
        </form>
    );
}

// 独立的验证码发送按钮（用于表单内，不嵌套 form）
export function OtpButton({ phone, type = "login" }: { phone: string; type?: "register" | "login" }) {
    const [countdown, setCountdown] = useState(0);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);
    const isDisabled = !isPhoneValid || countdown > 0 || isPending;

    const handleClick = async () => {
        if (isDisabled) return;

        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("phone", phone);
            formData.append("type", type);
            const result = await sendOtp(EMPTY_ACTION_STATE, formData);
            if (result.status === "SUCCESS") {
                setCountdown(60);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={cn(
                "h-10 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                isDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
            )}
        >
            {countdown > 0 ? `${countdown}s` : isPending ? "发送中..." : "获取验证码"}
        </button>
    );
}
