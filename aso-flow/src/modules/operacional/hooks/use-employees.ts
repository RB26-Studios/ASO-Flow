import { useQuery } from "@tanstack/react-query"
import { getEmployeesAction } from "../services/employeeService"

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await getEmployeesAction()

      if (response && "error" in response) {
        throw new Error(response.error as string)
      }

      return response as any[]
    },
  })
}
