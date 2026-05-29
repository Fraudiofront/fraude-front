import type { NextRouter } from "next/router"

/** Next.js cancela la carga del chunk si navegas antes de terminar — es esperado en redirects de auth. */
export function safeReplace(router: NextRouter, url: string): void {
  const targetPath = url.split("?")[0]
  if (router.pathname === targetPath && router.asPath === url) return
  void router.replace(url).catch(() => {})
}

export function redirectToLogin(returnTo: string): void {
  if (typeof window === "undefined") return
  const url = `/login?returnTo=${encodeURIComponent(returnTo)}`
  if (window.location.pathname === "/login") return
  window.location.replace(url)
}
