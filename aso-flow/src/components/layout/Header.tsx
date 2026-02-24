import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import LogoImg from "@/public/Logo.png"
import { createClient } from "@/src/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  async function signOutAction() {
    'use server'
    const supabaseAction = await createClient()
    await supabaseAction.auth.signOut()
    redirect("/login")
  }

  return (
    <header className="flex items-center justify-between px-10 py-5 bg-[#357670] text-white shadow-2xl shadow-[#2a5e59]/50 border-b border-white/5">
      <div className="flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="relative w-10 h-10">
          <Link href="/home" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
            <Image src={LogoImg} alt="ASO Flow Logo" fill className="object-contain"/>
          </Link>
        </div>
    
        <span className="text-xl font-bold tracking-tight [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]">
          <Link href="/home" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
            ASO Flow
          </Link>
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Navegação */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
            Sobre
          </Link>
          <Link href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
            Suporte
          </Link>
          <Link href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
            Contato
          </Link>
        </nav>

        {/* Divisor Visual (Opcional) */}
        <div className="hidden md:block w-px h-6 bg-white/20"></div>

        {/* Área de Autenticação Condicional */}
        <div className="flex items-center gap-3">
          {user ? (
            <form action={signOutAction}>
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-semibold transition-colors rounded-md bg-red-500/80 hover:bg-red-500 text-white"
              >
                Sair
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-semibold transition-colors rounded-md hover:bg-white/10 text-white">
                Entrar
              </Link>
              
              <Link href="/register" className="px-4 py-2 text-sm font-semibold transition-colors rounded-md bg-white text-[#357670] hover:bg-emerald-50">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}