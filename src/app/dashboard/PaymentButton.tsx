"use client";
import { useState } from "react";
import { resumeStripePaymentAction } from "@/app/actions/payment";
import { CreditCard, Loader2 } from "lucide-react";

export function PaymentButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      onClick={async () => {
        setLoading(true);
        const res = await resumeStripePaymentAction();
        if (res.success && res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          alert(res.error || "Si è verificato un errore.");
          setLoading(false);
        }
      }}
      disabled={loading}
      className="mt-4 w-full flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#4B45C6] text-white py-3 px-4 rounded-lg font-bold shadow-md transition disabled:opacity-70"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
      Paga Ora con Stripe
    </button>
  );
}
