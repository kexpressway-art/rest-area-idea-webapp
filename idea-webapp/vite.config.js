import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { devApi } from './server/devApi.js'

export default defineConfig(({ mode }) => {
  // 세 번째 인자 '' → VITE_ 접두사가 없는 값도 읽음. 이 값은 서버에서만 쓰이고 브라우저 코드에 들어가지 않음.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), devApi({ accessCode: env.ACCESS_CODE })],
    server: {
      host: true, // 같은 네트워크의 다른 PC(옆자리)에서 접속 가능하도록 네트워크 주소로 열기
      port: 5173,
      strictPort: true,
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
    },
  }
})
