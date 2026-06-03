'use server'

import { createClient } from "../../../lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/src/lib/auth-helpers"

// Esquema de validação para a criação do convite
const createInviteSchema = z.object({
    email: z.string().email("Insira um e-mail válido para o convite."),
    role: z.enum(['ADMIN', 'OPERADOR']),
})

export type CreateInviteFormData = z.infer<typeof createInviteSchema>

export async function createInviteAction(data: CreateInviteFormData) {
    // RF-008: Apenas ADMIN pode criar convites
    const auth = await requireAdmin()
    if (!auth.authorized) {
        return { error: auth.error }
    }
    const { profile } = auth

    const supabase = await createClient()

    //Verifica se ja existe um convite pendente para esse email.
    const { data: existingInvite } = await supabase
        .from('invites')
        .select('id')
        .eq('email', data.email)
        .eq('organization_id', profile.organization_id)
        .eq('used', false)
        .single()

    if (existingInvite) {
        return {
            error: "Já existe um convite pendente para esse email."
        }
    }

    //Cria o convite no banco
    const payload = {
        email: data.email,
        role: data.role,
        organization_id: profile.organization_id,
        created_by: profile.id,
    }

    const { data: newInvite, error } = await supabase
        .from('invites')
        .insert(payload)
        .select('id')
        .single()

    if (error) {
        console.error("Erro ao criar convite: ", error)
        return {
            error: "Ocorreu um erro ao criar o convite."
        }
    }

    revalidatePath('/admin/equipe')

    return {
        success: true,
        inviteId: newInvite.id
    }
}