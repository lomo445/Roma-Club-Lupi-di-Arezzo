"use client";

import { useState, useEffect } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-4 border-red-500">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-zinc-800">Token Mancante</h2>
          <p className="text-zinc-500 mt-2 mb-6">Il link che hai utilizzato non è valido o è incompleto.</p>
          <Link href="/login" className="text-primary font-bold hover:underline">Torna al Login</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }
    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await resetPasswordAction(token, password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(res.error || "Errore sconosciuto.");
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-4 border-green-500">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-zinc-800">Password Aggiornata!</h2>
          <p className="text-zinc-500 mt-2 mb-6">La tua password è stata modificata con successo. Stai per essere reindirizzato al login...</p>
          <Link href="/login" className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition">Vai al Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-primary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Nuova Password</h1>
          <p className="text-zinc-500 mt-2 text-sm">Inserisci la tua nuova password qui sotto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Nuova Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Conferma Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Salvataggio..." : "Salva Nuova Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center">Caricamento in corso...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
