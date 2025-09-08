/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 검사 비활성화
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 중 TypeScript 에러 무시
  },
}

module.exports = nextConfig 