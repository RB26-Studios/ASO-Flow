import { Metadata } from "next"
import { RegisterForm } from "@/src/components/features/auth/register-form"

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Acesse sua conta para gerenciar a saúde ocupacional.",
}

export default function RegisterPage() {
  return <RegisterForm />
}

