"use client";
import { useState } from "react";
import { toggleDirettivoAction } from "@/app/actions/admin";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export function ToggleRoleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const isAdmin = currentRole === "ADMIN";

  return (
    <button 
      onClick={async () => {
        if (confirm(isAdmin ? "Vuoi revocare i permessi di Direttivo a questo socio?" : "Vuoi promuovere questo socio nel Direttivo?")) {
          setLoading(true);
          const res = await toggleDirettivoAction(userId);
          if (!res.success) alert(res.error);
          setLoading(false);
        }
      }}
      disabled={loading}
      className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition disabled:opacity-50 ${isAdmin ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border border-secondary/20'}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : (isAdmin ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />)}
      {isAdmin ? "Rimuovi da Direttivo" : "Promuovi a Direttivo"}
    </button>
  );
}
