import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass" | "gradient";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const base = "rounded-2xl transition-all duration-200 overflow-hidden";
  const variants = {
    default: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md",
    bordered: "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800",
    glass: "glass-panel shadow-sm",
    gradient: "bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/50",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-slate-500 dark:text-slate-400 mt-0.5", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between", className)} {...props}>{children}</div>;
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

export function StatCard({ title, value, subtitle, trend, icon, iconBgColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-400", className }: StatCardProps) {
  return (
    <Card className={cn("relative p-5 transition-transform hover:-translate-y-0.5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              <span className={trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-2xl shrink-0 flex items-center justify-center shadow-xs", iconBgColor)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
