"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { registerUserAction } from "@/app/actions/register";
import { verifyAdultAction } from "@/app/actions/verifyAdult";
import { Trash2, UserPlus, User, Loader2, HelpCircle } from "lucide-react";

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="relative group inline-flex items-center ml-2 cursor-help">
    <HelpCircle size={16} className="text-zinc-400 group-hover:text-primary transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 sm:w-64 p-3 bg-zinc-800 text-white text-xs rounded-lg shadow-xl z-50 text-center font-normal pointer-events-none leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
    </div>
  </div>
);

const memberSchema = z.object({
  email: z.string().email("Inserire un'email valida"),
  password: z.string().min(6, "Minimo 6 caratteri"),
  nomeCognome: z.string().min(3, "Inserire Nome e Cognome"),
  dataNascita: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[012])[\/\-](19|20)\d\d$/, "Usa il formato GG/MM/AAAA (es. 15/08/1975)"),
  luogoNascita: z.string().min(2, "Inserire Luogo di Nascita"),
  sesso: z.enum(["Maschio", "Femmina", "Altro"], { message: "Seleziona sesso" }),
  telefono: z.string().min(5, "Inserire Numero di Telefono"),
  tipoTessera: z.enum(["Adulto", "Ridotto", "Familiare"]),
  parenteAdulto: z.string().optional(),
}).refine((data) => {
  if (data.tipoTessera === "Familiare" && (!data.parenteAdulto || data.parenteAdulto.length < 3)) {
    return false;
  }
  return true;
}, {
  message: "Devi indicare il Nome e Cognome dell'Adulto",
  path: ["parenteAdulto"]
});

const formSchema = z.object({
  members: z.array(memberSchema).min(1, "Devi inserire almeno un iscritto"),
  metodoPagamento: z.enum(["Contanti", "Stripe"]),
  accettazionePrivacy: z.boolean().refine((val) => val === true, "Devi accettare la Privacy Policy per iscriverti"),
  isDirettivo: z.boolean().optional(),
  chiaveSegreta: z.string().optional(),
  direttivoMemberIndex: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface SettingsProps {
  priceAdult: number;
  priceReduced: number;
  priceFamily: number;
}

export default function IscrizioneForm({ priceAdult, priceReduced, priceFamily }: SettingsProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isValidating, setIsValidating] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [{ tipoTessera: "Adulto", sesso: undefined }],
      metodoPagamento: "Stripe",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "members"
  });

  const members = watch("members");

  const updateMember = (index: number, field: keyof typeof members[0], value: any) => {
    const current = members[index];
    update(index, { ...current, [field]: value });
  };

  const getTotalPrice = () => {
    let total = 0;
    members.forEach(m => {
      if (m.tipoTessera === "Adulto") total += priceAdult;
      else if (m.tipoTessera === "Ridotto") total += priceReduced;
      else if (m.tipoTessera === "Familiare") total += priceFamily;
    });
    return total;
  };

  const nextStep = async () => {
    const isValid = await trigger("members");
    if (isValid) {
      setIsValidating(true);
      
      // Controllo abusi tariffa Familiare
      for (const m of members) {
        if (m.tipoTessera === "Familiare" && m.parenteAdulto) {
          // 1. Controllo se l'adulto è stato inserito nello stesso form
          const isAdultInForm = members.some(
            other => other.tipoTessera === "Adulto" && other.nomeCognome.toLowerCase().replace(/\s+/g, "") === m.parenteAdulto!.toLowerCase().replace(/\s+/g, "")
          );
          
          if (!isAdultInForm) {
            // 2. Controllo nel database
            const res = await verifyAdultAction(m.parenteAdulto);
            if (!res.exists) {
              alert(`Attenzione: Non abbiamo trovato nessun tesserato Adulto chiamato "${m.parenteAdulto}" nel database, né in questo modulo di iscrizione.\n\nPer la tariffa Familiare è obbligatorio associarsi a un Adulto pagante. Controlla di aver scritto bene il nome o cambia la tipologia di tessera.`);
              setIsValidating(false);
              return;
            }
          }
        }
      }

      setIsValidating(false);
      setStep((s) => (s < 4 ? (s + 1) as 1 | 2 | 3 | 4 : s));
    }
  };

  const prevStep = () => setStep((s) => (s > 1 ? (s - 1) as 1 | 2 | 3 | 4 : s));

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
                  <div className="flex justify-between items-center bg-white p-3 rounded border mb-6">
                    <span><User size={16} className="inline mr-2 text-primary"/>{members[index].nomeCognome || `Socio ${index+1}`}</span>
                    <span className="font-bold">
                      {members[index].tipoTessera === 'Adulto' ? priceAdult : members[index].tipoTessera === 'Ridotto' ? priceReduced : priceFamily}€
                    </span>
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
                      <label className="flex items-center text-sm font-medium text-zinc-700 mb-1">
                        Email (per il login) *
                        <InfoTooltip text="Serve per accedere alla tua area riservata sull'app e mostrare la tessera digitale in sede (non ti manderemo spam)." />
                      </label>
                      <input
                        type="email"
                        {...register(`members.${index}.email`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                      {errors.members?.[index]?.email && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.email?.message}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-zinc-700 mb-1">
                        Crea una tua Password *
                        <InfoTooltip text="Inventa una nuova password personale (minimo 6 caratteri). Ti servirà, insieme all'email, per fare il login nell'app del club e vedere i tuoi dati." />
                      </label>
                      <input
                        type="password"
                        {...register(`members.${index}.password`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Min. 6 caratteri"
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
                        type="text"
                        {...register(`members.${index}.dataNascita`)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="GG/MM/AAAA (es. 25/08/1980)"
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

                  <div className="mt-6 pt-6 border-t border-zinc-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
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

                      <div className="flex-[2]">
                        <label className="flex items-center text-sm font-bold text-zinc-700 mb-2">
                          Scegli il tipo di Tessera *
                          <InfoTooltip text="Adulto: Soci ordinari >18 anni. Ridotto (Minore): Ragazzi <18 anni. Familiare: Tariffa agevolata per i parenti di un socio Adulto." />
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button type="button" onClick={() => updateMember(index, "tipoTessera", "Adulto")} className={`p-2 border rounded-lg text-sm font-bold ${members[index].tipoTessera === 'Adulto' ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>Adulto ({priceAdult}€)</button>
                          <button type="button" onClick={() => updateMember(index, "tipoTessera", "Ridotto")} className={`p-2 border rounded-lg text-sm font-bold ${members[index].tipoTessera === 'Ridotto' ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>Ridotto / Minore ({priceReduced}€)</button>
                          <button type="button" onClick={() => updateMember(index, "tipoTessera", "Familiare")} className={`p-2 border rounded-lg text-sm font-bold ${members[index].tipoTessera === 'Familiare' ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>Familiare ({priceFamily}€)</button>
                        </div>
                        {errors.members?.[index]?.tipoTessera && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.tipoTessera?.message}</p>}
                      </div>
                    </div>

                    {members[index].tipoTessera === "Familiare" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl"
                      >
                        <label className="block text-sm font-bold text-blue-900 mb-2">Nome e Cognome dell'Adulto associato *</label>
                        <input
                          type="text"
                          {...register(`members.${index}.parenteAdulto`)}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Es. Mario Rossi"
                        />
                        {errors.members?.[index]?.parenteAdulto && <p className="text-red-500 text-sm mt-1">{errors.members[index]?.parenteAdulto?.message}</p>}
                        <p className="text-xs text-blue-700 mt-2">
                          <strong>Prevenzione Abusi:</strong> Il sistema verificherà in tempo reale che l'adulto indicato sia già tesserato nel nostro database, oppure che tu lo stia iscrivendo insieme a te in questo stesso modulo.
                        </p>
                      </motion.div>
                    )}
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
                  disabled={isValidating}
                  className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isValidating && <Loader2 size={18} className="animate-spin" />}
                  {isValidating ? "Verifica in corso..." : "Avanti"}
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
                    
                    {members.length > 1 && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <label className="block text-sm font-bold text-primary mb-2">Chi fa parte del Direttivo?</label>
                        <select
                          {...register("direttivoMemberIndex")}
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
                        >
                          <option value="ALL">Tutti i tesserati inseriti</option>
                          {members.map((m, idx) => (
                            <option key={idx} value={String(idx)}>{m.nomeCognome || `Iscritto ${idx + 1}`}</option>
                          ))}
                        </select>
                      </div>
                    )}
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
