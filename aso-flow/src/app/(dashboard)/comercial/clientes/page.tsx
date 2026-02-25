import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { DataTable } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { coluna } from "./columns";
import { getClientAction, getClientByIdAction } from "@/src/services/clientService";
import { ClientForm } from "@/src/components/features/client/client-form";

export const metadata: Metadata = {
  title: "Página de Clientes",
}

export default async function ClientesPage({
    searchParams,
  }: {
    searchParams: Promise<{ action?: string, id?: string }>
  }) {
    
    // 1. Lemos os parâmetros da URL (ex: ?action=novo ou ?action=editar&id=123)
    const { action, id } = await searchParams;

    // 2. Se a ação for "novo", renderiza o formulário vazio
    if (action === "novo") {
        return (
            <div className="flex-1 flex flex-col p-8 gap-4 max-w-6xl mx-auto w-full">
                <ClientForm />
            </div>
        )
    }

    // 3. Se a ação for "editar" e existir um ID, busca o cliente no banco e renderiza o formulário preenchido
    if (action === "editar" && id) {
        const cliente = await getClientByIdAction(id);
        if (cliente) {
            return (
                <div className="flex-1 flex flex-col p-8 gap-4 max-w-6xl mx-auto w-full">
                    {/* Aqui passamos os dados do banco para preencher o formulário! */}
                    <ClientForm initialData={cliente as any} /> 
                </div>
            )
        }
    }

    // 4. Se não tiver ação nenhuma na URL, mostra a tabela de clientes
    const clientes = await getClientAction() || []

    return(
        <div className="flex-1 flex flex-col p-8 gap-4 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de clientes</h1>
                
                {/* Repare no link: ele não vai para uma página nova, ele só adiciona ?action=novo na URL */}
                <Link href="/comercial/clientes?action=novo">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                    </Button>
                </Link>
            </div>
            
            <div>
                <DataTable 
                    columns={coluna} 
                    data={clientes} 
                    searchKey="trade_name" 
                    searchPlaceholder="Pesquisar por nome fantasia..." 
                />
            </div>
        </div>
    )
}