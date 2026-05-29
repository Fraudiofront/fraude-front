import React from "react"
import { Shield } from "lucide-react"

interface LoginSessionLoaderProps {
  message?: string
}

export default function LoginSessionLoader({ message = "Cargando sesión…" }: LoginSessionLoaderProps) {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-white gap-4 p-6">
      <div className="w-12 h-12 rounded-lg bg-brand-blue/80 border border-brand-lightBlue/30 flex items-center justify-center">
        <Shield className="w-7 h-7 text-brand-lightBlue animate-pulse" />
      </div>
      <div className="w-8 h-8 border-4 border-white/20 border-t-brand-lightBlue rounded-full animate-spin" />
      <p className="text-sm font-medium text-white/80">{message}</p>
    </div>
  )
}
