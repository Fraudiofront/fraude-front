# fraude-front — ShieldMind AI

Frontend en **Next.js** para analistas de la **Aseguradora del Sur**: bandeja de siniestros, auditoría antifraude, correos Gmail, copiloto IA y formulario de reporte.

| Entorno | URL |
|---------|-----|
| Producción | https://fraude-front.vercel.app |
| Login | https://fraude-front.vercel.app/login |
| API (backend) | https://fraude-back-production.up.railway.app |

---

## Tabla de contenidos

1. [Qué hace el frontend](#qué-hace-el-frontend)
2. [Vistas y rutas](#vistas-y-rutas)
3. [Stack](#stack)
4. [Arquitectura del código](#arquitectura-del-código)
5. [Requisitos e inicio rápido](#requisitos-e-inicio-rápido)
6. [Variables de entorno](#variables-de-entorno)
7. [Autenticación y sesión](#autenticación-y-sesión)
8. [Integración con el backend](#integración-con-el-backend)
9. [Scripts](#scripts)
10. [Despliegue](#despliegue)
11. [Problemas frecuentes](#problemas-frecuentes)

---

## Qué hace el frontend

Es la **consola del analista**: conecta Gmail, muestra siniestros con semáforo de riesgo, permite auditar cada expediente y chatear con el copiloto RAG.

```
/login → OAuth Google → escaneo Gmail → / (bandeja)
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
    /correos            /caso/[id]           /copiloto
  correos raw         expediente 360°      chat global/caso
```

| Área | Qué permite |
|------|-------------|
| **Bandeja** | Triaje, filtros por riesgo, tabs inbox/archivados, sync Gmail |
| **Expediente** | Datos del asegurado, reglas IA, similitud, dictamen, chat lateral |
| **Correos** | Correos detectados en Gmail y envío de PDFs a bandeja |
| **Copiloto** | Consultas agénticas por caso o globales |
| **Reportar** | Alta manual de siniestro (formulario público interno) |
| **Preview correo** | Simular envío/ingesta de correos |

---

## Vistas y rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Botón “Continuar con Google”; post-OAuth escanea Gmail y redirige |
| `/` | Bandeja | Tabla de siniestros, stats Rojo/Amarillo/Verde, sync e indexación RAG |
| `/caso/[id]` | Expediente | Split: dossier + scoring IA + widget similitud + copiloto flotante |
| `/correos` | Correos Gmail | Tabla de correos ingestados; “A bandeja” procesa PDFs |
| `/copiloto` | Centro de control | Panel alertas + chat caso específico / consulta global |
| `/reportar` | Reportar siniestro | Formulario de 20 campos alineado al modelo del backend |
| `/preview-correo` | Preview / simulador | Outbound (confirmación) e inbound (simulación de ingestión) |

### Componentes de layout (todas las vistas autenticadas)

| Componente | Ubicación | Función |
|------------|-----------|---------|
| `Sidebar` | `components/layout/Sidebar` | Navegación principal |
| `Header` | `components/layout/Header` | Título de página + campana de notificaciones |
| `AuthGate` | `components/layout/AuthGate` | Redirige a `/login` si no hay sesión |

### Estados de carga (skeletons)

| Componente | Dónde se usa |
|------------|--------------|
| `components/ui/Skeleton.tsx` | Barras y tablas genéricas |
| `ClaimTableSkeleton` | Bandeja mientras carga siniestros |
| `CorreosTableSkeleton` | Página correos |
| `ClaimDetailContentSkeleton` | Detalle de expediente |
| `CopilotLoadingSkeletons` | Centro de control copiloto |
| `GmailScanLoader` | Pantalla post-login durante escaneo Gmail |

---

## Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** (Pages Router) | Rutas, SSR/CSR |
| **TypeScript** | Tipado estricto |
| **Tailwind CSS** | Estilos (paleta brand navy / celeste) |
| **Axios** | Cliente HTTP al API |
| **Recharts** | Gráficos en bandeja (si habilitados) |
| **Lucide React** | Iconos |

---

## Arquitectura del código

```text
src/
├── pages/                 # Una carpeta ≈ una ruta (Next.js Pages Router)
│   ├── index.tsx          # Bandeja
│   ├── login.tsx
│   ├── correos.tsx
│   ├── copiloto.tsx
│   ├── reportar.tsx
│   ├── preview-correo.tsx
│   └── caso/[id].tsx
├── components/
│   ├── layout/            # Sidebar, Header, AuthGate
│   ├── triage/            # ClaimTable, badges de riesgo
│   ├── case-detail/       # ClientData, ClarityCard, SimilarityWidget
│   ├── chatbot/           # CopilotChat (panel en expediente)
│   ├── copiloto/          # Skeletons del centro de control
│   ├── auth/              # Loaders OAuth / escaneo
│   └── ui/                # Skeleton compartido
├── context/
│   └── AuthContext.tsx    # Usuario, Gmail connect, sync inbox
├── hooks/
│   ├── useSiniestros.ts   # Lista, summary, index status
│   └── useChatQuery.ts    # Chat por caso en expediente
├── services/
│   ├── api.ts             # Axios + base URL + headers analista
│   ├── auth.ts            # Usuario en localStorage
│   ├── gmail.ts           # OAuth URL, scan, correos
│   ├── claims.ts          # Siniestros, scoring, chat agent
│   ├── mappers.ts         # Backend DTO → UI Claim
│   └── notifications.ts   # Alertas del header
├── types/                 # Tipos alineados al backend
└── utils/                 # scoring, navigation, formatters
```

### Servicios clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `services/api.ts` | `NEXT_PUBLIC_API_URL`, interceptor `X-Analyst-Email` |
| `services/gmail.ts` | Iniciar OAuth, scan, listar/process correos |
| `services/claims.ts` | CRUD siniestros, chat, summary, delete |
| `context/AuthContext.tsx` | Estado global: `user`, `scanning`, `syncGmailInbox()` |

---

## Requisitos e inicio rápido

| Requisito | Versión |
|-----------|---------|
| Node.js | 20+ ([nvm-windows](https://github.com/coreybutler/nvm-windows)) |
| pnpm | Opcional (`npm install -g pnpm`) |
| Backend | Corriendo en `http://127.0.0.1:8000` ([fraude-back](../fraude-back)) |

### Pasos (Windows)

```powershell
cd D:\work\fraude-front

# Si node/pnpm no se reconocen en esta terminal:
. .\scripts\ensure-node.ps1

copy .env.example .env.local
# Edita: NEXT_PUBLIC_API_URL=http://localhost:8000

pnpm install
pnpm dev
```

Atajo (instala deps si faltan y arranca):

```powershell
.\scripts\dev-up.ps1
```

Abre **http://localhost:3000**.

### Build de producción local

```powershell
pnpm build
pnpm start
```

---

## Variables de entorno

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `.env.local` / Vercel | URL del backend FastAPI |

**Local** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Producción** (`.env.despligue` → Vercel):

```env
NEXT_PUBLIC_API_URL=https://fraude-back-production.up.railway.app
```

> Las variables `NEXT_PUBLIC_*` se embeben en el **build**. Si cambias la URL del API, hay que **volver a desplegar**.

---

## Autenticación y sesión

1. Usuario entra a `/login` y pulsa **Continuar con Google**.
2. Front obtiene URL de `GET /api/v1/gmail/auth/url` y redirige a Google.
3. Google vuelve al **backend** (`/gmail/auth/callback`); el backend redirige al front con `?gmail=connected&email=...`.
4. `AuthContext` guarda el usuario en `localStorage` y lanza **escaneo Gmail** (`POST /gmail/scan`).
5. `GmailScanLoader` muestra progreso durante el escaneo.
6. Rutas protegidas usan `AuthGate` → sin sesión van a `/login`.

### Logout

Llama `POST /api/v1/gmail/auth/logout` y limpia storage local.

### Login para cualquier Gmail

Configuración en **Google Cloud** (backend): publicar app OAuth en producción. Ver [fraude-back/DEPLOY.md](../fraude-back/DEPLOY.md).

---

## Integración con el backend

Todas las peticiones autenticadas incluyen:

```http
X-Analyst-Email: analista@gmail.com
```

| Acción en UI | Endpoint backend |
|--------------|------------------|
| Cargar bandeja | `GET /api/v1/siniestros`, `GET /summary` |
| Sync Gmail (botón refresh) | `POST /api/v1/gmail/scan` |
| Ver expediente | `GET /api/v1/siniestros/{id}` |
| Guardar dictamen | `PATCH /api/v1/siniestros/{id}/status` |
| Copiloto (chat) | `POST /api/v1/chat/query` |
| Indexar RAG | `POST /api/v1/chat/index` |
| Correos → bandeja | `POST /api/v1/gmail/correos/{id}/procesar` |

Si el backend no responde, algunos servicios muestran datos de demostración y un aviso en notificaciones.

Documentación API interactiva: https://fraude-back-production.up.railway.app/swagger

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `scripts/dev-up.ps1` | Dev server con deps |
| `scripts/ensure-node.ps1` | Carga Node en sesión Windows (PATH/nvm) |
| `scripts/vercel-deploy.ps1` | Deploy a Vercel production/preview |

Comandos npm/pnpm:

| Comando | Acción |
|---------|--------|
| `pnpm dev` | Desarrollo :3000 |
| `pnpm build` | Build producción |
| `pnpm start` | Servir build |
| `pnpm exec tsc --noEmit` | Verificar tipos |

---

## Despliegue

Guía completa (Vercel, variables, CORS, OAuth, CI):

**→ [DEPLOY.md](./DEPLOY.md)**

Resumen:

- Hosting en **Vercel**, rama `main`
- `NEXT_PUBLIC_API_URL` apuntando a Railway
- En Railway: `FRONTEND_URL` y `ALLOWED_ORIGINS` con URL de Vercel

---

## Problemas frecuentes

### `node` / `pnpm` no se reconoce

```powershell
. .\scripts\ensure-node.ps1
node -v
```

Cierra y reabre Cursor si el PATH no actualiza. Con nvm: `nvm use 20`.

### El front llama a `localhost:8000` en producción

`NEXT_PUBLIC_API_URL` no estaba en Vercel al hacer build. Vuelve a desplegar con la variable correcta.

### CORS / Network Error

- Usa el alias estable `https://fraude-front.vercel.app`
- Revisa `ALLOWED_ORIGINS` en Railway
- Backend con `APP_ENV=production`

### Google: `redirect_uri_mismatch`

URIs de callback en Google Cloud deben coincidir con el backend. Ver [DEPLOY.md](./DEPLOY.md) y [fraude-back/DEPLOY.md](../fraude-back/DEPLOY.md).

### Google: `403 access_denied` (solo testers)

Publica la app OAuth o agrega el email como usuario de prueba en Google Cloud.

### Sin pnpm

```powershell
npm install
npm run dev
```

---

## Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [DEPLOY.md](./DEPLOY.md) | Vercel, secrets, CI |
| [PLAN_INTEGRACION.md](./PLAN_INTEGRACION.md) | Plan de integración front/back |
| [fraude-back/README.md](../fraude-back/README.md) | API, scoring, Gmail |
| [fraude-back/DEPLOY.md](../fraude-back/DEPLOY.md) | Railway + Google OAuth |

---

## Identidad visual

Paleta principal: Navy `#081f3f`, Celeste `#00adef`, slate para fondos. Semáforo de riesgo: rojo / ámbar / verde según puntaje del backend (`score_color`).
