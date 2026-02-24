import { createClient } from "../lib/supabase/server";
import z from "zod";
import { getOrganizationAction } from "./organizationService";
import { revalidatePath } from "next/cache";
import { getProceduresByIdAction } from "./procedureService";
import { getClientByIdAction } from "./clientService";


const clientPriceListSchema = z.object({
    client_id: z.string().uuid("ID do cliente inválido."),
    procedure_id: z.string().uuid("ID do procedimento inválido."),
    custom_price: z.number().positive("O preço precisa ser maior que zero."),
})

export type ClientPriceListFormData = z.infer<typeof clientPriceListSchema>

export async function upsertClientPriceListAction(data: ClientPriceListFormData){
    const parsedata = clientPriceListSchema.safeParse(data);

    if(!parsedata.success){
        return{
            error: "Dados de formulario inválidos!"
        }
    }

    const supabase = await createClient()

    const user = await getSessionUser()
    if(!user){
        return{
            error: "Usuario não autenticado."
        }
    }

    const organization = await getOrganizationAction()
    if(!organization){
        return{
            error: "Usuário não vinculado a nenhuma organização."
        }
    }

    const client = await getClientByIdAction(data.client_id)
    if(!client){
        return{
            error: "Nenhum cliente encontrado."
        }
    }

    const procedures = await getProceduresByIdAction(data.procedure_id)
    
    if(!procedures){
        return{
            error: "Nenhum procedimento encontrado."
        }
    }

    const payload={
        client_id: data.client_id,
        procedure_id: data.procedure_id,
        custom_price: data.custom_price,
    }

    const { data: clientPriceList, error } = await supabase
        .from('client_price_list')
        .upsert(payload)
        .select()
        .single()

    if(error){
        console.error("Erro ao salvar preço do cliente: ", error)
        return{
            error: "Ocorreu um erro ao guardar os dados."
        }
    }

    revalidatePath('/admin/clientes/precos');
    return{
        success: true,
        data: clientPriceList
    }
}

export async function getSessionUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}