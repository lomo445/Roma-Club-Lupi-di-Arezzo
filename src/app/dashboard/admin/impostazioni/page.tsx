"use client";

import { useState, useEffect } from "react";
import { getSettingsAction, updateSettingsAction } from "@/app/actions/settings";
import { Save, Settings } from "lucide-react";

export default function ImpostazioniPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    season: "",
    priceAdult: 0,
    priceReduced: 0,
    priceFamily: 0,
  });

  useEffect(() => {
    async function load() {
      const settings = await getSettingsAction();
      setFormData({
        season: settings.season,
        priceAdult: settings.priceAdult,
        priceReduced: settings.priceReduced,
        priceFamily: settings.priceFamily
      });
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateSettingsAction(formData);
    if (res.success) {
      alert("Impostazioni salvate con successo!");
    } else {
      alert(res.error || "Errore sconosciuto.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 font-bold">Caricamento impostazioni...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
        <Settings className="text-primary" /> Impostazioni Globali del Club
      </h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-800">
        <strong>Nota Bene:</strong> Cambiando questi valori, i form di iscrizione e i prezzi pagati tramite Stripe si aggiorneranno automaticamente per tutti i nuovi soci. Le tessere già acquistate non subiranno modifiche retroattive.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-800 mb-4 border-b pb-2">Stagione Corrente</h3>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Anno Sportivo (es. 2026/2027)</label>
            <input
              type="text"
              required
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full sm:w-1/2 p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-800 mb-4 border-b pb-2">Quote Sociali (€)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Tessera Adulto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceAdult}
                onChange={(e) => setFormData({ ...formData, priceAdult: parseFloat(e.target.value) })}
                className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary font-mono text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Tessera Ridotto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceReduced}
                onChange={(e) => setFormData({ ...formData, priceReduced: parseFloat(e.target.value) })}
                className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary font-mono text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Tessera Familiare</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceFamily}
                onChange={(e) => setFormData({ ...formData, priceFamily: parseFloat(e.target.value) })}
                className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary font-mono text-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? "Salvataggio..." : "Salva Impostazioni"}
        </button>

      </form>
    </div>
  );
}
