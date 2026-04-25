import { motion } from "framer-motion";

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let cls = "bg-white/5 text-muted-foreground ring-white/10";
  if (["approved", "resolved", "completed", "success", "closed"].includes(s)) {
    cls = "bg-success/15 text-success ring-success/30";
  } else if (["pending", "open", "in_review", "in review", "review"].includes(s)) {
    cls = "bg-warning/15 text-warning ring-warning/30";
  } else if (["rejected", "failed", "denied", "cancelled", "canceled"].includes(s)) {
    cls = "bg-danger/15 text-danger ring-danger/30";
  } else if (["assigned", "processing"].includes(s)) {
    cls = "bg-primary-light/15 text-primary-light ring-primary-light/30";
  }
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "—"}
    </motion.span>
  );
}