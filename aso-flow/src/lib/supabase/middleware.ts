import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cria o cliente Supabase para o Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  //Busca o usuário atual validando o token da sessão
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  //Define quais são as rotas protegidas (ex: as suas pastas /(dashboard)/admin e /(dashboard)/home)
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/home') 
  
  //REGRA DE BLOQUEIO: Se NÃO há usuário logado E tenta entrar numa rota protegida
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/' 
    return NextResponse.redirect(url)
  }

  //REGRA EXTRA: Impede um usuário logado de acessar a tela de login e cadastro.
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}