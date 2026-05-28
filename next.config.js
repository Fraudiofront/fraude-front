/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Permite compilar a producción incluso con advertencias menores
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
