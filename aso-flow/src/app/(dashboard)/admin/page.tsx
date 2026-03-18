import { Metadata } from "next"
import Link from "next/link"
import {
  Settings,
  Users,
  Building2,
  ArrowRight,
  Shield,
  UserCheck,
  LayoutDashboard,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { getOrganizationAction } from "@/src/modules/admin/services/organizationService"

export const metadata: Metadata = {
  title: "Administrativo | ASO Flow",
}

const navCards = [
  {
    href: "/admin/configuracoes",
    icon: Building2,
    title: "Minha Organização",
    description:
      "Configure os dados cadastrais da empresa, CNPJ, endereço e responsável técnico.",
    color: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    hoverBorder: "hover:border-violet-300",
    hoverIcon: "group-hover:text-violet-600",
  },
  {
    href: "/admin/equipe",
    icon: Users,
    title: "Minha Equipe",
    description:
      "Gerencie os membros da equipe, seus acessos e funções dentro do sistema.",
    color: "from-sky-500/10 to-blue-500/10",
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    hoverBorder: "hover:border-sky-300",
    hoverIcon: "group-hover:text-sky-600",
  },
]

export default async function AdminPage() {
  const organization = await getOrganizationAction()

  return (
    <div className="flex-1 w-full">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-50 rounded-xl">
              <Settings size={28} className="text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Módulo Administrativo
              </h1>
              <p className="text-zinc-500 mt-0.5 text-sm">
                Configurações da organização, equipe e controle de acessos
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-10">
        {/* Organization Summary Card */}
        {organization && (
          <div className="p-6 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
              Organização Ativa
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-violet-50 rounded-xl">
                <Building2 size={32} className="text-violet-600" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-bold tracking-wide">Nome Fantasia</p>
                  <p className="font-bold text-zinc-800 mt-0.5">{organization.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-bold tracking-wide">Razão Social</p>
                  <p className="font-bold text-zinc-800 mt-0.5">{organization.corporate_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-bold tracking-wide">CNPJ</p>
                  <p className="font-bold text-zinc-800 mt-0.5">{organization.cnpj || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Membros da Equipe
              </CardTitle>
              <div className="p-2 bg-sky-50 rounded-lg">
                <Users className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Usuários ativos</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Configurações
              </CardTitle>
              <div className="p-2 bg-violet-50 rounded-lg">
                <Shield className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">
                {organization ? "✓" : "—"}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {organization ? "Empresa configurada" : "Aguardando configuração"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Permissões
              </CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg">
                <UserCheck className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Papéis configurados</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Funcionalidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {navCards.map(({ href, icon: Icon, title, description, color, iconColor, iconBg, hoverBorder, hoverIcon }) => (
              <Link key={href} href={href} className="group">
                <div
                  className={`h-full p-6 bg-gradient-to-br ${color} rounded-xl border border-zinc-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${hoverBorder}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${iconBg} rounded-xl ${iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <ArrowRight size={18} className={`text-zinc-300 ${hoverIcon} transition-colors`} />
                  </div>
                  <h3 className="text-base font-bold text-zinc-800 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                </div>
              </Link>
            ))}

            {/* Placeholder */}
            <div className="p-6 bg-white/60 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center text-center opacity-60 min-h-[160px]">
              <LayoutDashboard size={28} className="text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-400">Em Breve</p>
              <p className="text-xs text-zinc-400 mt-1">Logs de Auditoria</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}