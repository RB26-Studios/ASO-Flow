import { createClient } from "@/src/lib/supabase/server"

export async function checkDatabaseConnection() {
  const supabase = await createClient()

  try {
    // Tenta buscar o primeiro registro da tabela 'ping'
    const { data, error } = await supabase
      .from('ping')
      .select('message')
      .single()

    if (error) {
      throw new Error(`Erro do Supabase: ${error.message}`)
    }

    return {
      success: true,
      message: data?.message || "Tabela ping vazia",
      user: "Leitura de DB: OK"
    }
  } catch (e: any) {
    return {
      success: false,
      message: "Falha na leitura do Banco de Dados.",
      error: e.message || JSON.stringify(e)
    }
  }
}