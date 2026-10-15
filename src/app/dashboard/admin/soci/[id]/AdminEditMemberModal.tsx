"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateMemberDataAction } from "@/app/actions/admin";
import { Pencil, X, Loader2, Save, User } from "lucide-react";

interface AdminEditMemberModalProps {
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string | null;
    birthDate: string; // Formattato come GG/MM/AAAA
    birthPlace: string | null;
    gender: string | null;
    memberNumber: number | null;
  };
  variant?: "button" | "header";
  initialOpen?: boolean;
}

export function AdminEditMemberModal({ user, variant = "header", initialOpen = false }: AdminEditMemberModalProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    phone: user.phone || "",
    birthDate: user.birthDate || "",
    birthPlace: user.birthPlace || "",
    gender: user.gender || "",
    memberNumber: user.memberNumber !== null && user.memberNumber !== undefined ? String(user.memberNumber) : "",
  });

  const handleOpen = () => {
    setFormData({
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      phone: user.phone || "",
      birthDate: user.birthDate || "",
      birthPlace: user.birthPlace || "",
      gender: user.gender || "",
      memberNumber: user.memberNumber !== null && user.memberNumber !== undefined ? String(user.memberNumber) : "",
    });
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedMemberNumber = formData.memberNumber.trim() !== "" 
        ? parseInt(formData.memberNumber.trim(), 10) 
        : null;

      if (formData.memberNumber.trim() !== "" && (isNaN(parsedMemberNumber!) || parsedMemberNumber! <= 0)) {
        setError("Il numero di tessera deve essere un numero valido maggiore di zero.");
        setLoading(false);
        return;
      }

      const res = await adminUpdateMemberDataAction(user.id, {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        memberNumber: parsedMemberNumber,
      });

      if (!res.success) {
        setError(res.error || "Si è verificato un errore durante il salvataggio.");
        setLoading(false);
        return;
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Errore imprevisto durante il salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {variant === "header" ? (
        <button
          onClick={handleOpen}
          type="button"
          className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          title="Modifica Dati Anagrafici"
        >
          <Pencil size={14} />
          Modifica Dati
        </button>
      ) : (
        <button
          onClick={handleOpen}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold transition bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Pencil size={16} />
          Modifica Dati Anagrafici
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border-t-4 border-primary max-w-xl w-full p-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Modifica Dati Socio</h3>
                  <p className="text-xs text-zinc-500">Aggiorna le informazioni anagrafiche e i recapiti</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error box */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Mario"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Rossi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="mario.rossi@email.it"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="333 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Data di Nascita
                  </label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono"
                    placeholder="GG/MM/AAAA"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Formato: GG/MM/AAAA (es. 15/04/1985)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Luogo di Nascita
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Arezzo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Sesso
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Non specificato</option>
                    <option value="Maschio">Maschio</option>
                    <option value="Femmina">Femmina</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    N° Tessera
                  </label>
                  <input
                    type="number"
                    min="2"
                    value={formData.memberNumber}
                    onChange={(e) => setFormData({ ...formData, memberNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono"
                    placeholder="Es. 7"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">N° 1 riservato alla memoria del Club</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition shadow disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salva Modifiche
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
