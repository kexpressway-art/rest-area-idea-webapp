// 개발용 API (Vite 서버 안에서 동작).
// - 접속 코드는 서버에서만 확인합니다. 값은 .env 의 ACCESS_CODE (VITE_ 접두사 없음 → 브라우저에 노출되지 않음)
// - /api/generate 는 지금은 가상 샘플을 돌려줍니다. AI 제공사(D1)가 정해지면 이 부분을 실제 호출로 바꿉니다.
import os from 'node:os'
import { buildSampleResult } from './sampleResult.js'

function readJson(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve(null)
      }
    })
  })
}

function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function lanAddresses(port) {
  const urls = []
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) {
      if (a.family === 'IPv4' && !a.internal) urls.push(`http://${a.address}:${port}/`)
    }
  }
  return urls
}

function attach(middlewares, getPort, accessCode) {
  middlewares.use(async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/')) return next()
    const path = req.url.split('?')[0]

    if (path === '/api/network' && req.method === 'GET') {
      return send(res, 200, { urls: lanAddresses(getPort()) })
    }

    if (req.method !== 'POST') return send(res, 405, { message: '허용되지 않는 요청입니다.' })

    const body = await readJson(req)
    if (body === null) return send(res, 400, { message: '요청 형식이 올바르지 않습니다.' })

    if (!accessCode) {
      return send(res, 500, { message: '서버에 접속 코드가 설정되지 않았습니다. idea-webapp/.env 의 ACCESS_CODE 를 확인하세요.' })
    }
    if (body.accessCode !== accessCode) {
      return send(res, 401, { message: '접속 코드가 맞지 않습니다.' })
    }

    if (path === '/api/verify') return send(res, 200, { ok: true })

    if (path === '/api/generate') {
      const date = String(body.date || '')
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return send(res, 400, { message: '오늘 날짜를 YYYY-MM-DD 형식으로 입력하세요.' })
      }
      // 실제 AI 호출처럼 잠시 기다린 뒤 응답 (진행 화면 확인용)
      await new Promise((r) => setTimeout(r, 1200))
      return send(res, 200, buildSampleResult({ date }))
    }

    return send(res, 404, { message: '없는 주소입니다.' })
  })
}

export function devApi({ accessCode }) {
  return {
    name: 'idea-dev-api',
    configureServer(server) {
      attach(server.middlewares, () => server.config.server.port, accessCode)
    },
    configurePreviewServer(server) {
      attach(server.middlewares, () => server.config.preview.port, accessCode)
    },
  }
}
