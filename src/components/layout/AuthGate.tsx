import type { ReactNode } from "react"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { redirectToLogin } from "@/utils/navigation"

export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, ready } = useAuth()
  const isLoginPage = router.pathname === "/login"
  const redirectingRef = useRef(false)

  useEffect(() => {
    if (!ready || isLoginPage || user || redirectingRef.current) return
    redirectingRef.current = true
    redirectToLogin(router.asPath)
  }, [ready, user, isLoginPage, router.asPath])

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Cargando sesión…
      </div>
    )
  }

  if (!user && !isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Redirigiendo al inicio de sesión…
      </div>
    )
  }

  return <>{children}</>
}
