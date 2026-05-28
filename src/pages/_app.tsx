import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ShieldMind AI - Aseguradora del Sur</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sistema Inteligente de Triaje, Análisis Ético y Detección de Fraudes en Siniestros de Seguros." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
