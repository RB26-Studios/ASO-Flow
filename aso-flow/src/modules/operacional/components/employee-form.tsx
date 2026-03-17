'use client'

import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { upsertEmployeeAction } from "../services/employeeService"

// ── Schema (client-side mirror) ──────────────────────────────────────────────
const employeeFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  client_id: z.string().min(1, "Selecione uma empresa válida."),
  job_role_id: z.string().min(1, "Selecione um cargo válido."),
  name: z.string().min(2, "O nome completo é obrigatório."),
  cpf: z.string().min(11, "O CPF é obrigatório."),
  rg: z.string().optional().or(z.literal("")),
  birth_date: z.string().min(1, "A data de nascimento é obrigatória."),
  gender: z.enum(["M", "F"], { message: "Selecione o sexo." }),
  enrollment_number: z.string().optional().or(z.literal("")),
  admission_date: z.string().optional().or(z.literal("")),
  status: z.enum(["ATIVO", "INATIVO"]),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>

// ── Props ────────────────────────────────────────────────────────────────────
interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormValues> | null
  clients: { id: string; name: string }[]
  jobRoles: { id: string; title: string; client_id: string }[]
}

// ── Component ────────────────────────────────────────────────────────────────
export function EmployeeForm({ initialData, clients, jobRoles }: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      id: "",
      client_id: "",
      job_role_id: "",
      name: "",
      cpf: "",
      rg: "",
      birth_date: "",
      gender: undefined,
      enrollment_number: "",
      admission_date: "",
      status: "ATIVO",
      ...initialData,
    },
  })

  // Watch client_id to reactively filter job roles
  const selectedClientId = useWatch({ control, name: "client_id" })

  const filteredJobRoles = jobRoles.filter(
    (jr) => jr.client_id === selectedClientId
  )

  async function onSubmit(data: EmployeeFormValues) {
    setIsLoading(true)

    const payload = { ...data }
    if (!payload.id) delete payload.id

    const response = await upsertEmployeeAction(payload as any)

    if (response?.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    queryClient.invalidateQueries({ queryKey: ["employees"] })
    toast.success(
      initialData?.id
        ? "Funcionário atualizado com sucesso!"
        : "Funcionário cadastrado com sucesso!"
    )
    router.push("/operacional/funcionarios")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/operacional/funcionarios")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {initialData?.id ? "Editar Funcionário" : "Novo Funcionário"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="employee-form"
            onSubmit={handleSubmit(onSubmit, (errs) =>
              console.log("Erros do Zod:", errs)
            )}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input type="hidden" {...register("id")} />

            {/* Nome Completo */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input id="full_name" {...register("name")} disabled={isLoading} />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* CPF */}
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="000.000.000-00"
                disabled={isLoading}
              />
              {errors.cpf && (
                <span className="text-sm text-red-500">{errors.cpf.message}</span>
              )}
            </div>

            {/* RG */}
            <div className="grid gap-2">
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" {...register("rg")} disabled={isLoading} />
              {errors.rg && (
                <span className="text-sm text-red-500">{errors.rg.message}</span>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="grid gap-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                {...register("birth_date")}
                disabled={isLoading}
              />
              {errors.birth_date && (
                <span className="text-sm text-red-500">{errors.birth_date.message}</span>
              )}
            </div>

            {/* Sexo */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Sexo</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <span className="text-sm text-red-500">{errors.gender.message}</span>
              )}
            </div>

            {/* Empresa / Cliente */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="client_id">Empresa / Cliente</Label>
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Reset cargo when client changes
                      setValue("job_role_id", "")
                    }}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="client_id">
                      <SelectValue placeholder="Selecione uma empresa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.client_id && (
                <span className="text-sm text-red-500">{errors.client_id.message}</span>
              )}
            </div>

            {/* Cargo — filtrado pelo cliente selecionado */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="job_role_id">Cargo</Label>
              <Controller
                name="job_role_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || !selectedClientId}
                  >
                    <SelectTrigger id="job_role_id">
                      <SelectValue
                        placeholder={
                          selectedClientId
                            ? "Selecione um cargo..."
                            : "Selecione uma empresa primeiro"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredJobRoles.length === 0 ? (
                        <SelectItem value="__empty__" disabled>
                          Nenhum cargo cadastrado para esta empresa
                        </SelectItem>
                      ) : (
                        filteredJobRoles.map((jr) => (
                          <SelectItem key={jr.id} value={jr.id}>
                            {jr.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.job_role_id && (
                <span className="text-sm text-red-500">{errors.job_role_id.message}</span>
              )}
            </div>

            {/* Matrícula */}
            <div className="grid gap-2">
              <Label htmlFor="enrollment_number">Matrícula</Label>
              <Input
                id="enrollment_number"
                {...register("enrollment_number")}
                disabled={isLoading}
              />
            </div>

            {/* Data de Admissão */}
            <div className="grid gap-2">
              <Label htmlFor="admission_date">Data de Admissão</Label>
              <Input
                id="admission_date"
                type="date"
                {...register("admission_date")}
                disabled={isLoading}
              />
            </div>

            {/* Status */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <span className="text-sm text-red-500">{errors.status.message}</span>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-t p-6">
          <Button form="employee-form" type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Funcionário"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
