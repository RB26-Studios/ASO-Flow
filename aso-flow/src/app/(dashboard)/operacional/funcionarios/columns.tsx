"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/src/components/ui/button"
import { ArrowUpDown, Pencil } from "lucide-react"
import Link from "next/link"

export type EmployeeData = {
  id: string
  name: string
  cpf: string
  gender: string
  status: string
  client_name: string
  job_role_title: string
  admission_date: string
}

function formatCpf(cpf: string) {
  const digits = cpf.replace(/\D/g, "")
  if (digits.length !== 11) return cpf
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export const columns: ColumnDef<EmployeeData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "cpf",
    header: () => <div className="font-bold">CPF</div>,
    cell: ({ row }) => (
      <div className="font-mono text-sm">{formatCpf(row.getValue("cpf"))}</div>
    ),
  },
  {
    accessorKey: "client_name",
    header: () => <div className="font-bold">Empresa</div>,
    cell: ({ row }) => <div>{row.getValue("client_name") || "—"}</div>,
  },
  {
    accessorKey: "job_role_title",
    header: () => <div className="font-bold">Cargo</div>,
    cell: ({ row }) => <div>{row.getValue("job_role_title") || "—"}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-bold">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isAtivo = status === "ATIVO"
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isAtivo
              ? "bg-emerald-100 text-emerald-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {isAtivo ? "Ativo" : "Inativo"}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employeeId = row.original.id
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/operacional/funcionarios/${employeeId}`}>
            <Button variant="ghost" size="icon" title="Editar">
              <Pencil className="h-4 w-4 text-slate-600" />
            </Button>
          </Link>
        </div>
      )
    },
  },
]
