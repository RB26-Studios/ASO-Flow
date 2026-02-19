import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/src/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Passa o pedido HTTP para a função do Supabase fazer a validação e as renovações de cookies
  return await updateSession(request)
}

// O matcher define ONDE o middleware deve intercetar a navegação
export const config = {
  matcher: [
    /*
     * Interceta todas as rotas, exceto:
     * - _next/static (ficheiros estáticos gerados na compilação)
     * - _next/image (ficheiros otimizados pela framework)
     * - favicon.ico (ícone do separador do browser)
     * - Extensões de imagem comuns para evitar bloqueio do logótipo, por exemplo.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}