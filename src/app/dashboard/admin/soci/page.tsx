import { AdminSociTable } from "@/components/AdminSociTable";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SociPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    include: { subscriptions: true }
  });

  const formattedData = users.map(u => ({
    id: u.id,
    memberNumber: u.memberNumber || 0,
    name: `${u.name} ${u.surname}`,
    email: u.email,
    status: (u.subscriptions && u.subscriptions.length > 0) ? u.subscriptions[0].status : "PENDING"
  }));

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-primary">&larr; Torna alla Dashboard</Link>
        </div>
        <AdminSociTable initialData={formattedData} />
      </div>
    </div>
  );
}
