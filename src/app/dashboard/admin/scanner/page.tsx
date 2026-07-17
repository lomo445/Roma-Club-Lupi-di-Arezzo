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

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" }
  });

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
