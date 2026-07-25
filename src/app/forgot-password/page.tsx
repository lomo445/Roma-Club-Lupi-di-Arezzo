"use client";

import { useState } from "react";
import { requestPasswordResetAction } from "@/app/actions/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await requestPasswordResetAction(email);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Errore sconosciuto.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-primary relative">
        <Link href="/login" className="absolute top-4 left-4 text-zinc-400 hover:text-primary transition">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-zinc-800">Password Dimenticata</h1>
          <p className="text-zinc-500 mt-2 text-sm">Inserisci la tua email e ti invieremo un link per reimpostare la tua password.</p>
        </div>

        {success ? (
          <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl text-center">
            <p className="font-bold">Email inviata!</p>
            <p className="text-sm mt-1">Se l'indirizzo esiste nel nostro database, riceverai a breve un link per ripristinare la password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Email Registrata</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="mario.rossi@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Invio in corso..." : "Invia Link di Recupero"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
