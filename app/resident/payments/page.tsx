"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Download, CheckCircle2, Clock, AlertTriangle, Inbox } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { getResidentBills, processDemoPayment } from "@/app/actions/payments";
import { format } from "date-fns";

export default function PaymentsPage() {
  const { toast } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setIsLoading(true);
    const data = await getResidentBills();
    if (data) setBills(data);
    setIsLoading(false);
  };

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBill) return;
    
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    const method = formData.get("method") as string || "UPI";

    const result = await processDemoPayment(selectedBill.id, selectedBill.totalAmount, method);
    
    setIsProcessing(false);
    
    if (result.error) {
      toast("Payment Failed", result.error, "danger");
    } else if (result.success) {
      setPayModalOpen(false);
      toast("Payment Successful!", `₹${selectedBill.totalAmount} paid successfully. TXN: ${result.transactionId}`, "success");
      fetchBills(); // Refresh bills
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
      PAID: { variant: "success", label: "Paid" },
      PENDING: { variant: "warning", label: "Pending" },
      OVERDUE: { variant: "danger", label: "Overdue" },
    };
    const s = map[status] || { variant: "warning" as const, label: status };
    return <Badge variant={s.variant} dot>{s.label}</Badge>;
  };

  // KPI Calculations
  const totalOutstanding = bills.filter(b => b.status !== "PAID").reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills.filter(b => b.status === "PAID").reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingCount = bills.filter(b => b.status !== "PAID").length;
  const nextDueDate = bills.find(b => b.status !== "PAID")?.dueDate;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your maintenance bills and payment history.</p>
        </div>
        {pendingCount > 0 && (
          <Button icon={<CreditCard className="w-4 h-4" />} onClick={() => {
            setSelectedBill(bills.find(b => b.status !== "PAID"));
            setPayModalOpen(true);
          }}>
            Pay Current Bill
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Due" value={formatCurrency(totalOutstanding)} subtitle={nextDueDate ? `Due ${format(new Date(nextDueDate), "dd MMM yyyy")}` : "All clear"} icon={<Clock className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Paid This Year" value={formatCurrency(totalPaid)} subtitle={`${bills.filter(b => b.status === "PAID").length} payments`} icon={<CheckCircle2 className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Outstanding" value={formatCurrency(totalOutstanding)} subtitle={`${pendingCount} pending bill(s)`} icon={<AlertTriangle className="w-6 h-6" />} iconBgColor={pendingCount > 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" : "bg-slate-100 text-slate-500"} />
        <StatCard title="Next Due Date" value={nextDueDate ? format(new Date(nextDueDate), "dd MMM") : "—"} subtitle="Estimated" icon={<CreditCard className="w-6 h-6" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" />
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Billing Month</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Loading bills...</td></tr>
                ) : bills.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500"><div className="flex flex-col items-center"><Inbox className="w-8 h-8 mb-2 opacity-20" /> No payment history yet</div></td></tr>
                ) : (
                  bills.map((bill) => {
                    const payment = bill.payments?.[0];
                    return (
                      <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{bill.billingPeriod}</td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(bill.totalAmount)}</td>
                        <td className="px-5 py-4 text-slate-500">{format(new Date(bill.dueDate), "dd MMM yyyy")}</td>
                        <td className="px-5 py-4">{statusBadge(bill.status)}</td>
                        <td className="px-5 py-4 text-slate-500 font-mono text-xs">{payment?.transactionId || "—"}</td>
                        <td className="px-5 py-4">
                          {bill.status === "PAID" ? (
                            <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-1" /> Receipt</Button>
                          ) : (
                            <Button size="sm" onClick={() => { setSelectedBill(bill); setPayModalOpen(true); }}>Pay Now</Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={payModalOpen} onClose={() => { setPayModalOpen(false); setSelectedBill(null); }} title="Pay Maintenance Bill" description={selectedBill ? `${selectedBill.billingPeriod}` : ""}>
        {selectedBill && (
          <form className="space-y-6" onSubmit={handlePay}>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Maintenance Amount</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(selectedBill.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Late Fee</span>
                <span className="text-sm font-medium text-emerald-600">{formatCurrency(selectedBill.lateFee)}</span>
              </div>
              <div className="border-t border-indigo-200 dark:border-indigo-800 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Payable</span>
                <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(selectedBill.totalAmount)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Payment Method</p>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-800 cursor-pointer">
                <input type="radio" name="method" value="UPI" defaultChecked className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">UPI / PhonePe / GPay</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input type="radio" name="method" value="NET_BANKING" className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Net Banking</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input type="radio" name="method" value="CARD" className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Debit / Credit Card</span>
              </label>
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isProcessing}>
              Pay {formatCurrency(selectedBill.totalAmount)} (Demo)
            </Button>
            <p className="text-[10px] text-center text-slate-400">Secured by 256-bit encryption. We never store your card details.</p>
          </form>
        )}
      </Modal>
    </div>
  );
}
