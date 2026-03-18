import { Metadata } from "next"
import { getOrganizationAction } from "@/src/modules/admin/services/organizationService"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { LayoutDashboard, Settings, Users, ArrowRight, Building2, Handshake, SquareActivity, DollarSign, Sparkles } from "lucide-react"
import { getSessionUser, getUserName } from "@/src/modules/auth/services/authService"

export const metadata: Metadata = {
  title: "Início | ASO Flow",
}

export default async function HomePage() {
  const organization = await getOrganizationAction()
  const user = await getSessionUser()

  const hour = new Date().getHours()
  let greeting = "Bom dia"

  if (hour >= 12 && hour < 18) {
    greeting = "Boa tarde"
  } else if (hour >= 18 || hour < 5) {
    greeting = "Boa noite"
  }

  const fullName = await getUserName() || ""
  const firstName = fullName.split(' ')[0]

  return (
    <div className="flex-1 w-full bg-slate-50/50 min-h-[calc(100vh-4rem)]">
      {/* Welcome Header */}
      <div className="relative bg-white border-b border-slate-200 overflow-hidden">
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-teal-50/50 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-emerald-600" />
                Bem-vindo de volta
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#357670] to-teal-600">{firstName}</span>!
              </h1>
              <p className="text-slate-500 text-lg max-w-xl leading-relaxed">  
                Aqui está o resumo e as ferramentas de gestão do <span className="font-semibold text-slate-700">{organization?.name || "seu sistema"}</span>.
              </p>
            </div>

            {/* Organization Badge */}
            <div className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-slate-50 rounded-xl">
                <Building2 size={24} className="text-[#357670]" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-0.5">Empresa Ativa</p>
                <p className="font-bold text-slate-800 line-clamp-1">{organization?.corporate_name || "Sem organização vinculada"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
            <LayoutDashboard size={16} />
            Seus Módulos
          </h2>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Admin Card */}
            <Link href="/admin" className="group flex">
              <div className="flex-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#357670]/30 hover:-translate-y-1 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-[#357670] group-hover:text-white transition-colors duration-300">
                    <Settings size={28} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#357670] transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Administração</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Gerencie configurações, usuários e dados base do sistema.
                </p>
              </div>
            </Link>

            {/* Comercial Card */}
            <Link href="/comercial" className="group flex">
              <div className="flex-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#357670]/30 hover:-translate-y-1 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-[#357670] group-hover:text-white transition-colors duration-300">
                    <Handshake size={28} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#357670] transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Comercial</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Gestão de clientes, contratos e tabelas de preços.
                </p>
              </div>
            </Link>

            {/* Operacional Card */}
            <Link href="/operacional" className="group flex">
              <div className="flex-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#357670]/30 hover:-translate-y-1 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-[#357670] group-hover:text-white transition-colors duration-300">
                    <SquareActivity size={28} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#357670] transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Operacional</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Agendamentos, PCMSO, exames e emissão de ASOs.
                </p>
              </div>
            </Link>

            {/* Financeiro Card */}
            <Link href="/financeiro" className="group flex">
              <div className="flex-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#357670]/30 hover:-translate-y-1 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-[#357670] group-hover:text-white transition-colors duration-300">
                    <DollarSign size={28} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#357670] transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Financeiro</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Controle de faturamento, contas a receber e cobranças.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Support CTA Footer */}
        <div className="mt-12 p-8 md:p-10 bg-gradient-to-br from-[#357670] via-[#2a5e59] to-[#1e4440] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Precisa de ajuda com a plataforma?</h3>
            <p className="text-emerald-50/90 text-md max-w-lg">
              Nossa equipe de suporte está reduzida hoje, mas você pode consultar a base de conhecimento ou abrir um chamado.
            </p>
          </div>
          <Button variant="secondary" className="relative z-10 bg-white text-[#357670] hover:bg-emerald-50 hover:scale-105 transition-all font-bold px-8 h-14 rounded-full shadow-lg">
            Acessar Suporte Técnico
          </Button>
        </div>
      </main>
    </div>
  )
}