import React, { useEffect, useState } from "react"
import { Mail, Shield, Sparkles, FileSearch, BrainCircuit } from "lucide-react"
import GoogleIcon from "@/components/icons/GoogleIcon"

const STEPS = [
  {
    icon: Mail,
    label: "Conectando con Gmail",
    detail: "Verificando permisos de lectura y envío…",
  },
  {
    icon: FileSearch,
    label: "Escaneando bandeja",
    detail: "Buscando correos con siniestros y adjuntos PDF…",
  },
  {
    icon: BrainCircuit,
    label: "Auditoría antifraude",
    detail: "La IA evalúa señales de riesgo en cada expediente…",
  },
  {
    icon: Sparkles,
    label: "Preparando bandeja",
    detail: "Indexando resultados para tu sesión…",
  },
] as const

interface GmailScanLoaderProps {
  email?: string | null
}

export default function GmailScanLoader({ email }: GmailScanLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  const step = STEPS[stepIndex]
  const StepIcon = step.icon

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-brand-navy px-6 py-8 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 bg-gradient-to-r from-brand-blue/0 via-brand-lightBlue/40 to-brand-blue/0 animate-pulse"
            aria-hidden
          />
          <div className="relative">
            <div className="w-14 h-14 mx-auto mb-4 bg-brand-blue flex items-center justify-center rounded-lg border border-brand-lightBlue/30 shadow-lg shadow-brand-blue/20">
              <Shield className="w-8 h-8 text-brand-lightBlue animate-pulse" />
            </div>
            <h1 className="text-lg font-black tracking-tight">ShieldMind AI</h1>
            <p className="text-[11px] text-brand-lightBlue font-semibold uppercase tracking-wider mt-1">
              Sincronizando tu bandeja
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {email && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span className="font-medium truncate max-w-[240px]">{email}</span>
            </div>
          )}

          <div className="flex justify-center gap-1.5">
            {STEPS.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === stepIndex ? "w-8 bg-brand-blue" : index < stepIndex ? "w-1.5 bg-brand-lightBlue/60" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div key={stepIndex} className="text-center space-y-3 gmail-scan-step">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-brand-blue animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-navy">{step.label}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed px-2">{step.detail}</p>
            </div>
          </div>

          <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-brand-blue to-brand-lightBlue rounded-full gmail-scan-bar" />
          </div>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            Esto puede tardar unos segundos si hay muchos correos nuevos.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-slide {
          0% {
            left: -35%;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes scan-step-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .gmail-scan-bar {
          animation: scan-slide 1.8s ease-in-out infinite;
        }
        .gmail-scan-step {
          animation: scan-step-in 0.45s ease-out;
        }
      `}</style>
    </div>
  )
}
