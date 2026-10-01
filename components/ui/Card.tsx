import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass" | "gradient";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const base =
    "relative rounded-[1.35rem] overflow-hidden transition-all duration-300";

  const variants = {
    default:
      "bg-white dark:bg-slate-900/95 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.09)] hover:-translate-y-[1px]",

    bordered:
      "bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-indigo-900/60 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800",

    glass:
      "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)]",

    gradient:
      "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border border-indigo-800/50 shadow-[0_20px_50px_rgba(30,27,75,0.25)]",
  };

  return (
    <div
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-6 py-5 border-b border-slate-100/80 dark:border-slate-800/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[15px] font-bold tracking-tight text-slate-900 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-100/80 bg-slate-50/40 px-6 py-4 dark:border-slate-800/70 dark:bg-slate-950/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative p-5",
        className
      )}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/10" />

      <div className="relative flex items-start justify-between gap-4">

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-[1.7rem] font-black tracking-tight text-slate-900 dark:text-slate-50">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
              <span
                className={
                  trend.isPositive
                    ? "rounded-md bg-emerald-50 px-2 py-1 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "rounded-md bg-rose-50 px-2 py-1 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                }
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>

              <span className="text-[10px] font-normal text-slate-400">
                vs last month
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-1",
            iconBgColor
          )}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent dark:via-indigo-800/50" />
    </Card>
  );
}