import React from "react"
import { ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react"
import { Claim } from "@/services/claims"

interface SimilarityWidgetProps {
  claim?: Claim | null
}

export default function SimilarityWidget({ claim }: SimilarityWidgetProps) {
  // Predeterminado para Alejandro Mendoza (si no se proporciona la prop claim)
  const defaultSimilarity = {
    matchedCaseId: "SHM-1120",
    percentage: 94,
    originalNarrative: "El día 5 de enero me encontraba estacionado fuera del centro comercial cuando otro vehículo de color gris retrocedió rápidamente y me impactó en la parte delantera izquierda. El conductor se dio a la fuga de inmediato. No hubo testigos...",
    matchedText: "estacionado fuera del centro comercial cuando otro vehículo de color gris retrocedió rápidamente y me impactó en la parte delantera izquierda. El conductor se dio a la fuga de inmediato. No hubo testigos"
  }

  const activeClaim = claim || {
    id: "SHM-8924",
    narrative: "El día 5 de mayo me encontraba estacionado fuera del centro comercial cuando otro vehículo de color gris retrocedió rápidamente y me impactó en la parte delantera izquierda. El conductor se dio a la fuga de inmediato. No hubo testigos y me percaté del golpe minutos después al regresar a mi vehículo.",
    similarity: defaultSimilarity
  }

  const similarity = activeClaim.similarity

  // Función inteligente para resaltar los textos que coinciden en el NLP
  const highlightText = (fullText: string, search: string, isHistoric = false) => {
    if (!search || !fullText || !fullText.includes(search)) {
      return fullText
    }
    const index = fullText.indexOf(search)
    const before = fullText.substring(0, index)
    const matched = fullText.substring(index, index + search.length)
    const after = fullText.substring(index + search.length)
    
    return (
      <>
        {before}
        <span className={`px-1 py-0.5 rounded-sm font-bold border-b-2 ${
          isHistoric
            ? "bg-rose-100 text-rose-950 border-rose-600"
            : "bg-rose-100 text-rose-950 border-rose-500"
        }`}>
          {matched}
        </span>
        {after}
      </>
    )
  }

  // Si no hay coincidencia lingüística de plagio detectada por la IA
  if (!similarity) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-sm">
        
        {/* Cabecera del Widget Limpio */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-brand-navy">Integridad Lingüística (NLP)</h3>
          </div>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm">
            100% Original
          </span>
        </div>

        {/* Caja de certificado verde */}
        <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-md flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider">Integridad de Narrativa Aprobada</h4>
            <p className="text-[11px] text-brand-navy font-medium leading-relaxed">
              El motor de lenguaje natural (NLP) BERT ha evaluado la declaración de hechos. No se encontraron similitudes semánticas o plagios con ningún siniestro histórico en nuestra base de datos nacional de reclamos.
            </p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-bold text-right">
          <span>Modelo: BERT-Semantic-Matcher-v3</span>
        </div>

      </div>
    )
  }

  // Si hay coincidencia de plagio
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
      
      {/* Cabecera del Widget */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          <h3 className="text-sm font-bold text-brand-navy">Similitud Lingüística y Plagio (NLP)</h3>
        </div>
        <span className="text-[10.5px] font-black text-rose-600 bg-rose-50 border-2 border-rose-500 px-3 py-1 rounded-md animate-pulse">
          {similarity.percentage}% de similitud con Caso #{similarity.matchedCaseId.split("-")[1]}
        </span>
      </div>

      <div className="p-4 bg-rose-50/30 border border-rose-200 rounded-md space-y-1.5">
        <p className="text-[11px] text-brand-navy font-semibold leading-relaxed">
          <strong>Alerta de Duplicidad de Narrativa:</strong> El motor de lenguaje natural (NLP) identificó un patrón de redacción de coincidencia severa del {similarity.percentage}% con el siniestro de fraude confirmado <strong>{similarity.matchedCaseId}</strong> (Histórico).
        </p>
      </div>

      {/* Grid de Comparativa lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Caso Actual */}
        <div className="border border-slate-200 rounded-md p-4 bg-slate-50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Caso Actual ({activeClaim.id})
            </span>
            <span className="text-[9px] bg-brand-navy/5 text-brand-navy px-2 py-0.5 rounded-md font-bold font-mono">
              Borrador
            </span>
          </div>
          <div className="text-[11px] leading-relaxed font-semibold text-brand-navy text-justify bg-white p-3 border border-slate-200 rounded-md">
            {highlightText(activeClaim.narrative, similarity.matchedText, false)}
          </div>
        </div>

        {/* Caso Histórico */}
        <div className="border border-rose-200 rounded-md p-4 bg-rose-50/20 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
              Caso Confirmado ({similarity.matchedCaseId})
            </span>
            <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-md font-black font-mono">
              FRAUDE
            </span>
          </div>
          <div className="text-[11px] leading-relaxed font-semibold text-rose-950 text-justify bg-white p-3 border border-rose-200 rounded-md">
            {highlightText(similarity.originalNarrative, similarity.matchedText, true)}
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center text-[10.5px] text-slate-400 font-bold pt-1">
        <span>Modelo: BERT-Semantic-Matcher-v3</span>
        <span className="text-brand-blue flex items-center gap-0.5 cursor-not-allowed">
          Ver reporte comparativo
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

    </div>
  )
}
