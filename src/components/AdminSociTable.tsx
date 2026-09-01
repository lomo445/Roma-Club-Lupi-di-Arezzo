"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { updateMemberNumberAction } from "@/app/actions/updateMemberNumber";
import { deleteUserAction } from "@/app/actions/deleteUser";
import { sendReminderAction } from "@/app/actions/sendReminder";
import { approveUserAction } from "@/app/actions/approveUser";
import Link from "next/link";

import { Download } from "lucide-react";

type Socio = {
  id: string;
  memberNumber: number;
  name: string;
  email: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  method?: string;
};

const columnHelper = createColumnHelper<Socio>();

export function AdminSociTable({ initialData }: { initialData: Socio[] }) {
  const [data, setData] = useState(() => [...initialData]);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleApprove = async (id: string) => {
    if (!confirm("Confermi di aver ricevuto il pagamento in contanti da questo socio? La sua tessera verrà attivata.")) return;
    
    const res = await approveUserAction(id);
    if (res.success) {
      setData((old) =>
        old.map((row) => {
          if (row.id === id) {
            return { ...row, status: "ACTIVE" };
          }
          return row;
        })
      );
      alert("Tessera approvata e attivata con successo!");
    } else {
      alert(res.error || "Errore durante l'approvazione.");
    }
  };

  const handleEditMemberNumber = async (id: string, currentNumber: number) => {
    const newVal = prompt("Inserisci il nuovo numero di tessera:", String(currentNumber));
    if (!newVal) return;
    const num = parseInt(newVal, 10);
    if (isNaN(num) || num <= 0) {
      alert("Inserire un numero valido.");
      return;
    }
    
    const res = await updateMemberNumberAction(id, num);
    if (res.success) {
      setData((old) => old.map(r => r.id === id ? { ...r, memberNumber: num } : r));
      alert("Numero di tessera aggiornato!");
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ATTENZIONE: Sei sicuro di voler eliminare definitivamente questo socio e tutti i suoi dati (presenze, abbonamenti)? Questa operazione non è reversibile.")) return;
    
    const res = await deleteUserAction(id);
    if (res.success) {
      setData((old) => old.filter((r) => r.id !== id));
      alert("Socio eliminato con successo.");
    } else {
      alert(res.error || "Errore durante l'eliminazione.");
    }
  };

  const handleRemind = async (id: string) => {
    alert("Invio sollecito in corso...");
    const res = await sendReminderAction(id);
    if (res.success) {
      alert("Email di sollecito inviata con successo!");
    } else {
      alert(res.error || "Errore durante l'invio dell'email.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF("landscape");
      
      // Carica il logo
      let logoBase64 = null;
      try {
        const res = await fetch('/logo.png');
        const blob = await res.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn("Logo non caricato", e);
      }

      if (logoBase64) {
        doc.addImage(logoBase64 as string, 'PNG', 14, 10, 20, 20);
      }
      
      doc.setFontSize(22);
      doc.setTextColor(140, 28, 19);
      doc.text("Roma Club Lupi di Arezzo - Elenco Soci", logoBase64 ? 38 : 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generato il: ${new Date().toLocaleDateString("it-IT")} alle ${new Date().toLocaleTimeString("it-IT")}`, logoBase64 ? 38 : 14, 28);

      const tableData = data.map(socio => [
        socio.memberNumber === 0 ? "N/D" : socio.memberNumber,
        socio.name,
        socio.email,
        socio.status,
        socio.method || "N/D"
      ]);

      autoTable(doc, {
        startY: 35,
        head: [["N° Tessera", "Nome e Cognome", "Email", "Stato", "Pagamento"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [140, 28, 19] },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      doc.save("Elenco_Soci_Roma_Club_Arezzo.pdf");
    } catch (error) {
      console.error("Errore generazione PDF:", error);
      alert("Impossibile generare il PDF al momento.");
    }
  };

  const columns = [
    columnHelper.accessor("memberNumber", {
      header: "N° Tessera",
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Nome & Cognome",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("status", {
      header: "Stato",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            status === "ACTIVE" ? "bg-green-100 text-green-800" :
            status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Azioni",
      cell: (props) => {
        const isPending = props.row.original.status === "PENDING";
        const id = props.row.original.id;
        const currentNumber = props.row.original.memberNumber;

        return (
          <div className="flex space-x-2 items-center">
            <Link 
              href={`/dashboard/admin/soci/${id}`}
              className="bg-zinc-200 text-zinc-700 px-3 py-1 rounded text-xs font-bold hover:bg-zinc-300 transition-colors"
            >
              Visualizza
            </Link>
            
            <button
              onClick={() => handleEditMemberNumber(id, currentNumber)}
              className="bg-zinc-200 text-zinc-700 px-3 py-1 rounded text-xs font-bold hover:bg-zinc-300 transition-colors"
            >
              N° Tessera
            </button>
            
            
            {isPending && (
              <>
                <button
                  onClick={() => handleRemind(id)}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-bold hover:bg-yellow-200 transition-colors"
                >
                  Sollecita
                </button>
                <button
                  onClick={() => handleApprove(id)}
                  className="bg-primary text-white px-3 py-1 rounded text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  Approva
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(id)}
              className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 transition-colors"
            >
              Elimina
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Elenco Soci</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex-1"
            placeholder="Cerca soci..."
          />
          <button 
            onClick={handleExportPDF}
            className="bg-[#8C1C13] hover:bg-[#6c150e] text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 text-zinc-600 uppercase border-b border-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
