import { createClient } from "../lib/supabase/server";
import z, { success } from "zod";
import { revalidatePath } from "next/cache";

// Esquema de validação zod
const clientSchema = z.object({

  id: z.string().uuid().optional(), 
  organization_id: z.string().uuid("ID da organização inválido."),
  trade_name: z.string().min(2, "O nome fantasia é obrigatório."),
  corporate_name: z.string().min(2, "O nome empresarial do cliente é obrigatório."),
  cnpj: z.string().min(14, "O CNPJ do cliente é obrigatório."),
  risk_degree: z.number().int().optional(),
  billing_email: z.string().email("E-mail inválido.").optional(),
  financial_contact_name: z.string().optional(),
  status: z.enum(["ativo", "inativo"]).optional(), 

});

export type ClientFormData = z.infer<typeof clientSchema>

export async function upsertClientAction(data: ClientFormData){

    //Validação de dados
    const parsedata = clientSchema.safeParse(data);

    if(!parsedata.success){
        return{
            error: "Dados de formulario inválidos!"
        }
    }

    const supabase = await createClient()

    const{data: {user}} = await supabase.auth.getUser()

    if(!user){
        return{
            error: "Usuário não autenticado."
        }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

    if (!profile?.organization_id) {
        return { error: "Usuário não vinculado a nenhuma organização." };
    }

    const payload = {
        ...data,
        organization_id: profile.organization_id,
    };

    if(!payload.id){
        delete payload.id;
    }

    const{data: client, error} = await supabase
        .from('clients')
        .upsert(payload)
        .select()
        .single()
    
    if(error){
        console.error("Erro ao salvar client: ", error)
        return{
            error: "Ocorreu um erro ao guardar os dados."
        }
    }

    revalidatePath('/clientes');

    return{
        success: true,
        data: client
    }
 
}