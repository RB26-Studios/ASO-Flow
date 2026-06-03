import { notFound } from "next/navigation"
import { getInvoiceByIdAction } from "@/src/modules/financeiro/services/invoiceService"
import { getOrganizationAction } from "@/src/modules/admin/services/organizationService"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { PrintButton } from "@/src/modules/financeiro/components/print-button"

const EXAM_TYPE_LABELS: Record<string, string> = {
  ADMISSIONAL: "Admissional",
  PERIODICO: "Periódico",
  DEMISSIONAL: "Demissional",
  RETORNO: "Retorno ao Trabalho",
  MUDANCA: "Mudança de Função",
}

export default async function ImprimirFaturaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceByIdAction(id)
  const organization = await getOrganizationAction()

  if (!invoice || !organization) {
    notFound()
  }

  const dueDateObj = new Date(invoice.due_date)
  const dueDateLocal = new Date(dueDateObj.getTime() + dueDateObj.getTimezoneOffset() * 60000)
  const formattedDueDate = dueDateLocal.toLocaleDateString("pt-BR")

  const [year, month] = invoice.reference_month.split("-")
  const formattedRefMonth = `${month}/${year}`

  const amountFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(invoice.total_amount)

  const issueDateFormatted = invoice.issue_date
    ? (() => {
        const d = new Date(invoice.issue_date)
        const local = new Date(d.getTime() + d.getTimezoneOffset() * 60000)
        return local.toLocaleDateString("pt-BR")
      })()
    : new Date().toLocaleDateString("pt-BR")

  // Agrupamento de ASOs por Tipo de Exame
  const examStats: Record<string, number> = {}
  
  if (invoice.clinical_records) {
    invoice.clinical_records.forEach((record: any) => {
      const type = record.exam_type || "Outros"
      examStats[type] = (examStats[type] || 0) + 1
    })
  }

  const totalRecords = invoice.clinical_records?.length || 0

  return (
    <>
      {/* Estilos específicos para impressão */}
      <style>{`
        @media print {
          /* Esconder header, sidebar, footer do layout principal */
          header, footer, nav, aside,
          [data-sidebar], [data-sidebar-trigger],
          .print\\:hidden {
            display: none !important;
          }
          
          /* Garantir que o conteúdo ocupe toda a página */
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Forçar fundo branco */
          .print-area {
            background: white !important;
            color: black !important;
            padding: 20mm !important;
            max-width: 100% !important;
            margin: 0 !important;
          }

          /* Evitar quebra de página no meio de tabelas */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="bg-white text-black min-h-screen print:p-0 font-sans">
        {/* Botão de impressão (oculto na impressão) */}
        <div className="max-w-4xl mx-auto px-8 pt-6">
          <PrintButton />
        </div>

        {/* Área impressível */}
        <div className="print-area max-w-4xl mx-auto p-8 print:p-0">
          
          {/* Cabeçalho da Fatura */}
          <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider">{organization.trade_name}</h1>
              <p className="text-sm mt-1 text-gray-600">{organization.corporate_name}</p>
              <p className="text-sm text-gray-600">CNPJ: {organization.cnpj}</p>
              {organization.tech_responsible_name && (
                <p className="text-sm text-gray-500 mt-1">
                  Resp. Técnico: {organization.tech_responsible_name}
                  {organization.tech_responsible_register ? ` — ${organization.tech_responsible_register}` : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Fatura de Serviços</h2>
              <p className="text-sm mt-1 font-semibold text-gray-600">Nº {id.split("-")[0].toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">Emissão: {issueDateFormatted}</p>
            </div>
          </div>

          {/* Dados do Cliente e Fatura */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Faturado para (Tomador)</h3>
              <p className="font-bold text-lg">{invoice.clients?.trade_name}</p>
              <p className="text-sm mt-1">CNPJ: {invoice.clients?.cnpj}</p>
            </div>
            
            <div className="border border-gray-300 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Mês Ref.</p>
                  <p className="font-semibold">{formattedRefMonth}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Vencimento</p>
                  <p className="font-bold text-red-600">{formattedDueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Qtd. Exames</p>
                  <p className="font-semibold">{totalRecords}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Valor Total</p>
                  <p className="text-2xl font-bold">{amountFormatted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Estatístico */}
          <div className="mb-10">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Resumo dos Serviços Prestados</h3>
            {Object.keys(examStats).length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {Object.entries(examStats).map(([type, count]) => (
                  <div key={type} className="bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
                    <span className="font-bold">{count}</span> x{" "}
                    <span className="text-gray-700">{EXAM_TYPE_LABELS[type] || type}</span>
                  </div>
                ))}
                <div className="bg-gray-800 text-white px-4 py-2 rounded-md">
                  <span className="font-bold">{totalRecords}</span> x <span>Total de Exames</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum serviço computado.</p>
            )}
          </div>

          {/* Lista Analítica (Espelho) */}
          <div className="mb-8">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Relatório Analítico (Atendimentos Ocupacionais)</h3>
            
            {invoice.clinical_records && invoice.clinical_records.length > 0 ? (
              <Table className="border text-sm">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="font-bold text-black border-r w-[40px]">#</TableHead>
                    <TableHead className="font-bold text-black border-r">Data</TableHead>
                    <TableHead className="font-bold text-black border-r">Funcionário (Paciente)</TableHead>
                    <TableHead className="font-bold text-black border-r">CPF</TableHead>
                    <TableHead className="font-bold text-black">Natureza do Exame</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.clinical_records.map((record: any, index: number) => {
                    const rDateObj = new Date(record.exam_date)
                    const rDateLocal = new Date(rDateObj.getTime() + rDateObj.getTimezoneOffset() * 60000)
                    
                    return (
                      <TableRow key={record.id} className="border-b border-gray-200">
                        <TableCell className="border-r py-2 text-center text-gray-500">{index + 1}</TableCell>
                        <TableCell className="border-r py-2">{rDateLocal.toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="border-r py-2 font-medium">{record.employees?.name}</TableCell>
                        <TableCell className="border-r py-2">{record.employees?.cpf}</TableCell>
                        <TableCell className="py-2">{EXAM_TYPE_LABELS[record.exam_type] || record.exam_type}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500 italic">Lista de exames vazia ou não vinculada.</p>
            )}
          </div>

          {/* Rodapé */}
          <div className="mt-16 pt-8 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Este demonstrativo não tem valor fiscal, sendo apenas um espelho dos serviços ocupacionais prestados no período.</p>
            <p className="mt-1">Documento gerado automaticamente pelo sistema ASO Flow em {new Date().toLocaleDateString("pt-BR")}.</p>
          </div>
        </div>
      </div>
    </>
  )
}
