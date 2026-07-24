"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { registerUserAction } from "@/app/actions/register";
import { Trash2, UserPlus } from "lucide-react";

const memberSchema = z.object({
  email: z.string().email("Inserire un'email valida"),
  password: z.string().min(6, "Minimo 6 caratteri"),
  nomeCognome: z.string().min(3, "Inserire Nome e Cognome"),
  dataNascita: z.string().min(8, "Inserire Data di Nascita"),
  luogoNascita: z.string().min(2, "Inserire Luogo di Nascita"),
  sesso: z.enum(["Maschio", "Femmina", "Altro"], { message: "Seleziona sesso" }),
  telefono: z.string().min(5, "Inserire Numero di Telefono"),
  tipoTessera: z.enum(["Adulto", "Ridotto", "Familiare"]),
});

const formSchema = z.object({
  members: z.array(memberSchema).min(1, "Devi inserire almeno un iscritto"),
  metodoPagamento: z.enum(["Contanti", "Stripe"]),
  accettazionePrivacy: z.boolean().refine((val) => val === true, "Devi accettare la Privacy Policy per iscriverti"),
  isDirettivo: z.boolean().optional(),
  chiaveSegreta: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export function IscrizioneForm() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [{ tipoTessera: "Adulto", sesso: undefined }],
      metodoPagamento: "Stripe",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const members = watch("members");

  const getTotalPrice = () => {
    let total = 0;
    members.forEach(m => {
      if (m.tipoTessera === "Adulto") total += 65;
      if (m.tipoTessera === "Ridotto") total += 35;
      if (m.tipoTessera === "Familiare") total += 35;
    });
    return total;
  };

  const nextStep = async () => {
    const isValid = await trigger("members");
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await registerUserAction(data);
      if (res.success) {
        if (data.metodoPagamento === "Stripe" && res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          alert("Iscrizione completata con successo! In attesa di approvazione. Ora puoi effettuare il login.");
          window.location.href = "/login";
        }
      } else {
        alert(res.error || "Errore durante l'iscrizione.");
      }
    } catch (e) {
      alert("Errore di connessione.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-primary">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800">Richiesta Tesseramento</h2>
        <span className="text-sm font-semibold bg-zinc-100 text-zinc-500 py-1 px-3 rounded-full">
          Step {step} di 2
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Iscritti */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border border-zinc-200 rounded-xl bg-zinc-50 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-primary">Iscritto #{index + 1}</h3>
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold text-sm"
                      >
                        <Trash2 size={16} /> Rimuovi
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Email (per il login) *</label>
                      <input
                        type="email"
                        {...register(`members.${index}.email`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.email && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.email?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Password *</label>
                      <input
                        type="password"
                        {...register(`members.${index}.password`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.password && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.password?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Nome & Cognome *</label>
                      <input
                        type="text"
                        {...register(`members.${index}.nomeCognome`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.nomeCognome && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.nomeCognome?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Numero di Telefono *</label>
                      <input
                        type="tel"
                        {...register(`members.${index}.telefono`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.telefono && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.telefono?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Data di Nascita *</label>
                      <input
                        type="date"
                        {...register(`members.${index}.dataNascita`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.dataNascita && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.dataNascita?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Luogo di Nascita *</label>
                      <input
                        type="text"
                        {...register(`members.${index}.luogoNascita`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.luogoNascita && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.luogoNascita?.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-zinc-200">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-2">Sesso *</label>
                      <select
                        {...register(`members.${index}.sesso`)}
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                      >
                        <option value="">Seleziona...</option>
                        <option value="Maschio">Maschio</option>
                        <option value="Femmina">Femmina</option>
                        <option value="Altro">Altro / Preferisco non specificare</option>
                      </select>
                      {errors.members?.[index]?.sesso && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.sesso?.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-2">Scegli il tipo di Tessera *</label>
                      <select
                        {...register(`members.${index}.tipoTessera`)}
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-bold"
                      >
                        <option value="Adulto">Adulto - 65 €</option>
                        <option value="Ridotto">Ridotto Minore - 35 €</option>
                        <option value="Familiare">Familiare Aggiunto - 35 €</option>
                      </select>
                      {errors.members?.[index]?.tipoTessera && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.tipoTessera?.message}</p>}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => append({ tipoTessera: "Ridotto" } as any)}
                  className="bg-zinc-100 text-primary hover:bg-zinc-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors border-2 border-primary/20"
                >
                  <UserPlus size={20} /> Aggiungi un Familiare / Minore
                </button>
              </div>

              <div className="pt-6 border-t flex justify-between items-center">
                <div className="text-xl">
                  Totale Carrello: <span className="font-bold text-primary">{getTotalPrice()} €</span>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-primary/90 transition-colors"
                >
                  Avanti
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Pagamento e Privacy */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 mb-6">
                <h3 className="text-lg font-bold text-zinc-800 mb-2">Riepilogo</h3>
                <p className="text-zinc-600 mb-4">Stai iscrivendo <b>{members.length}</b> persone per un totale di <b>{getTotalPrice()} €</b>.</p>
                
                <label className="block text-sm font-bold text-zinc-800 mb-3">Seleziona il metodo di pagamento *</label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${watch("metodoPagamento") === "Stripe" ? "border-primary bg-primary/5" : "border-zinc-200 hover:bg-zinc-50"}`}>
                    <input type="radio" value="Stripe" {...register("metodoPagamento")} className="w-5 h-5 text-primary" />
                    <div className="ml-4">
                      <p className="font-bold">Carta di Credito / PayPal</p>
                      <p className="text-sm text-zinc-500">Paga ora online in modo sicuro.</p>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${watch("metodoPagamento") === "Contanti" ? "border-primary bg-primary/5" : "border-zinc-200 hover:bg-zinc-50"}`}>
                    <input type="radio" value="Contanti" {...register("metodoPagamento")} className="w-5 h-5 text-primary" />
                    <div className="ml-4">
                      <p className="font-bold">Contanti in Sede</p>
                      <p className="text-sm text-zinc-500">Paga di persona alla consegna della tessera.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("isDirettivo")}
                    className="w-5 h-5 text-primary rounded border-zinc-300 focus:ring-primary"
                  />
                  <span className="ml-3 font-bold text-zinc-800">Qualcuno dei tesserati è del Direttivo?</span>
                </label>
                {watch("isDirettivo") && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Chiave Segreta *</label>
                    <input
                      type="password"
                      {...register("chiaveSegreta")}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Inserisci la chiave d'accesso"
                    />
                  </div>
                )}
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-sm text-zinc-600 mt-6">
                <label className="flex items-start">
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

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-zinc-200 text-zinc-800 font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-zinc-300 transition-colors"
                >
                  Indietro
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-lg shadow hover:bg-secondary/90 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? "Invio in corso..." : (watch("metodoPagamento") === "Stripe" ? `Paga ${getTotalPrice()} € con Stripe` : "Conferma Iscrizione")}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>
    </div>
  );
}
