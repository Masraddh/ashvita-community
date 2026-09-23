import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", isLoading = false, icon, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98]";

    const variants = {
      primary: "bg-indigo-700 text-white hover:bg-indigo-800 shadow-md shadow-indigo-700/20 focus:ring-indigo-600",
      secondary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-md shadow-emerald-700/20 focus:ring-emerald-600",
      accent: "bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-600/20 focus:ring-amber-500",
      outline: "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-indigo-500",
      ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 focus:ring-rose-500",
      success: "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20 focus:ring-teal-500",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon ? <span className="shrink-0">{icon}</span> : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
