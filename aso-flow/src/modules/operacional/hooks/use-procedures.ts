import { useQuery } from "@tanstack/react-query"
import { getProceduresAction } from "../services/procedureService" 

export function useProcedures() {
  return useQuery({
    queryKey: ["procedures"],
    queryFn: async () => {
      const response = await getProceduresAction()
      
      // 1. Se o backend retornar um erro, nós "jogamos" (throw) o erro
      // Isso faz o React Query ativar a variável `isError` lá na sua página automaticamente!
      if (response && 'error' in response) {
        throw new Error(response.error as string)
      }
      
      // 2. Se não tem erro, retornamos os dados ou um array vazio
      return response as any[] 
    },
  })
}