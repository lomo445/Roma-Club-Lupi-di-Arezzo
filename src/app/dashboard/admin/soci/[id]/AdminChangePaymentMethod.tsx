"use client";
import { useState } from "react";
import { adminChangePaymentMethodAction } from "@/app/actions/admin";
import { Euro, Loader2 } from "lucide-react";

export function AdminChangePaymentMethod({ subId, currentMethod }: { subId: string, currentMethod: string }) {
  const [loading, setLoading] = useState(false);
  const nextMethod = currentMethod === "Stripe" ? "Contanti" : "Stripe";

  return (
    <button 
      onClick={async () => {
        if (confirm(`Vuoi cambiare il metodo di pagamento da ${currentMethod} a ${nextMethod}? L'utente vedrà la modifica nella sua area personale.`)) {
          setLoading(true);
          const res = await adminChangePaymentMethodAction(subId, nextMethod);
          if (!res.success) alert(res.error);
          setLoading(false);
        }
      }}
      disabled={loading}
      className="mt-2 text-xs font-bold flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded transition"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Euro size={14} />}
      Cambia in {nextMethod}
    </button>
  );
}
