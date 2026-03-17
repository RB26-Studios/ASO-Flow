"use client"

import { useEmployees } from "@/src/modules/operacional/hooks/use-employees"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { DataTable } from "@/src/components/ui/data-table"
import { columns } from "./columns"

export default function FuncionariosPage() {
  const { data: employees, isLoading, isError } = useEmployees()

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando funcionários...</span>
      </div>
    )
  }

  if (isError) {
    return <div className="text-red-500">Erro ao carregar funcionários.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários vinculados às empresas clientes.
          </p>
        </div>
        <Link href="/operacional/funcionarios/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={employees || []}
        searchKey="name"
        searchPlaceHolder="Pesquisar por nome..."
      />
    </div>
  )
}
