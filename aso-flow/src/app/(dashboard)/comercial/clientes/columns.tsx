"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/src/components/ui/button"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"

// O tipo baseado nos dados que o seu clientService devolve
export type ClienteData = {
  id: string
  trade_name: string
  corporate_name: string
  cnpj: string
  status: "ativo" | "inativo" | null
}

export const coluna: ColumnDef<ClienteData>[] = [
  {
    accessorKey: "trade_name", // O campo exato do banco de dados
    header: ({ column }) => {
      // Este cabeçalho ganha um botão para ordenar de A-Z
      return (
        <Button
          variant="ghost"
          className="pl-0 text-left font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Fantasia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "cnpj",
    header: () => <div className="font-bold">CNPJ</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-bold">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      // Formatação visual do status (Verde para ativo, Vermelho para inativo)
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Aqui entrarão os botões de ação (Editar/Deletar) futuramente
      const clienteId = row.original.id
      return (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" title="Editar">
            <Pencil className="h-4 w-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" title="Excluir">
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  }
]