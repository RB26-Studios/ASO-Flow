import { Metadata } from "next"
import { LoginForm } from "@/src/components/features/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta para gerenciar a saúde ocupacional.",
}

export default function LoginPage() {
  return <LoginForm />
}