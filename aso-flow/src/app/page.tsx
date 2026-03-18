import { checkDatabaseConnection } from "@/src/server/db/test-connection"
import { Button } from "../components/ui/button"
import Link from "next/link"
import { Database, ShieldCheck, ArrowRight, CheckCircle2, Stethoscope, BriefcaseMedical } from "lucide-react"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"

export default async function Home() {
  const status = await checkDatabaseConnection()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center">
        {/* Modern Hero Section */}
        <section className="w-full px-6 py-20 md:py-32 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#357670] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm border border-emerald-200">
              <ShieldCheck size={16} />
              Gestão de Saúde Ocupacional simplificada
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              O futuro da medicina do <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#357670] to-teal-500">trabalho</span>
            </h1>
            
            <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              A plataforma definitiva para clínicas de saúde ocupacional. Automatize processos, gerencie exames e emita ASOs com agilidade e segurança.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 bg-[#357670] hover:bg-[#2a5e59] text-white font-bold text-lg rounded-full shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1 hover:shadow-emerald-900/40 group">
                  Acessar Sistema
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-full hover:bg-slate-100 hover:border-slate-300 transition-all">
                  Criar minha conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white">
              <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl mb-4">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Exames e ASOs</h3>
              <p className="text-slate-600">Emissão rápida de Atestados de Saúde Ocupacional com controle rigoroso de vencimentos e periodicidade.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white">
              <div className="p-4 bg-teal-100 text-teal-700 rounded-2xl mb-4">
                <BriefcaseMedical size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gestão de PCMSO</h3>
              <p className="text-slate-600">Organize os programas de controle médico por empresa, setor e cargo de forma estruturada e automatizada.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white">
              <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Financeiro Integrado</h3>
              <p className="text-slate-600">Faturamento simplificado, controle de recebimentos e geração de faturas atreladas aos procedimentos realizados.</p>
            </div>
          </div>
        </section>

        {/* System Status Banner */}
        <section className="w-full py-12 bg-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-8 text-center">Status do Ambiente</h2>
            
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={16} className={status.success ? 'text-emerald-500' : 'text-red-500'} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Bank Connection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${status.success ? 'text-emerald-600' : 'text-red-600'}`}>
                    {status.success ? 'Online' : 'Offline'}
                  </span>
                  <div className={`h-2.5 w-2.5 rounded-full ${status.success ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                </div>
              </div>
              
              <div className="p-5">
                <p className={`text-sm font-medium ${status.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {status.message}
                </p>
                {status.user && (
                  <div className="mt-4 p-3 bg-slate-900 rounded-lg flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono">user@db:</span>
                    <code className="text-emerald-400 text-xs font-mono">
                      {status.user}
                    </code>
                  </div>
                )}
                {!status.success && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs text-red-700 font-medium leading-relaxed">
                      ⚠️ Erro de configuração: Verifique as variáveis de ambiente no arquivo <span className="font-bold">.env.local</span> para garantir que as credenciais do Supabase estejam corretas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}