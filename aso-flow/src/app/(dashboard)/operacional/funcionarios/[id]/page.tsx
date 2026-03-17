import { notFound } from "next/navigation"
import { EmployeeForm } from "@/src/modules/operacional/components/employee-form"
import { getEmployeeByIdAction } from "@/src/modules/operacional/services/employeeService"
import { getClientAction } from "@/src/modules/comercial/services/clientService"
import { getJobRolesAction } from "@/src/modules/operacional/services/jobRoleService"

interface EditFuncionarioPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarFuncionarioPage({ params }: EditFuncionarioPageProps) {
  const { id } = await params

  const [employee, clients, jobRoles] = await Promise.all([
    getEmployeeByIdAction(id),
    getClientAction(),
    getJobRolesAction(),
  ])

  if (!employee) {
    notFound()
  }

  const clientsList =
    clients?.map((c) => ({ id: c.id, name: c.trade_name })) || []

  const jobRolesList =
    jobRoles?.map((jr: any) => ({
      id: jr.id,
      title: jr.title,
      client_id: jr.client_id,
    })) || []

  const initialData = {
    id: employee.id,
    client_id: employee.client_id,
    job_role_id: employee.job_role_id,
    full_name: employee.full_name,
    cpf: employee.cpf,
    rg: employee.rg || "",
    birth_date: employee.birth_date || "",
    gender: employee.gender as "M" | "F",
    enrollment_number: employee.enrollment_number || "",
    admission_date: employee.admission_date || "",
    status: employee.status as "ATIVO" | "INATIVO",
  }

  return (
    <div className="p-8">
      <EmployeeForm
        initialData={initialData}
        clients={clientsList}
        jobRoles={jobRolesList}
      />
    </div>
  )
}
