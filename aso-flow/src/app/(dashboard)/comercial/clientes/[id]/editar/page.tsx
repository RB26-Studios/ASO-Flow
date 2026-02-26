import { notFound } from "next/navigation"
import { getClientByIdAction } from "@/src/services/clientService"
import { ClientForm } from "@/src/components/features/client/client-form"

export default async function EditarClientePage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
  
    const cliente = await getClientByIdAction(id)
  
    if (!cliente) notFound()
  
    return (
      <ClientForm
        initialData={{
          id: cliente.id,
          trade_name: cliente.trade_name,
          corporate_name: cliente.corporate_name,
          cnpj: cliente.cnpj,
          billing_email: cliente.billing_email ?? "",
          financial_contact_name: cliente.financial_contact_name ?? "",
          risk_degree: cliente.risk_degree,
          status: cliente.status,
        }}
      />
    )
  }