import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ModificaProfiloForm } from "./ModificaProfiloForm";
import Link from "next/link";

export default async function ProfiloPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!userRecord) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-primary font-bold hover:underline">
            &larr; Torna alla Dashboard
          </Link>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">Modifica Dati Profilo</h1>
          <p className="text-zinc-500 mb-8">Aggiorna le tue informazioni personali associate alla tessera.</p>
          
          <ModificaProfiloForm user={userRecord} />
        </div>
      </div>
    </div>
  );
}
