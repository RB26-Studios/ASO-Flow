'use server'

import { createClient } from "@/src/lib/supabase/server"
import { getSessionUser } from "@/src/modules/auth/services/authService"

export type UserRole = 'ADMIN' | 'OPERADOR'

export interface SessionProfile {
  id: string
  organization_id: string
  role: UserRole
  full_name: string
}

/**
 * Retorna o perfil completo do usuário logado (incluindo role e organization_id).
 * Retorna null se não estiver autenticado ou sem organização vinculada.
 */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, organization_id, role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) return null

  return profile as SessionProfile
}

/**
 * Verifica se o usuário logado tem a role exigida.
 * Retorna o perfil se autorizado, ou um objeto de erro se não.
 */
export async function requireRole(requiredRole: UserRole): Promise<
  { authorized: true; profile: SessionProfile } |
  { authorized: false; error: string }
> {
  const profile = await getSessionProfile()

  if (!profile) {
    return { authorized: false, error: "Usuário não autenticado ou sem organização vinculada." }
  }

  if (profile.role !== requiredRole && profile.role !== 'ADMIN') {
    return { authorized: false, error: "Você não tem permissão para realizar esta ação." }
  }

  return { authorized: true, profile }
}

/**
 * Atalho: exige que o usuário seja ADMIN.
 */
export async function requireAdmin() {
  return requireRole('ADMIN')
}
