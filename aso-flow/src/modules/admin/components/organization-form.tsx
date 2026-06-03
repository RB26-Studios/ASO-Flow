'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { upsertOrganizationAction, OrganizationFormData } from "@/src/modules/admin/services/organizationService"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"

// Agora o schema é IDÊNTICO ao do Backend
const organizationSchema = z.object({
  id: z.string().optional(),
  trade_name: z.string().min(2, "O Nome Fantasia é obrigatório"),
  corporate_name: z.string().min(2, "A Razão Social é obrigatória"), // CORRIGIDO
  cnpj: z.string().min(14, "O CNPJ é obrigatório"), // CORRIGIDO
  tech_responsible_name: z.string().min(2, "O nome do Responsável Técnico é obrigatório"),
  tech_responsible_register: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo_url: z.string().optional(),
})

interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData> | null
}

export function OrganizationForm({ initialData }: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: initialData || {
      trade_name: "",
      corporate_name: "",
      cnpj: "",
      tech_responsible_name: "",
      tech_responsible_register: "",
      email: "",
      phone: "",
      address: "",
      logo_url: "",
    },
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("A imagem da logo deve ter no máximo 2MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setLogoPreview(base64String)
        setValue("logo_url", base64String, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(data: OrganizationFormData) {
    setIsLoading(true)

    const response = await upsertOrganizationAction(data)

    if (response?.error) {
      toast.error(response.error)
    } else {
      toast.success("Dados da consultoria salvos com sucesso!")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Dados da Consultoria</CardTitle>
        <CardDescription>
          Configure as informações principais da sua empresa. Estes dados aparecerão nos relatórios e ASOs.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="org-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("id")} />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Logotipo</h3>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 border rounded-md flex items-center justify-center bg-zinc-50 overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm text-muted-foreground text-center px-2">Sem Logo</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="logo_upload">Enviar nova logo</Label>
                <Input id="logo_upload" type="file" accept="image/*" onChange={handleLogoUpload} disabled={isLoading} />
                <p className="text-xs text-muted-foreground">Recomendado: PNG ou JPG com fundo transparente. Tamanho máximo 2MB.</p>
                {logoPreview && (
                   <Button type="button" variant="outline" size="sm" onClick={() => {
                     setLogoPreview(null)
                     setValue("logo_url", "", { shouldDirty: true })
                   }} className="mt-2 text-red-500 hover:text-red-700">Remover Logo</Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Identidade da Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="trade_name">Nome Fantasia *</Label>
                <Input id="trade_name" placeholder="Ex: ASO Flow Saúde" {...register("trade_name")} disabled={isLoading} />
                {errors.trade_name && <span className="text-sm text-red-500">{errors.trade_name.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="corporate_name">Razão Social *</Label>
                <Input id="corporate_name" placeholder="Ex: ASO Flow LTDA" {...register("corporate_name")} disabled={isLoading} />
                {errors.corporate_name && <span className="text-sm text-red-500">{errors.corporate_name.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" {...register("cnpj")} disabled={isLoading} />
                {errors.cnpj && <span className="text-sm text-red-500">{errors.cnpj.message}</span>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contato e Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input id="email" type="email" placeholder="contato@empresa.com" {...register("email")} disabled={isLoading} />
                {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 0000-0000" {...register("phone")} disabled={isLoading} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input id="address" placeholder="Rua, Número, Bairro, Cidade - UF" {...register("address")} disabled={isLoading} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Responsabilidade Técnica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tech_responsible_name">Nome do Médico/Engenheiro *</Label>
                <Input id="tech_responsible_name" placeholder="Dr. Nome Sobrenome" {...register("tech_responsible_name")} disabled={isLoading} />
                {errors.tech_responsible_name && <span className="text-sm text-red-500">{errors.tech_responsible_name.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tech_responsible_register">Registro (CRM/CREA)</Label>
                <Input id="tech_responsible_register" placeholder="Ex: CRM-GO 12345" {...register("tech_responsible_register")} disabled={isLoading} />
              </div>
            </div>
          </div>

        </form>
      </CardContent>

      <CardFooter className="flex justify-end border-t p-6">
        <Button form="org-form" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardFooter>
    </Card>
  )
}