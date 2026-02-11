'use server'

import { createClient } from "@/src/lib/supabase/server"
import { redirect } from "next/navigation"
import { success, z } from "zod"

// 1. Definição do Schema de Validação (Regras do Zod)
const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

// 2. Exportamos o tipo para usar no formulário do Frontend
export type LoginFormData = z.infer<typeof loginSchema>

// 3. A Server Action de Login
export async function loginAction(data: LoginFormData) {
  // Validação no Servidor (Segurança extra contra bypass de frontend)
  const result = loginSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Dados inválidos. Verifique os campos." }
  }

  const supabase = await createClient()

  // Tenta fazer o login no Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    console.error("Erro de login:", error.message) // Log para debug no servidor
    return { error: "E-mail ou senha incorretos." }
  }

  // Se der sucesso, redireciona para a área administrativa
  // O 'redirect' no Next.js Server Actions funciona como um 'return' que joga o usuário para outra rota
  redirect("/admin")
}

// Schema para Cadastro
const registerSchema = z.object({
    email: z.string().email("E-mail invalido"),
    password: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Sever Action de Cadastro
export async function registerAction(data: RegisterFormData){
    const result = registerSchema.safeParse(data)

    if(!result.success){
        return {
            error: "Dados invalidos."
        }
    }

    const supabase = await createClient()

    const{ error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        }
    })

    if(error){
      console.error("Erro de cadastro:", error.message)
      return{error: error.message}
    }

    return{
      success: true
    }
}