import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ClipboardList, Edit } from "lucide-react"

import { getJobRoleByIdAction } from "@/src/modules/operacional/services/jobRoleService"
import { getExamProtocolsByJobRoleAction } from "@/src/modules/operacional/services/examProtocolService"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

export const metadata: Metadata = {
  title: "Visualizar Protocolo | ASO Flow",
}

export default async function VisualizarProtocoloPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [jobRole, protocols] = await Promise.all([
    getJobRoleByIdAction(id),
    getExamProtocolsByJobRoleAction(id)
  ])

  if (!jobRole) notFound()

  const validProtocols = Array.isArray(protocols) ? protocols : []

  return (
    <div className="max-w-5xl mx-auto space-y-6 w-full p-4">
      <Link href="/operacional/protocolos">
        <Button variant="ghost" className="mb-2 pl-0 hover:bg-white/10 hover:cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Protocolos
        </Button>
      </Link>

      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ClipboardList className="w-8 h-8 text-blue-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Protocolo: {jobRole.title}</h1>
            <p className="text-muted-foreground">
              Exames e periodicidades definidos para este cargo.
            </p>
          </div>
        </div>

        <Link href={`/operacional/protocolos/${id}/editar`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar Protocolo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exames Exigidos</CardTitle>
        </CardHeader>
        <CardContent>
          {validProtocols.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Tipo de Exame</TableHead>
                    <TableHead>Periodicidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validProtocols.map((p, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{p.procedures?.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {p.exam_type.charAt(0) + p.exam_type.slice(1).toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {p.periodic_months ? `${p.periodic_months} meses` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-slate-400">
              Nenhum exame configurado para este cargo.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
