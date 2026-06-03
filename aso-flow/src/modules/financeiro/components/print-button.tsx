"use client"

import { Button } from "@/src/components/ui/button"
import { Printer, Download } from "lucide-react"

export function PrintButton() {
  return (
    <div className="print:hidden flex justify-end mb-8 gap-3">
      <Button
        variant="outline"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimir
      </Button>
      <Button
        onClick={() => window.print()}
        className="gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        Salvar como PDF
      </Button>
    </div>
  )
}
