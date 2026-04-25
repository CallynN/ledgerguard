import { ReactNode } from "react";
import { motion } from "framer-motion";

export function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-primary-light/25 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-glow"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
            <span className="font-bold text-xl text-primary-foreground">LG</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}