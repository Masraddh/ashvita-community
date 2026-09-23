import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({ className, variant = "primary", size = "sm", dot = false, children, ...props }: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const variants = {
    primary: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50",
    secondary: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50",
    success: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50",
    info: "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50",
    outline: "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 bg-transparent",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-1.5 font-semibold",
  };

  const dotColors = {
    primary: "bg-indigo-600 dark:bg-indigo-400",
    secondary: "bg-emerald-600 dark:bg-emerald-400",
    success: "bg-teal-600 dark:bg-teal-400",
    warning: "bg-amber-600 dark:bg-amber-400",
    danger: "bg-rose-600 dark:bg-rose-400",
    info: "bg-sky-600 dark:bg-sky-400",
    neutral: "bg-slate-500 dark:bg-slate-400",
    outline: "bg-slate-500 dark:bg-slate-400",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
}
