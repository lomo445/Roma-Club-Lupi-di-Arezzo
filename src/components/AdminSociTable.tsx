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

type Socio = {
  id: string;
  memberNumber: number;
  name: string;
  email: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED";
};

const columnHelper = createColumnHelper<Socio>();

export function AdminSociTable({ initialData }: { initialData: Socio[] }) {
  const [data, setData] = useState(() => [...initialData]);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleApprove = (id: string) => {
    setData((old) =>
      old.map((row) => {
        if (row.id === id) {
          return { ...row, status: "ACTIVE" };
        }
        return row;
      })
    );
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
          <div className="flex space-x-2">
            {isPending && (
              <button
                onClick={() => handleApprove(id)}
                className="bg-primary text-white px-3 py-1 rounded text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                Approva
              </button>
            )}
            <button
              onClick={() => handleEditMemberNumber(id, currentNumber)}
              className="bg-zinc-200 text-zinc-700 px-3 py-1 rounded text-xs font-bold hover:bg-zinc-300 transition-colors"
            >
              Modifica N°
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Elenco Soci</h2>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Cerca soci..."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 text-zinc-600 uppercase border-b border-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-semibold">
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
                  <td key={cell.id} className="px-6 py-4">
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
