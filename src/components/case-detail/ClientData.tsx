import React, { useState, useEffect } from "react"
import { FileText, User, FileCheck, CheckCircle2, XCircle, Clock, DollarSign, Layers } from "lucide-react"
import { Claim } from "@/services/claims"

interface ClientDataProps {
  claim?: Claim | null
}

export default function ClientData({ claim }: ClientDataProps) {
  // Inicialización del checklist de documentos con fallback
  const getInitialDocs = (activeClaim: Claim | null | undefined) => {
    if (activeClaim?.documents && activeClaim.documents.length > 0) {
      return activeClaim.documents.map(doc => ({
        name: doc.name,
        uploaded: doc.uploaded,
        status: doc.uploaded ? "Entregado" : "Faltante / Ilegible"
      }))
    }
    return [
      { name: "Póliza de Vehículo (Vigente)", uploaded: true, status: "Entregado" },
      { name: "Cédula de Identidad (Asegurado)", uploaded: true, status: "Entregado" },
      { name: "Denuncia de Tránsito Certificada", uploaded: true, status: "Entregado" },
      { name: "Factura de Taller Autorizado", uploaded: false, status: "Faltante / Ilegible" },
      { name: "Fotos del Siniestro (Alta Definición)", uploaded: true, status: "Entregado" },
    ]
  }

  const [documents, setDocuments] = useState(() => getInitialDocs(claim))

  // Sincronizar estado cuando el claim cambie dinámicamente
  useEffect(() => {
    setDocuments(getInitialDocs(claim))
  }, [claim])

  // Función interactiva para auditar o marcar documentos en tiempo real
  const toggleDocument = (index: number) => {
    const updated = [...documents]
    updated[index].uploaded = !updated[index].uploaded
    updated[index].status = updated[index].uploaded ? "Entregado" : "Faltante / Ilegible"
    setDocuments(updated)
  }

  // Fallback de datos si no hay claim (Alejandro Mendoza predeterminado)
  const defaultClaim: Partial<Claim> = {
    id: "SHM-8924",
    insuredName: "Alejandro Mendoza",
    policyNumber: "POL-VEH-2025-9981",
    line: "Vehículos",
    chassis: "9BWCA41V7EP08422",
    amount: 8400,
    narrative: "El día 5 de mayo me encontraba estacionado fuera del centro comercial cuando otro vehículo de color gris retrocedió rápidamente y me impactó en la parte delantera izquierda. El conductor se dio a la fuga de inmediato. No hubo testigos y me percaté del golpe minutos después al regresar a mi vehículo.",
    status: "Investigación",
    insuredId: "1723456789",
    cobertura: "Cobertura Integral",
    occurrenceDate: "2026-05-05",
    reportDate: "2026-05-20",
    estimatedAmount: 8000,
    paidAmount: 0,
    branch: "Guayaquil",
    documentsComplete: "No",
    daysSincePolicyStart: 3,
    daysUntilPolicyEnd: 362,
    daysBetweenOccurrenceReport: 15,
    claimHistoryCount: 2,
    simulatedFraudLabel: "Alta/Crítica"
  }

  const activeClaim = claim || (defaultClaim as Claim)

  // Formateador de moneda
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-brand-blue" />
          <h3 className="text-sm font-bold text-brand-navy">Expediente del Siniestro y Asegurado</h3>
        </div>
        <span className="text-[10px] bg-slate-100 border border-slate-200 text-brand-navy font-mono font-bold px-2 py-0.5 rounded-sm">
          {activeClaim.id}
        </span>
      </div>

      {/* GRID DE DATOS DUROS (Organizado por las 20 variables de la base de datos) */}
      <div className="space-y-4">
        
        {/* BLOQUE A: IDENTIFICACIÓN Y PÓLIZA */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block flex items-center gap-1 border-b border-slate-100 pb-0.5">
            <Layers className="w-3.5 h-3.5" />
            Identificación y Póliza
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* beneficiario */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">beneficiario</span>
              <p className="text-xs font-bold text-brand-navy">{activeClaim.insuredName}</p>
            </div>

            {/* id_asegurado */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">id_asegurado</span>
              <p className="text-xs font-mono font-bold text-brand-navy">{activeClaim.insuredId || "1723456789"}</p>
            </div>

            {/* id_poliza */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">id_poliza</span>
              <p className="text-xs font-mono font-bold text-brand-navy">{activeClaim.policyNumber}</p>
            </div>

            {/* ramo */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">ramo</span>
              <p className="text-xs font-bold text-brand-navy">{activeClaim.line} (Ramo Técnico)</p>
            </div>

            {/* cobertura */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1 md:col-span-2">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">cobertura</span>
              <p className="text-xs font-semibold text-brand-navy">{activeClaim.cobertura || "Cobertura Integral"}</p>
            </div>
            
          </div>
        </div>

        {/* BLOQUE B: HISTORIAL Y TIEMPOS */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block flex items-center gap-1 border-b border-slate-100 pb-0.5">
            <Clock className="w-3.5 h-3.5" />
            Cronología y Tiempos
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            
            {/* fecha_ocurrencia */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">fecha_ocurrencia</span>
              <p className="text-xs font-semibold text-brand-navy">{activeClaim.occurrenceDate || "2026-05-05"}</p>
            </div>

            {/* fecha_reporte */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">fecha_reporte</span>
              <p className="text-xs font-semibold text-brand-navy">{activeClaim.reportDate}</p>
            </div>

            {/* sucursal */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">sucursal</span>
              <p className="text-xs font-bold text-brand-navy">{activeClaim.branch || "Guayaquil"}</p>
            </div>

            {/* historial_siniestros_asegurado */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">historial_siniestros</span>
              <p className="text-xs font-bold text-rose-600">{activeClaim.claimHistoryCount !== undefined ? activeClaim.claimHistoryCount : 2} reportados</p>
            </div>

            {/* dias_desde_inicio_poliza */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">dias_inicio_poliza</span>
              <p className="text-xs font-mono font-bold text-brand-navy">{activeClaim.daysSincePolicyStart !== undefined ? activeClaim.daysSincePolicyStart : 3} días</p>
            </div>

            {/* dias_desde_fin_poliza */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">dias_fin_poliza</span>
              <p className="text-xs font-mono font-bold text-brand-navy">{activeClaim.daysUntilPolicyEnd !== undefined ? activeClaim.daysUntilPolicyEnd : 362} días</p>
            </div>

            {/* dias_entre_ocurrencia_reporte */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1 col-span-2">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block leading-none mb-0.5">dias_ocurrencia_reporte</span>
              <p className="text-xs font-mono font-bold text-brand-navy">{activeClaim.daysBetweenOccurrenceReport !== undefined ? activeClaim.daysBetweenOccurrenceReport : 15} días transcurridos</p>
            </div>
            
          </div>
        </div>

        {/* BLOQUE C: VALORES FINANCIEROS */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block flex items-center gap-1 border-b border-slate-100 pb-0.5">
            <DollarSign className="w-3.5 h-3.5" />
            Análisis Financiero de Reclamación
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* monto_reclamado */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">monto_reclamado</span>
              <p className="text-xs font-black text-brand-navy">{formatCurrency(activeClaim.amount)}</p>
            </div>

            {/* monto_estimado */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">monto_estimado</span>
              <p className="text-xs font-black text-slate-500">{formatCurrency(activeClaim.estimatedAmount || activeClaim.amount - 400)}</p>
            </div>

            {/* monto_pagado */}
            <div className="p-3 bg-slate-50/50 rounded-md border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">monto_pagado</span>
              <p className="text-xs font-black text-emerald-600">{formatCurrency(activeClaim.paidAmount || 0)}</p>
            </div>
            
          </div>
        </div>

      </div>

      {/* Narrativa Original del Asegurado (descripcion) */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          descripcion (Declaración de Hechos)
        </span>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs leading-relaxed font-semibold text-brand-navy text-justify">
          "{activeClaim.narrative}"
        </div>
      </div>

      {/* Checklist de Documentación Requerida */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-brand-lightBlue" />
          Checklist de Requisitos y Documentos Entregados
        </span>
        <p className="text-[10px] text-slate-400 font-medium">Haz clic en cada fila para alternar el estado de verificación del documento:</p>
        
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
          {documents.map((doc, idx) => (
            <div 
              key={idx}
              onClick={() => toggleDocument(idx)}
              className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer select-none transition-colors duration-200"
            >
              <span className="text-xs font-semibold text-brand-navy">{doc.name}</span>
              <div className="flex items-center gap-1.5">
                {doc.uploaded ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {doc.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-pulse">
                    <XCircle className="w-3 h-3 text-rose-400" /> {doc.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
