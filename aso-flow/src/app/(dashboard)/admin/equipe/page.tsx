import { Metadata } from "next"
import { InviteForm } from "@/src/modules/admin/components/invite-form"
import { getTeamMembersAction } from "@/src/modules/admin/services/teamService"
import { TeamList } from "@/src/modules/admin/components/team-list"

export const metadata: Metadata = {
  title: "Equipe",
}

export default async function EquipePage() {
  const { data: teamMembers, error } = await getTeamMembersAction()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
        <p className="text-muted-foreground">
          Adicione e faça a gestão dos membros que têm acesso ao sistema da sua consultoria.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Membros da Equipe</h2>
          <TeamList members={teamMembers || []} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Convidar Novo Membro</h2>
          <InviteForm />
        </div>
      </div>
    </div>
  )
}