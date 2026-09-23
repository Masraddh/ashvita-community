"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = (title: string, message?: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
            error: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
          };

          const borders = {
            success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/90",
            error: "border-rose-200 dark:border-rose-900 bg-rose-50/90 dark:bg-rose-950/90",
            warning: "border-amber-200 dark:border-amber-900 bg-amber-50/90 dark:bg-amber-950/90",
            info: "border-sky-200 dark:border-sky-900 bg-sky-50/90 dark:bg-sky-950/90",
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-fade-in gap-3",
                borders[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</h5>
                {t.message && <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.message}</p>}
              </div>
              <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
