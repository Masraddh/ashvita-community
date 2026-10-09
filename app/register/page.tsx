"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { Building, Lock, Mail, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);
    
    if (result.error) {
      toast("Error", result.error, "error");
      setIsLoading(false);
    } else if (result.success && result.redirectUrl) {
      toast("Welcome!", "Successfully created your Ashvita account.", "success");
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
          <h2 className="text-2xl font-bold tracking-tight">Join Ashvita</h2>
          <p className="text-indigo-200 text-sm mt-2">Create your resident portal account.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input 
              label="Full Name" 
              name="name"
              type="text" 
              placeholder="John Doe" 
              required
              icon={<User className="w-4 h-4" />}
            />
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

            <Button type="submit" className="w-full mt-6" size="lg" isLoading={isLoading}>
              Create Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
