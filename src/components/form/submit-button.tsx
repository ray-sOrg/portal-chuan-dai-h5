"use client";

import { Loader2 } from "lucide-react";
import React, { cloneElement } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type Props = {
    label?: string;
    icon?: React.ReactElement<{
        className?: string;
    }>;
    variant?: "default" | "outline" | "ghost" | "destructive" | "link" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
};

const SubmitButton = (props: Props) => {
    const { label, icon, variant = "default", size = "default", className } = props;
    const { pending } = useFormStatus();

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    };

    const sizeStyles = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };

    return (
        <button
            disabled={pending}
            type="submit"
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {pending && (
                <Loader2
                    className={cn("animate-spin h-4 w-4", {
                        "mr-2": !!label,
                    })}
                />
            )}
            {label}
            {pending ? null : icon ? (
                <span
                    className={cn({
                        "ml-2": !!label,
                    })}
                >
                    {cloneElement(icon, {
                        className: "h-4 w-4",
                    })}
                </span>
            ) : null}
        </button>
    );
};

export { SubmitButton };
