import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
})

// Interceptores de request y response para logging y manejo de errores premium
api.interceptors.request.use(
  (config) => {
    // Si necesitasemos tokens de autenticación para Aseguradora del Sur, se añadirían aquí
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("ShieldMind API Error:", error.response || error.message)
    return Promise.reject(error)
  }
)

export default api
