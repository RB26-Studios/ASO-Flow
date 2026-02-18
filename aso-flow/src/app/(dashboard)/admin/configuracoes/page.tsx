import { Metadata } from "next"
import { getOrganizationAction } from "@/src/services/organizationService"
import { OrganizationManager } from "@/src/components/features/pages/organization-manager"

export const metadata: Metadata = {
  title: "Configurações da Empresa",
}

export default async function SettingsPage() {
  // Busca os dados diretamente no servidor antes de renderizar a tela
  const organization = await getOrganizationAction()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Consultoria</h1>
        <p className="text-muted-foreground">
          Gerencie os dados da sua empresa para os relatórios e documentos ASO.
        </p>
      </div>

      {/* Passa os dados (ou null) para o componente decidir o que mostrar */}
      <OrganizationManager initialData={organization} />
    </div>
  )
}