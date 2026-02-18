import { Metadata } from "next"
import { InviteForm } from "@/src/components/features/equipe/invite-form"

export const metadata: Metadata = {
  title: "Gestão de Equipa",
}

export default function EquipePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipa</h1>
        <p className="text-muted-foreground">
          Adicione e faça a gestão dos membros que têm acesso ao sistema da sua consultoria.
        </p>
      </div>

      <div className="mt-8">
        <InviteForm />
      </div>
    </div>
  )
}