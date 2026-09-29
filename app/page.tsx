import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Building, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Building className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">ASHVITA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smarter living. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
              Better connected.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A premium digital platform for residents, community management, and security operations at Mahindra Ashvita Lifespaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Resident Login <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                Explore Admin Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">For Residents</h3>
            <p className="text-slate-600 dark:text-slate-400">Pay maintenance, book amenities, register visitors, and track complaints from one beautiful dashboard.</p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">For Management</h3>
            <p className="text-slate-600 dark:text-slate-400">Complete command center with analytics, unit tracking, payment tracking, and bulk notice publishing.</p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">For Security</h3>
            <p className="text-slate-600 dark:text-slate-400">Lightning fast operational portal to verify pre-registered visitors, scan QR passes, and log entry/exits.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
