'use server'

import { createClient } from "../../../lib/supabase/server"
import { getSessionUser } from "../../auth/services/authService"

export type TeamMemberData = {
  id: string
  full_name: string
  role: string
  status: boolean
}

export async function getTeamMembersAction(): Promise<{ data?: TeamMemberData[], error?: string }> {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) {
    return { error: "Usuário não autenticado." }
  }

  // Obter organização do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) {
    return { error: "Usuário não está vinculado a nenhuma organização." }
  }

  // Buscar equipe (profiles vinculados à mesma organização)
  const { data: teamMembers, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, status')
    .eq('organization_id', profile.organization_id)
    .order('role', { ascending: true }) // ADMIN primeiro, etc.

  if (error) {
    console.error("Erro ao buscar equipe:", error)
    return { error: "Ocorreu um erro ao buscar a equipe." }
  }

  return { data: teamMembers as TeamMemberData[] }
}
