import React from "react"
import Link from "next/link"
import { Claim } from "@/services/claims"
import { RiskBadge } from "./AlertBadges"
import { ArrowRight, Eye, ShieldAlert, Sparkles } from "lucide-react"

interface ClaimTableProps {
  claims: Claim[]
  searchTerm: string
}

export default function ClaimTable({ claims, searchTerm }: ClaimTableProps) {
  // Filtrar claims por término de búsqueda (nombre, id, ramo)
  const filteredClaims = claims.filter((claim) => {
    const term = searchTerm.toLowerCase()
    return (
      claim.id.toLowerCase().includes(term) ||
      claim.insuredName.toLowerCase().includes(term) ||
      claim.line.toLowerCase().includes(term)
    )
  })

  // Formateador de moneda
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val)
  }

  // Estilo para las alertas rápidas en la tabla
  const getAlertTagStyle = (alert: string) => {
    if (alert.includes("Restrictiva") || alert.includes("Sospechosa")) {
      return "text-rose-600 border-rose-200/50 bg-rose-50/20"
    }
    if (alert.includes("Vigencia")) {
      return "text-amber-600 border-amber-200/50 bg-amber-50/20"
    }
    return "text-slate-600 border-slate-200 bg-slate-50/30"
  }

  // Lógica de Paginación (10 siniestros por página)
  const pageSize = 10
  const [currentPage, setCurrentPage] = React.useState(1)

  // Resetear a la primera página si cambia el término de búsqueda
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const totalPages = Math.ceil(filteredClaims.length / pageSize)
  const displayedClaims = filteredClaims.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        {/* min-w-[950px] garantiza que las columnas respiren de forma impecable y quepan en laptops sin scroll */}
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-[10.5px] font-bold text-brand-navy/60 uppercase tracking-wider">
              <th className="py-4 px-4 w-[11%] min-w-[110px]">ID Siniestro</th>
              <th className="py-4 px-4 w-[23%] min-w-[220px]">Asegurado</th>
              <th className="py-4 px-4 w-[12%] min-w-[120px]">Fecha Reporte</th>
              <th className="py-4 px-4 text-right w-[14%] min-w-[130px]">Monto Reclamado</th>
              <th className="py-4 px-4 w-[23%] min-w-[220px]">Alertas Rápidas (IA)</th>
              <th className="py-4 px-4 text-center w-[10%] min-w-[120px]">Riesgo</th>
              <th className="py-4 px-4 text-center w-[7%] min-w-[90px]">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedClaims.length > 0 ? (
               displayedClaims.map((claim) => (
                <tr 
                  key={claim.id} 
                  className="hover:bg-slate-50/40 transition-colors duration-200 group"
                >
                  {/* ID Siniestro */}
                  <td className="py-4 px-4 font-mono text-xs font-bold text-brand-navy">
                    {claim.id}
                  </td>
                  
                  {/* Asegurado */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-brand-navy">
                        {claim.insuredName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {claim.line} • Póliza: {claim.policyNumber}
                      </span>
                    </div>
                  </td>
 
                  {/* Fecha Reporte */}
                  <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                    {claim.reportDate}
                  </td>
 
                  {/* Monto Reclamado */}
                  <td className="py-4 px-4 text-right text-sm font-bold text-brand-navy">
                    {formatCurrency(claim.amount)}
                  </td>
 
                  {/* Alertas Rápidas */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {claim.alerts && claim.alerts.length > 0 ? (
                        claim.alerts.map((alert, index) => (
                          <span 
                            key={index} 
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${getAlertTagStyle(alert)} text-[9px] font-black uppercase tracking-wider`}
                          >
                            <span className="w-1.2 h-1.2 rounded-full bg-current shrink-0" />
                            {alert}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-black text-emerald-600 bg-emerald-50/30 border-emerald-100 uppercase tracking-wider">
                          <span className="w-1.2 h-1.2 rounded-full bg-current shrink-0" />
                          Sin alertas
                        </span>
                      )}
                    </div>
                  </td>
 
                  {/* Semáforo Dinámico */}
                  <td className="py-4 px-4 text-center">
                    <RiskBadge score={claim.riskScore} />
                  </td>
 
                  {/* Acciones */}
                  <td className="py-4 px-4 text-center">
                    <Link
                      href={`/caso/${claim.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold text-brand-blue hover:text-white border border-brand-blue/15 hover:bg-brand-blue transition-all duration-300"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Auditar</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ShieldAlert className="w-10 h-10 text-slate-300" />
                    <span className="text-sm font-medium">No se encontraron siniestros que coincidan con la búsqueda.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Barra de Paginación Elegante (Solo si hay más de 1 página) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs font-medium text-slate-500">
          <div>
            Mostrando <span className="font-bold text-brand-navy">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-brand-navy">{Math.min(currentPage * pageSize, filteredClaims.length)}</span> de <span className="font-bold text-brand-navy">{filteredClaims.length}</span> siniestros
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded-none font-bold text-[10.5px] uppercase tracking-wider transition-all select-none ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-brand-navy border-slate-200 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              Anterior
            </button>
            
            {/* Números de Página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-none font-bold text-[10.5px] flex items-center justify-center border transition-all select-none cursor-pointer ${
                  currentPage === page
                    ? "bg-brand-blue text-white border-transparent shadow-sm"
                    : "bg-white text-brand-navy border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded-none font-bold text-[10.5px] uppercase tracking-wider transition-all select-none ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-brand-navy border-slate-200 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
