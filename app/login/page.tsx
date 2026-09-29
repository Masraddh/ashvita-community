"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Building, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result.error) {
      toast("Error", result.error, "danger");
      setIsLoading(false);
    } else if (result.success && result.redirectUrl) {
      toast("Welcome back!", "Successfully signed in to Ashvita.", "success");
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-6 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign In to Ashvita</h2>
          <p className="text-indigo-200 text-sm mt-2">Welcome back to your smart community.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="name@example.com" 
              required
              icon={<Mail className="w-4 h-4" />}
            />
            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required
              icon={<Lock className="w-4 h-4" />}
            />
            
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                Remember me
              </label>
              <Link href="#" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" isLoading={isLoading}>
              Sign In <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
