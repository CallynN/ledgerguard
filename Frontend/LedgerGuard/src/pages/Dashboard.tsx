import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, PlusCircle, TrendingUp, Wallet, Activity } from "lucide-react";
import { api, Transaction } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/Skeleton";
import { toast } from "sonner";

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get<Transaction[] | { items: Transaction[] }>("/transactions")
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        setItems(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    items.forEach((t) => t.status && set.add(t.status));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      const matchesSearch = !search ||
        [t.reference, t.description, t.merchant, t.id].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = status === "all" || t.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, status]);

  const totalVolume = items.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const pendingCount = items.filter((t) => /pending|review/i.test(t.status || "")).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Monitor activity and raise disputes.</p>
        </div>
        <Link to="/create-dispute" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 font-medium shadow-glow hover:opacity-90 transition-smooth hover:scale-[1.02]">
          <PlusCircle className="h-4 w-4" /> New dispute
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total transactions", value: items.length, icon: Activity, color: "text-primary-light" },
          { label: "Total volume", value: `$${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: Wallet, color: "text-success" },
          { label: "Needs attention", value: pendingCount, icon: TrendingUp, color: "text-warning" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }} className="glass rounded-2xl p-5 shadow-soft hover:shadow-glow transition-smooth">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div className="mt-3 text-2xl font-semibold">{loading ? "…" : c.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference, merchant, ID…" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 transition-smooth" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-surface border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-light">
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : pageItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No transactions match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
                  <th className="py-3 px-3 font-medium">Reference</th>
                  <th className="py-3 px-3 font-medium">Merchant</th>
                  <th className="py-3 px-3 font-medium">Date</th>
                  <th className="py-3 px-3 font-medium text-right">Amount</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-smooth">
                    <td className="py-3 px-3 font-mono text-xs">{t.reference || t.id.slice(0, 8)}</td>
                    <td className="py-3 px-3">{t.merchant || t.description || "—"}</td>
                    <td className="py-3 px-3 text-muted-foreground">{t.date || t.createdAt ? new Date(t.date || t.createdAt!).toLocaleDateString() : "—"}</td>
                    <td className="py-3 px-3 text-right font-medium">{t.currency || "$"}{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                    <td className="py-3 px-3 text-right">
                      <Link to={`/create-dispute?transactionId=${t.id}`} className="text-xs text-primary-light hover:text-primary-foreground hover:underline">Dispute</Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
            <span className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-smooth"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-smooth"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
