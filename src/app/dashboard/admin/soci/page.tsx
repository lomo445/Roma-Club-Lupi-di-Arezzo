import { AdminSociTable } from "@/components/AdminSociTable";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SociPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-primary">&larr; Torna alla Dashboard</Link>
        </div>
        <AdminSociTable />
      </div>
    </div>
  );
}
