import { EmployeeForm } from "@/src/modules/operacional/components/employee-form"
import { getClientAction } from "@/src/modules/comercial/services/clientService"
import { getJobRolesAction } from "@/src/modules/operacional/services/jobRoleService"

export default async function NovoFuncionarioPage() {
  const [clients, jobRoles] = await Promise.all([
    getClientAction(),
    getJobRolesAction(),
  ])

  const clientsList =
    clients?.map((c) => ({ id: c.id, name: c.trade_name })) || []

  const jobRolesList =
    jobRoles?.map((jr: any) => ({
      id: jr.id,
      title: jr.title,
      client_id: jr.client_id,
    })) || []

  return (
    <div className="p-8">
      <EmployeeForm clients={clientsList} jobRoles={jobRolesList} />
    </div>
  )
}
