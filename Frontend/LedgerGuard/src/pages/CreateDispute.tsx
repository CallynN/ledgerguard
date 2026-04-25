import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { api, Transaction } from "@/lib/api";

export default function CreateDisputePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetId = searchParams.get("transactionId") || "";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [transactionId, setTransactionId] = useState(presetId);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Transaction[] | { items: Transaction[] }>("/transactions")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        setTransactions(data);
        if (presetId && data.find((t) => t.id === presetId)) setTransactionId(presetId);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingTx(false));
  }, [presetId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!transactionId) return toast.error("Please select a transaction");
    setSubmitting(true);
    try {
      await api.post("/disputes", { transactionId, reason, description });
      toast.success("Dispute submitted");
      navigate("/disputes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-smooth">
        <ArrowLeft className="h-4 w-4" /> Back
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-8 shadow-glow">
        <h1 className="text-2xl font-semibold tracking-tight">File a dispute</h1>
        <p className="text-muted-foreground mt-1 mb-8">Provide details so our team can investigate.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Transaction</label>
            <select value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required disabled={loadingTx} className="w-full bg-surface border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 transition-smooth">
              <option value="">{loadingTx ? "Loading…" : "Select a transaction"}</option>
              {transactions.map((t) => (
                <option key={t.id} value={t.id}>
                  {(t.reference || t.id.slice(0, 8))} — {t.merchant || t.description || "—"} — {t.currency || "$"}{Number(t.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="e.g. Unrecognized charge" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 transition-smooth" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} placeholder="Describe what happened…" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 transition-smooth resize-none" />
          </div>
          <button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium shadow-glow hover:opacity-90 disabled:opacity-60 transition-smooth flex items-center justify-center gap-2">
            {submitting ? <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" /> : <><Send className="h-4 w-4" /> Submit dispute</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
