import { Navigate } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MessageSquarePlus, X } from "lucide-react";
import { api, Dispute } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const STATUS_OPTIONS = ["Pending", "UnderReview", "Resolved", "Rejected"];

export default function AdminDisputesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<{ id: string; email: string }[]>([]);
  const [noteFor, setNoteFor] = useState<Dispute | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (user?.role !== "Admin") return;
    let mounted = true;
    setLoading(true);
    api.get<Dispute[] | { items: Dispute[] }>("/admin/disputes")
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        setItems(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => { if (mounted) setLoading(false); });

    api.get<{ id: string; email: string }[]>("/admin/users?role=Admin")
      .then((res) => { if (mounted) setAdmins(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { /* optional */ });

    return () => { mounted = false; };
  }, [user]);

  if (user && user.role !== "Admin") return <Navigate to="/dashboard" replace />;

  const updateDispute = async (id: string, patch: Partial<Dispute>) => {
    const prev = items;
    setItems((arr) => arr.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    try {
      await api.put(`/admin/disputes/${id}`, patch);
      toast.success("Dispute updated");
    } catch (err) {
      setItems(prev);
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const submitNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!noteFor || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/admin/disputes/${noteFor.id}/notes`, { note: noteText });
      toast.success("Note added");
      setNoteText("");
      setNoteFor(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-warning text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="h-3.5 w-3.5" /> Admin
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">All Disputes</h1>
          <p className="text-muted-foreground mt-1">Manage and assign incoming disputes.</p>
        </div>
      </motion.div>

      <div className="glass rounded-2xl p-5 shadow-soft">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No disputes to review.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
                  <th className="py-3 px-3 font-medium">ID</th>
                  <th className="py-3 px-3 font-medium">User</th>
                  <th className="py-3 px-3 font-medium">Reason</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Assignee</th>
                  <th className="py-3 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d, i) => (
                  <motion.tr key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-smooth align-middle">
                    <td className="py-3 px-3 font-mono text-xs">{d.id.slice(0, 10)}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.userEmail || "—"}</td>
                    <td className="py-3 px-3 max-w-[200px] truncate">{d.reason}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={d.status} />
                        <select value={d.status} onChange={(e) => updateDispute(d.id, { status: e.target.value })} className="bg-surface border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary-light">
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          {!STATUS_OPTIONS.includes(d.status) && <option value={d.status}>{d.status}</option>}
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <select value={d.assignedAdminId || ""} onChange={(e) => updateDispute(d.id, {status: d.status, assignedAdminId: e.target.value || null })} className="bg-surface border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary-light">
                        <option value="">Unassigned</option>
                        {admins.length === 0 && user && <option value={user.id}>{user.email}</option>}
                        {admins.map((a) => <option key={a.id} value={a.id}>{a.email}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => { setNoteFor(d); setNoteText(""); }} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-primary-light/10 hover:text-primary-light transition-smooth">
                        <MessageSquarePlus className="h-3.5 w-3.5" /> Note
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {noteFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setNoteFor(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Add note</h3>
                <button onClick={() => setNoteFor(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Dispute #{noteFor.id.slice(0, 10)}</p>
              <form onSubmit={submitNote} className="space-y-4">
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} required placeholder="Internal note…" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 resize-none" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setNoteFor(null)} className="px-4 py-2 rounded-xl text-sm hover:bg-white/5 transition-smooth">Cancel</button>
                  <button type="submit" disabled={savingNote} className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium shadow-glow hover:opacity-90 disabled:opacity-60 transition-smooth">
                    {savingNote ? "Saving…" : "Add note"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
