import { checkDatabaseConnection } from "@/src/server/db/test-connection"
import { Button } from "../components/ui/button"
import Link from "next/link"


export default async function Home() {
  // Chamada direta ao Backend (Server Action/Function)
  const status = await checkDatabaseConnection()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">ASO Flow</h1>
      <div className={`p-4 rounded border ${status.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
        <h2 className="font-bold text-black">Status do Banco de Dados:</h2>
        <p className="text-green-800">{status.message}</p>
        <p className="text-sm text-gray-600">{status.user}</p>
      </div>
      
      {!status.success && (
        <p className="text-red-500">Verifique seu arquivo .env.local</p>
      )}
      <div className="flex flex-grid gap-4 items-center justify-center">
      <div className="flex gap-4 items-center justify-center">
          <Link href="/login">
            <Button className="w-full font-bold">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="w-full font-bold">
              Cadastro
            </Button>
          </Link>
        </div>

      </div>

    </div>
  )
}