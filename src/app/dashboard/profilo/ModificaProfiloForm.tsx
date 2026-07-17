"use client";

import { useState } from "react";
import { updateProfileAction } from "@/app/actions/updateProfile";
import { useRouter } from "next/navigation";

export function ModificaProfiloForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await updateProfileAction(user.id, data);
    
    setLoading(false);
    if (res.success) {
      alert("Dati aggiornati con successo!");
      router.refresh();
      router.push("/dashboard");
    } else {
      alert(res.error || "Errore durante il salvataggio.");
    }
  };

  const formattedDate = user.birthDate 
    ? new Date(user.birthDate).toISOString().split("T")[0] 
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1">Nome</label>
          <input name="nome" type="text" defaultValue={user.name} required className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1">Cognome</label>
          <input name="cognome" type="text" defaultValue={user.surname} required className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1">Data di Nascita</label>
          <input name="dataNascita" type="date" defaultValue={formattedDate} required className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-700 mb-1">Luogo di Nascita</label>
          <input name="luogoNascita" type="text" defaultValue={user.birthPlace || ""} required className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-1">Telefono</label>
        <input name="telefono" type="text" defaultValue={user.phone || ""} required className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
      </div>

      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-1">Email (Non modificabile)</label>
        <input type="text" defaultValue={user.email} disabled className="w-full px-4 py-2 border border-zinc-200 bg-zinc-100 rounded-lg text-zinc-500 cursor-not-allowed" />
      </div>

      <div className="pt-4 border-t border-zinc-100 flex justify-end">
        <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-primary/90 transition-colors disabled:opacity-50">
          {loading ? "Salvataggio in corso..." : "Salva Modifiche"}
        </button>
      </div>
    </form>
  );
}
