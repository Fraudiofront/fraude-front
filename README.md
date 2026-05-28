# ShieldMind AI - Aseguradora del Sur 🛡️🧠

Este es el frontend de **ShieldMind AI**, un prototipo interactivo de nivel producción diseñado para el **HacklAthon 2026** de Aseguradora del Sur. La plataforma automatiza el triaje ético, el análisis de riesgo y la detección inteligente de fraudes en siniestros de seguros mediante Inteligencia Artificial.

## 🚀 Stack Tecnológico

- **Framework:** Next.js (Pages Router, TypeScript, React)
- **Estilos:** Tailwind CSS (Paleta de colores corporativa: Azul, Celeste, Navy y Blanco)
- **Visualización de Datos:** Recharts para gráficos de analítica de riesgo
- **Consumo de APIs:** Axios con una capa de servicios aislada y robusta

## 📁 Arquitectura del Proyecto

```
frontend/
├── src/
│   ├── components/       # Componentes visuales reutilizables
│   │   ├── layout/       # Sidebar de navegación general, Header
│   │   ├── triage/       # Tabla de siniestros, Badges de alerta
│   │   ├── case-detail/  # Panel de datos duros, Clarity Card, Widget de Similitud (NLP)
│   │   └── chatbot/      # Panel de chat interactivo colapsable (Copiloto)
│   ├── pages/            # Vistas principales de Next.js
│   │   ├── index.tsx     # Vista 1: Triaje (Bandeja de Entrada)
│   │   ├── caso/[id].tsx # Vista 2: Expediente y Detalle del Siniestro (Split Screen)
│   │   └── reportar.tsx  # Vista 3: Formulario Público de Siniestros (Para el asegurado)
│   ├── services/         # Conexión al Backend con Axios
│   │   ├── api.ts        # Configuración base de Axios (BaseURL, interceptores)
│   │   └── claims.ts     # Endpoints del backend (/claims, /claims/{id}, /chat)
│   └── styles/
│       └── globals.css
```

## 🛠️ Instalación y Uso

1. Instala las dependencias en la carpeta `frontend/`:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
