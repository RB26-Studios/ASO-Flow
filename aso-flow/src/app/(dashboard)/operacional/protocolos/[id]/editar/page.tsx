import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProtocolForm } from "@/src/modules/operacional/components/protocol-form"
import { getJobRolesAction, getJobRoleByIdAction } from "@/src/modules/operacional/services/jobRoleService"
import { getProceduresAction } from "@/src/modules/operacional/services/procedureService"
import { getExamProtocolsByJobRoleAction } from "@/src/modules/operacional/services/examProtocolService"

export const metadata: Metadata = {
  title: "Editar Protocolo | ASO Flow",
}

export default async function EditarProtocoloPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [jobRole, allJobRoles, procedures, currentProtocols] = await Promise.all([
    getJobRoleByIdAction(id),
    getJobRolesAction(),
    getProceduresAction(),
    getExamProtocolsByJobRoleAction(id)
  ])

  if (!jobRole) notFound()

  // Garantir que os dados são arrays válidos e formatados
  const validJobRoles = Array.isArray(allJobRoles) ? allJobRoles.map(r => ({
    id: r.id!,
    title: r.title,
    client_name: r.client_name // Já vem formatado do serviço
  })) : []

  const validProcedures = Array.isArray(procedures) ? procedures.map(p => ({
    id: p.id!,
    name: p.name
  })) : []

  const formattedProtocols = Array.isArray(currentProtocols) ? currentProtocols.map(p => ({
    procedure_id: p.procedure_id,
    exam_type: p.exam_type,
    periodic_months: p.periodic_months
  })) : []

  return (
    <div className="flex-1 flex flex-col p-8 gap-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Editar Protocolo</h1>
      </div>

      <div>
        <ProtocolForm 
          jobRoles={validJobRoles} 
          procedures={validProcedures} 
          initialJobRoleId={id}
          initialProtocols={formattedProtocols}
          isEditing={true}
        />
      </div>
    </div>
  )
}
