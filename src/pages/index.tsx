import React, { useEffect, useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import ClaimTable from "@/components/triage/ClaimTable"
import { claimsService, Claim } from "@/services/claims"
import { Filter, Layers, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClaims()
  }, [])

  const loadClaims = async () => {
    setLoading(true)
    try {
      const data = await claimsService.getClaims()
      setClaims(data)
      setFilteredClaims(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar claims por semáforo de riesgo y buscador
  useEffect(() => {
    let result = claims

    // Filtrado por botón de riesgo
    if (selectedRiskFilter !== "all") {
      result = result.filter((c) => c.riskLevel === selectedRiskFilter)
    }

    setFilteredClaims(result)
  }, [selectedRiskFilter, claims])

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar Lateral */}
      <Sidebar />

      {/* Panel Principal */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Header superior */}
        <Header 
          title="Bandeja de Entrada" 
          subtitle="Triaje interactivo de siniestros y auditoría ética en tiempo real" 
        />

        {/* Contenido Minimalista - pb-24 en móvil para librar la barra de navegación inferior */}
        <div className="flex-1 p-6 md:p-8 pb-24 lg:pb-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Fila de Título y Botón de Acción Principal */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-blue" />
                Siniestros Entrantes
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Audita y gestiona la integridad de los reclamos entrantes del modelo de Inteligencia Artificial
              </p>
            </div>
            
            <Link 
              href="/reportar" 
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-blue text-white rounded-md text-xs font-bold hover:bg-brand-navy group transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Reportar Siniestro</span>
            </Link>
          </div>


          {/* Fila de Filtros y Búsqueda Interactiva (Minimalista) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            
            {/* Filtros Rápidos por Semáforo de Riesgo */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Filtrar:
              </span>
              {[
                { id: "all", label: "Todos", color: "bg-slate-50 text-brand-navy border-slate-200" },
                { id: "high", label: "Rojo (Crítico)", color: "bg-rose-50 text-rose-700 border-rose-200" },
                { id: "medium", label: "Amarillo (Medio)", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { id: "low", label: "Verde (Bajo)", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedRiskFilter(btn.id as any)}
                  className={`px-3 py-1.5 rounded-md border text-[11px] font-bold transition-all duration-300 ${
                    selectedRiskFilter === btn.id 
                      ? "ring-1 ring-brand-blue border-transparent font-extrabold"
                      : "text-slate-500 border-slate-200 hover:bg-slate-50"
                  } ${selectedRiskFilter === btn.id ? btn.color : ""}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Input Buscador */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar asegurado, ID o ramo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-slate-50 border border-slate-200 text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-lightBlue focus:border-brand-lightBlue transition-all"
              />
            </div>

          </div>

          {loading ? (
            <div className="py-24 text-center bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="w-8 h-8 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mx-auto mb-4" />
              <span className="text-sm font-semibold text-slate-400">Analizando base de datos de siniestros...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <ClaimTable claims={filteredClaims} searchTerm={searchTerm} />
              
              {/* Información Complementaria Minimalista */}
              <div className="flex items-center justify-end text-[10.5px] text-slate-400 font-bold px-1">
                <span>Procesando {filteredClaims.length} siniestros filtrados</span>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
