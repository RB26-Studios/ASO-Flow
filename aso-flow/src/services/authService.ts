'use server'

import { createClient } from "@/src/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

/* ======================================================
   LOGIN
====================================================== */

// 1️⃣ Schema de validação do login
const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

// 2️⃣ Tipo exportado para o frontend
export type LoginFormData = z.infer<typeof loginSchema>

// 3️⃣ Server Action de Login
export async function loginAction(data: LoginFormData) {
  // Validação no servidor
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return { error: "Dados inválidos. Verifique os campos." }
  }

  const supabase = await createClient()

  // Tentativa de login
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    console.error("Erro de login:", error.message)
    return { error: "E-mail ou senha incorretos." }
  }

  // Se sucesso, redireciona
  redirect("/admin")
}


/* ======================================================
   CADASTRO
====================================================== */

// 1️⃣ Schema de validação do cadastro
const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

// 2️⃣ Tipo exportado para o frontend
export type RegisterFormData = z.infer<typeof registerSchema>

// 3️⃣ Server Action de Cadastro
export async function registerAction(data: RegisterFormData) {
  const result = registerSchema.safeParse(data)

  if (!result.success) {
    return { error: "Dados inválidos. Verifique os campos." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Erro de cadastro:", error.message)
    return { error: error.message }
  }

  // Redireciona para login após cadastro
  redirect("/login")
}
