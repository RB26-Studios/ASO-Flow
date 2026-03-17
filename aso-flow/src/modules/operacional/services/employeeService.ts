'use server'

import { createClient } from "@/src/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getOrganizationAction } from "../../admin/services/organizationService"
import { getSessionUser } from "../../auth/services/authService"

const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  organization_id: z.string().uuid().optional(),
  client_id: z.string().uuid("Selecione uma empresa válida."),
  job_role_id: z.string().uuid("Selecione um cargo válido."),
  name: z.string().min(2, "O nome completo é obrigatório."),
  cpf: z.string().min(11, "O CPF é obrigatório."),
  rg: z.string().optional().or(z.literal("")),
  birth_date: z.string().min(1, "A data de nascimento é obrigatória."),
  gender: z.enum(["M", "F"], { message: "Selecione o sexo." }),
  matricula: z.string().optional().or(z.literal("")),
  admission_date: z.string().optional().or(z.literal("")),
  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

export async function upsertEmployeeAction(data: EmployeeFormData) {
  const parsedData = employeeSchema.safeParse(data)

  if (!parsedData.success) {
    console.error("ERRO DE VALIDAÇÃO FUNCIONÁRIO:", parsedData.error.format())
    return { error: "Dados de formulário inválidos!" }
  }

  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) {
    return { error: "Usuário não autenticado." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single()

  if (!profile?.organization_id) {
    return { error: "Usuário não vinculado a nenhuma organização." }
  }

  const payload: Record<string, unknown> = {
    ...parsedData.data,
    organization_id: profile.organization_id,
  }

  if (!payload.id) {
    delete payload.id
  }

  // Remove empty optional strings
  if (!payload.rg) delete payload.rg
  if (!payload.enrollment_number) delete payload.enrollment_number
  if (!payload.admission_date) delete payload.admission_date

  const { data: employee, error } = await supabase
    .from("employees")
    .upsert(payload)
    .select()
    .single()

  if (error) {
    console.error("Erro ao salvar funcionário:", error)
    if (error.code === "23505") {
      return { error: "Já existe um funcionário com este CPF cadastrado." }
    }
    return { error: "Ocorreu um erro ao salvar o funcionário." }
  }

  revalidatePath("/operacional/funcionarios")
  return { success: true, data: employee }
}

export async function getEmployeesAction() {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) return null

  const organization = await getOrganizationAction()
  if (!organization) return null

  const { data: employees, error } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      cpf,
      gender,
      status,
      admission_date,
      birth_date,
      matricula,
      rg,
      client_id,
      job_role_id,
      clients (trade_name),
      job_roles (title)
    `)
    .eq("organization_id", organization.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Erro ao buscar funcionários:", error)
    return []
  }

  if (!employees) return []

  return employees.map((emp) => ({
    id: emp.id,
    name: emp.name,
    cpf: emp.cpf,
    rg: emp.rg || "",
    birth_date: emp.birth_date || "",
    gender: emp.gender,
    matricula: emp.matricula || "",
    admission_date: emp.admission_date || "",
    status: emp.status,
    client_id: emp.client_id,
    job_role_id: emp.job_role_id,
    client_name: (emp.clients as any)?.trade_name || "—",
    job_role_title: (emp.job_roles as any)?.title || "—",
  }))
}

export async function getEmployeeByIdAction(id: string) {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) return null

  const organization = await getOrganizationAction()
  if (!organization) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .single()

  return employee
}

export async function deleteEmployeeAction(id: string) {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) return { error: "Usuário não autenticado." }

  const organization = await getOrganizationAction()
  if (!organization) return { error: "Organização não encontrada." }

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id)
    .eq("organization_id", organization.id)

  if (error) {
    console.error("Erro ao deletar funcionário:", error)
    return { error: "Ocorreu um erro ao deletar o funcionário." }
  }

  revalidatePath("/operacional/funcionarios")
  return { success: true }
}
