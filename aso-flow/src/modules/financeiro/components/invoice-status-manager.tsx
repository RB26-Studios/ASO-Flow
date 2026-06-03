"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { toast } from "sonner"
import {
  CheckCircle2,
  Send,
  Ban,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react"
import { updateInvoiceStatusAction, deleteInvoiceAction } from "../services/invoiceService"

type InvoiceStatus = "RASCUNHO" | "EMITIDA" | "PAGA" | "CANCELADA"

interface InvoiceStatusManagerProps {
  invoiceId: string
  currentStatus: InvoiceStatus
}

const STATUS_CONFIG: Record<InvoiceStatus, {
  label: string
  color: string
  icon: React.ReactNode
  nextActions: { status: InvoiceStatus; label: string; icon: React.ReactNode; variant: "default" | "outline" | "destructive" }[]
}> = {
  RASCUNHO: {
    label: "Rascunho",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: <FileText className="h-4 w-4" />,
    nextActions: [
      { status: "EMITIDA", label: "Emitir Fatura", icon: <Send className="h-4 w-4 mr-2" />, variant: "default" },
      { status: "CANCELADA", label: "Cancelar", icon: <Ban className="h-4 w-4 mr-2" />, variant: "destructive" },
    ],
  },
  EMITIDA: {
    label: "Emitida",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Send className="h-4 w-4" />,
    nextActions: [
      { status: "PAGA", label: "Registrar Pagamento", icon: <CheckCircle2 className="h-4 w-4 mr-2" />, variant: "default" },
      { status: "CANCELADA", label: "Cancelar", icon: <Ban className="h-4 w-4 mr-2" />, variant: "destructive" },
    ],
  },
  PAGA: {
    label: "Paga",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
    nextActions: [], // Status final
  },
  CANCELADA: {
    label: "Cancelada",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <Ban className="h-4 w-4" />,
    nextActions: [], // Status final
  },
}

// Fluxo de status visual para mostrar ao usuário
const STATUS_FLOW: InvoiceStatus[] = ["RASCUNHO", "EMITIDA", "PAGA"]

export function InvoiceStatusManager({ invoiceId, currentStatus }: InvoiceStatusManagerProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState<InvoiceStatus | null>(null)

  const config = STATUS_CONFIG[currentStatus]

  async function handleStatusChange(newStatus: InvoiceStatus) {
    setIsUpdating(true)
    try {
      const result = await updateInvoiceStatusAction(invoiceId, newStatus)

      if (result.error) {
        toast.error(result.error)
      } else {
        const statusLabel = STATUS_CONFIG[newStatus].label
        toast.success(`Fatura atualizada para "${statusLabel}" com sucesso!`)
        router.refresh()
      }
    } catch {
      toast.error("Erro inesperado ao atualizar o status.")
    } finally {
      setIsUpdating(false)
      setShowConfirm(null)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteInvoiceAction(invoiceId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Fatura excluída com sucesso!")
        router.push("/financeiro/faturas")
      }
    } catch {
      toast.error("Erro inesperado ao excluir a fatura.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status atual + indicador visual de progresso */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Situação Atual</span>
      </div>

      {/* Barra de progresso visual do status */}
      <div className="flex items-center gap-1">
        {STATUS_FLOW.map((status, index) => {
          const isActive = status === currentStatus
          const isPassed = STATUS_FLOW.indexOf(currentStatus) > index
          const isCancelled = currentStatus === "CANCELADA"

          let dotColor = "bg-zinc-200"
          if (isCancelled) {
            dotColor = "bg-red-200"
          } else if (isActive) {
            dotColor = STATUS_CONFIG[status].color.split(" ")[0]
          } else if (isPassed) {
            dotColor = "bg-emerald-400"
          }

          return (
            <div key={status} className="flex items-center gap-1 flex-1">
              <div className={`flex flex-col items-center flex-1`}>
                <div className={`h-2.5 w-full rounded-full transition-all ${dotColor}`} />
                <span className={`text-[10px] mt-1 ${isActive ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                  {STATUS_CONFIG[status].label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Badge do status atual */}
      <div className="flex items-center justify-center mt-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold border ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Botões de ação baseados no status atual */}
      {config.nextActions.length > 0 && (
        <div className="pt-3 border-t space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações Disponíveis</span>
          
          {config.nextActions.map((action) => (
            <div key={action.status}>
              {showConfirm === action.status ? (
                <div className="flex flex-col gap-2 p-3 bg-zinc-50 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm font-medium text-center">
                    {action.variant === "destructive"
                      ? "Tem certeza que deseja cancelar esta fatura?"
                      : `Confirma a alteração para "${STATUS_CONFIG[action.status].label}"?`
                    }
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowConfirm(null)}
                      disabled={isUpdating}
                    >
                      Não
                    </Button>
                    <Button
                      variant={action.variant}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(action.status)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, confirmar"}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant={action.variant}
                  className="w-full"
                  onClick={() => setShowConfirm(action.status)}
                  disabled={isUpdating}
                >
                  {action.icon}
                  {action.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botão de Excluir (apenas para Rascunho) */}
      {currentStatus === "RASCUNHO" && (
        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Excluir Fatura
          </Button>
        </div>
      )}
    </div>
  )
}
