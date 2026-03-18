import { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  PiggyBank,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"

export const metadata: Metadata = {
  title: "Financeiro | ASO Flow",
}

const navCards = [
  {
    href: "/financeiro/faturas",
    icon: FileText,
    title: "Faturas",
    description:
      "Consulte, emita e gerencie todas as faturas de clientes. Acompanhe o status de pagamento.",
    badge: "Principal",
    color: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-700",
    iconBg: "bg-green-50",
  },
]

export default async function FinanceiroPage() {
  return (
    <div className="flex-1 w-full">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign size={28} className="text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Módulo Financeiro
              </h1>
              <p className="text-zinc-500 mt-0.5 text-sm">
                Controle de faturas, recebimentos e saúde financeira
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
                Faturas Emitidas
              </CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-4 w-4 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Total no sistema</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Pagas
              </CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Faturas liquidadas</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Pendentes
              </CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-900">—</div>
              <p className="text-xs text-zinc-400 mt-1">Aguardando pagamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Funcionalidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {navCards.map(({ href, icon: Icon, title, description, badge, color, iconColor, iconBg }) => (
              <Link key={href} href={href} className="group">
                <div
                  className={`h-full p-6 bg-gradient-to-br ${color} rounded-xl border border-zinc-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-green-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${iconBg} rounded-xl ${iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex items-center gap-2">
                      {badge && (
                        <Badge variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      )}
                      <ArrowRight size={18} className="text-zinc-300 group-hover:text-green-700 transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-800 mb-1">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                </div>
              </Link>
            ))}

            {/* Placeholder */}
            <div className="p-6 bg-white/60 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center text-center opacity-60 min-h-[160px]">
              <TrendingUp size={28} className="text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-400">Em Breve</p>
              <p className="text-xs text-zinc-400 mt-1">Relatórios Financeiros</p>
            </div>

            <div className="p-6 bg-white/60 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center text-center opacity-60 min-h-[160px]">
              <PiggyBank size={28} className="text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-400">Em Breve</p>
              <p className="text-xs text-zinc-400 mt-1">Contas a Pagar / Receber</p>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="p-6 bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Emitir nova fatura</h3>
            <p className="text-green-50/80 text-sm mt-0.5">
              Crie rapidamente uma fatura para um cliente e envie para aprovação.
            </p>
          </div>
          <Link href="/financeiro/faturas/nova">
            <Button variant="secondary" className="bg-white text-green-700 hover:bg-green-50 font-bold px-6 h-10 rounded-full shrink-0">
              <Plus size={16} className="mr-2" />
              Nova Fatura
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
