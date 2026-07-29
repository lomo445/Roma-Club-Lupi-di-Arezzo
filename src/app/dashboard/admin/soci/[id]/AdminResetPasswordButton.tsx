"use client";
import { useState } from "react";
import { adminResetPasswordAction } from "@/app/actions/admin";
import { KeyRound, Loader2 } from "lucide-react";

export function AdminResetPasswordButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      onClick={async () => {
        const newPassword = window.prompt("Inserisci la nuova password per l'utente (minimo 6 caratteri):");
        if (newPassword !== null) {
          if (newPassword.length < 6) {
            alert("La password deve contenere almeno 6 caratteri.");
            return;
          }
          if (confirm(`Sei sicuro di voler cambiare la password? L'utente non potrà più accedere con quella vecchia.`)) {
            setLoading(true);
            const res = await adminResetPasswordAction(userId, newPassword);
            if (res.success) {
              alert("Password aggiornata con successo.");
            } else {
              alert(res.error);
            }
            setLoading(false);
          }
        }
      }}
      disabled={loading}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition disabled:opacity-50 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
      Forza Reset Password
    </button>
  );
}
