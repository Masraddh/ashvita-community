import React from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ashvita | Smart Residential Community Management System",
  description: "A modern digital platform for residents, community management, and security operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
