import Image from "next/image"
import LogoImg from "@/public/Logo.png"

export function Header() {
  return (
    <header className="flex items-center justify-between px-10 py-5 bg-[#357670] text-white shadow-2xl shadow-[#2a5e59]/50 border-b border-white/5">
      <div className="flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="relative w-10 h-10">
          <Image 
            src={LogoImg} 
            alt="ASO Flow Logo" 
            fill 
            className="object-contain"
          />
        </div>
    
        <span className="text-xl font-bold tracking-tight [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]">
          ASO Flow
        </span>
      </div>

      {/* Navegação */}
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        <a href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
          Sobre
        </a>
        <a href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
          Suporte
        </a>
        <a href="#" className="transition-all hover:text-emerald-200 opacity-80 hover:opacity-100">
          Contato
        </a>
      </nav>
    </header>
  )
}