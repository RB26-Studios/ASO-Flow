import { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Activity,
  ClipboardList,
  FileText,
  Users2,
  Briefcase,
  SquareActivity,
  CalendarCheck2,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

export const metadata: Metadata = {
  title: "Operacional | ASO Flow",
}

const navCards = [
  {
    href: "/operacional/atendimentos",
    icon: CalendarCheck2,
    title: "Atendimentos",
    description:
      "Registre e acompanhe todos os atendimentos médicos ocupacionais realizados.",
    color: "from-teal-500/10 to-emerald-500/10",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    hoverBorder: "hover:border-teal-300",
    hoverIcon: "group-hover:text-teal-600",
  },
  {
    href: "/operacional/procedimentos",
    icon: Activity,
    title: "Procedimentos / Exames",
    description:
      "Catálogo completo de exames médicos e procedimentos disponíveis para inclusão em protocolos.",
    color: "from-blue-500/10 to-sky-500/10",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    hoverBorder: "hover:border-blue-300",
    hoverIcon: "group-hover:text-blue-600",
  },
  {
    href: "/operacional/protocolos",
    icon: ClipboardList,
    title: "Protocolos (PCMSO)",
    description:
      "Gerencie os Programas de Controle Médico de Saúde Ocupacional de cada cliente.",
    color: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    hoverBorder: "hover:border-indigo-300",
    hoverIcon: "group-hover:text-indigo-600",
  },
  {
    href: "/operacional/cargos",
    icon: Briefcase,
    title: "Cargos",
    description:
      "Cadastre e organize os cargos e funções para mapeamento de riscos ocupacionais.",
    color: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    hoverBorder: "hover:border-amber-300",
    hoverIcon: "group-hover:text-amber-600",
  },
  {
    href: "/operacional/funcionarios",
    icon: Users2,
    title: "Funcionários",
    description:
      "Gerencie o cadastro de funcionários vinculados aos clientes e seus históricos médicos.",
    color: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    hoverBorder: "hover:border-rose-300",
    hoverIcon: "group-hover:text-rose-600",
  },
]

export default async function OperacionalPage() {
  return (
    <div className="flex-1 w-full">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-xl">
              <SquareActivity size={28} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Módulo Operacional
              </h1>
              <p className="text-zinc-500 mt-0.5 text-sm">
                Atendimentos, exames, protocolos PCMSO, cargos e funcionários
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Procedimentos / Exames
              </CardTitle>
              <div className="p-2 bg-teal-50 rounded-lg">
                <Activity className="h-4 w-4 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Total no catálogo</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Protocolos (PCMSO)
              </CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ClipboardList className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Ativos no sistema</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Funcionários
              </CardTitle>
              <div className="p-2 bg-rose-50 rounded-lg">
                <FileText className="h-4 w-4 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Cadastrados</p>
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
          </div>
        </div>

        {/* Quick Action */}
        <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Registrar novo atendimento</h3>
            <p className="text-teal-50/80 text-sm mt-0.5">
              Abra rapidamente um novo atendimento médico ocupacional.
            </p>
          </div>
          <Link href="/operacional/atendimentos/novo">
            <Button variant="secondary" className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-6 h-10 rounded-full shrink-0">
              <Plus size={16} className="mr-2" />
              Novo Atendimento
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}