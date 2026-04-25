import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileWarning, Calendar, PlusCircle } from "lucide-react";
import { api, Dispute } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/Skeleton";
import { toast } from "sonner";

export default function DisputesPage() {
  const [items, setItems] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get<Dispute[] | { items: Dispute[] }>("/disputes")
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        setItems(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Disputes</h1>
          <p className="text-muted-foreground mt-1">Track the status of your filed disputes.</p>
        </div>
        <Link to="/create-dispute" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 font-medium shadow-glow hover:opacity-90 transition-smooth hover:scale-[1.02]">
          <PlusCircle className="h-4 w-4" /> New
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FileWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">No disputes yet</p>
          <p className="text-muted-foreground text-sm mt-1">When you raise one, it'll appear here.</p>
          <Link to="/create-dispute" className="inline-flex mt-6 items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 font-medium shadow-glow hover:opacity-90 transition-smooth">
            <PlusCircle className="h-4 w-4" /> File your first dispute
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} className="glass rounded-2xl p-5 shadow-soft hover:shadow-glow transition-smooth">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{d.reason}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">#{d.id.slice(0, 12)}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{d.description}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {(d.createdAt || d.date) ? new Date(d.createdAt || d.date!).toLocaleString() : "—"}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
