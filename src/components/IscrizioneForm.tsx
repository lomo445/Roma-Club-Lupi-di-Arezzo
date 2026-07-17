"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { registerUserAction } from "@/app/actions/register";

const formSchema = z.object({
  email: z.string().email("Inserire un'email valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  nomeCognome: z.string().min(3, "Inserire Nome e Cognome"),
  dataNascita: z.string().min(8, "Inserire Data di Nascita"),
  luogoNascita: z.string().min(2, "Inserire Luogo di Nascita"),
  sesso: z.enum(["Maschio", "Femmina", "Altro"], { message: "Selezionare il sesso" }),
  telefono: z.string().min(5, "Inserire Numero di Telefono"),
  tipoTessera: z.enum(["Adulto", "Ridotto", "Familiare"]),
  metodoPagamento: z.enum(["Contanti", "Stripe"]),
  accettazionePrivacy: z.boolean().refine((val) => val === true, {
    message: "Devi accettare l'informativa",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function IscrizioneForm() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoTessera: "Adulto",
      metodoPagamento: "Stripe",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ["email", "nomeCognome", "dataNascita", "luogoNascita", "telefono"];
    } else if (step === 2) {
      fieldsToValidate = ["tipoTessera", "metodoPagamento"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await registerUserAction(data);
      if (res.success) {
        alert("Iscrizione completata con successo! Ora puoi effettuare il login.");
        window.location.href = "/login";
      } else {
        alert(res.error || "Errore durante l'iscrizione.");
      }
    } catch (e) {
      alert("Errore di connessione.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-primary">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800">Richiesta Tesseramento</h2>
        <span className="text-sm font-semibold bg-zinc-100 text-zinc-500 py-1 px-3 rounded-full">
          Step {step} di 3
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Anagrafica */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  placeholder="mario.rossi@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Crea una Password *</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  placeholder="La tua password per accedere all'area riservata"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nome & Cognome *</label>
                <input
                  type="text"
                  {...register("nomeCognome")}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  placeholder="Mario Rossi"
                />
                {errors.nomeCognome && <p className="text-red-500 text-sm mt-1">{errors.nomeCognome.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Data di Nascita *</label>
                  <input
                    type="date"
                    {...register("dataNascita")}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  />
                  {errors.dataNascita && <p className="text-red-500 text-sm mt-1">{errors.dataNascita.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Luogo di Nascita *</label>
                  <input
                    type="text"
                    {...register("luogoNascita")}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    placeholder="Roma"
                  />
                  {errors.luogoNascita && <p className="text-red-500 text-sm mt-1">{errors.luogoNascita.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Numero di Telefono *</label>
                <input
                  type="tel"
                  {...register("telefono")}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  placeholder="+39 333 1234567"
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-primary/90 transition-colors"
                >
                  Avanti
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Tessera e Pagamento */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1">Sesso *</label>
                <select
                  {...register("sesso")}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="">Seleziona...</option>
                  <option value="Maschio">Maschio</option>
                  <option value="Femmina">Femmina</option>
                  <option value="Altro">Altro / Preferisco non specificare</option>
                </select>
                {errors.sesso && <p className="text-red-500 text-sm mt-1">{errors.sesso.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">Scegli il tipo di Tessera *</label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="radio" value="Adulto" {...register("tipoTessera")} className="w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium">Adulto - 65 €</span>
                  </label>
                  <label className="flex items-center p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="radio" value="Ridotto" {...register("tipoTessera")} className="w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium">Ridotto Minore - 35 €</span>
                  </label>
                  <label className="flex items-center p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="radio" value="Familiare" {...register("tipoTessera")} className="w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium">Familiare aggiunto - 35 €</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">Seleziona il metodo di pagamento *</label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="radio" value="Stripe" {...register("metodoPagamento")} className="w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium">Carta di Credito / PayPal (Online)</span>
                  </label>
                  <label className="flex items-center p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                    <input type="radio" value="Contanti" {...register("metodoPagamento")} className="w-5 h-5 text-primary" />
                    <span className="ml-3 font-medium">Contanti (In sede)</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-zinc-200 text-zinc-800 font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-zinc-300 transition-colors"
                >
                  Indietro
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-primary/90 transition-colors"
                >
                  Avanti
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Privacy e Conferma */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 max-h-64 overflow-y-auto text-sm text-zinc-600">
                <h4 className="font-bold text-zinc-800 mb-2">Termini d'Uso e Informativa Interna</h4>
                <p className="mb-2">1. Finalità dei sistemi digitali: migliorare l'efficienza nella gestione delle attività associative, incentivare la partecipazione, semplificare le comunicazioni.</p>
                <p className="mb-2">2. Tipologia di dati raccolti: Nome, email, telefono, data di nascita, presenze. I dati non vengono ceduti a terzi.</p>
                <p className="mb-2">3. Sicurezza: I dati sono custoditi in ambienti protetti. Non vengono pubblicati o condivisi.</p>
                <p>4. Validità: Il presente documento è valido per l'intera stagione sportiva in corso.</p>
                
                <label className="flex items-start mt-4">
                  <input
                    type="checkbox"
                    {...register("accettazionePrivacy")}
                    className="mt-1 w-5 h-5 text-primary rounded border-zinc-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-zinc-700">
                    Dichiaro di aver letto e accettato la <a href="/privacy" target="_blank" className="text-primary hover:underline font-bold">Privacy Policy</a> per il trattamento dei dati personali ai fini del tesseramento.*
                  </span>
                </label>
                {errors.accettazionePrivacy && <p className="text-red-500 text-sm mt-1">{errors.accettazionePrivacy.message}</p>}
              </div>

              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-zinc-200 text-zinc-800 font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-zinc-300 transition-colors"
                >
                  Indietro
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary text-secondary-foreground font-bold py-2 px-8 rounded-lg shadow hover:bg-secondary/90 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? "Invio in corso..." : "Conferma Iscrizione"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>
    </div>
  );
}
