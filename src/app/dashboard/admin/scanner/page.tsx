import { AdminScanner } from "@/components/AdminScanner";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ScannerPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const today = new Date();

  const genericEvents = await prisma.event.findMany({
    where: { type: { in: ["SYSTEM", "OTHER"] } },
    orderBy: { title: "asc" }
  });

  const pastMatches = await prisma.event.findMany({
    where: { type: "MATCH", date: { lte: today } },
    orderBy: { date: "desc" },
    take: 1
  });

  const futureMatches = await prisma.event.findMany({
    where: { type: "MATCH", date: { gt: today } },
    orderBy: { date: "asc" },
    take: 2
  });

  // Unisce gli eventi e li ordina per data decrescente (mostra le partite per prime)
  const events = [...pastMatches, ...futureMatches, ...genericEvents];

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-primary">&larr; Torna alla Dashboard</Link>
        </div>
        <AdminScanner events={events} />
      </div>
    </div>
  );
}
