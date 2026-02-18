'use server'

import { createClient } from "../lib/supabase/client"  
import { z } from "zod"
import { revalidatePath } from "next/cache"

//Esquema de validação Zod
const organizationSchema = z.object({
    id: z.string().optional(),
    trade_name: z.string().min(2, "O nome Fantasia é obrigatorio"),
    corporate_name: z.string().min(2, "O nome Empresarial é obrigatorio"),
    cnpj: z.string().min(14, "O CNPJ é obrigatorio"),
    tech_responsible_name: z.string().min(2, "O nome do Técnico ou medico é obrigatorio"),
    tech_responsible_register: z.string().optional(),
    email: z.string().email("E-mail inválido").optional(),
    phone: z.string().optional(),
    aderess: z.string().optional(),
})

export type OrganizationFormData = z.infer<typeof organizationSchema>

export async function upsertOrganizationAction(data: OrganizationFormData){
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if(!user){
        return{
            error: "Usuario não autenticado."
        }
    }

    // Garante que o criador fica registado
    const payload = {
        ...data,
    }

    // Faz o Upsert (Atualiza se tiver ID, cria se não tiver)
    const { data: org, error } = await supabase
        .from('organizations')
        .upsert(payload)
        .select()
        .single()

    if(error){
        console.error("Erro ao guardar organização: ", error)
        return{
            error: "Ocorreu um erro ao guardar os dados."
        }
    }

    // Atualiza o perfil do utilizador para o vincular a esta nova empresa
    await supabase
        .from('profiles')
        .update({ organization_id: org.id})
        .eq('id', user.id)
    
    // Atualiza a cache da página para mostrar os dados novos imediatamente
    revalidatePath('/admin/configuracoes')

    return{
        success: true, org
    }
}

//Ação para Buscar os Dados Atuais

export async function getOrganizationAction(){
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if(!user){
        return null
    }

    // Primeiro descobre qual é a empresa do utilizador atual
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

    if(!profile?.organization_id){
        return null
    }

    // Depois busca os dados da empresa)
    const { data:org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single()

    return org
}