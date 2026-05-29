# ShieldMind AI - Aseguradora del Sur

Frontend de **ShieldMind AI** (Next.js) para triaje, analisis de riesgo y deteccion de fraude en siniestros.

## Requisitos

| Componente | Version |
|------------|---------|
| Node.js | 20+ (recomendado con [nvm-windows](https://github.com/coreybutler/nvm-windows)) |
| pnpm | opcional (`npm install -g pnpm`) |

Backend en ejecucion: `http://127.0.0.1:8000` (ver `fraude-back`).

## Inicio rapido (Windows)

```powershell
cd D:\work\fraude-front

# Si node/pnpm no se reconocen en esta terminal, carga Node en la sesion:
. .\scripts\ensure-node.ps1

pnpm install
pnpm dev
```

O un solo comando (instala deps si faltan y arranca Next):

```powershell
.\scripts\dev-up.ps1
```

Abre **http://localhost:3000**.

Variables: copia `.env.example` a `.env.local` (local) o `.env.despligue` (Vercel).

**Despliegue:** ver [DEPLOY.md](./DEPLOY.md)

## Despliegue en Vercel (resumen)

Produccion: **https://fraude-front.vercel.app**

```powershell
cd D:\work\fraude-front
. .\scripts\ensure-node.ps1   # si hace falta Node en la sesion
vercel login                  # solo la primera vez
.\scripts\vercel-deploy.ps1
```

`.env.despligue`:

```env
NEXT_PUBLIC_API_URL=https://fraude-back-production.up.railway.app
```

En Railway (backend), CORS debe incluir el front:

```env
FRONTEND_URL=https://fraude-front.vercel.app
ALLOWED_ORIGINS=https://fraude-front.vercel.app
```

## Stack

- **Next.js** (Pages Router, TypeScript, React)
- **Tailwind CSS**
- **Recharts**, **Axios**

## Estructura

```
src/
├── components/   # layout, triage, case-detail, chatbot
├── pages/        # index, caso/[id], correos, copiloto, login, ...
├── services/     # api.ts, claims, gmail, auth
├── hooks/
└── styles/
```

## Problemas frecuentes

### `node.exe` no se reconoce / `pnpm` falla

**Causa habitual:** Cursor (o la terminal) se abrio **antes** de instalar Node o de corregir el PATH. Las pestanas nuevas siguen usando el entorno del proceso padre.

**Solucion rapida (esta sesion):**

```powershell
. .\scripts\ensure-node.ps1
node -v
pnpm install
```

**Solucion permanente:**

1. Cierra **Cursor por completo** (no solo la pestana de terminal) y vuelve a abrirlo.
2. Comprueba que exista `C:\nvm4w\nodejs\node.exe` (o tu ruta de nvm).
3. En Variables de entorno de Windows, el PATH de usuario **no** debe tener entradas literales `%NVM_HOME%` / `%NVM_SYMLINK%`; deben ser rutas reales, por ejemplo:
   - `C:\Users\<tu-usuario>\AppData\Local\nvm`
   - `C:\nvm4w\nodejs`

Si usas nvm-windows y no hay version activa:

```powershell
nvm install 20
nvm use 20
```

### Sin pnpm

```powershell
npm install
npm run dev
```
