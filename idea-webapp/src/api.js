async function post(path, body) {
  let res
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인하세요.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `요청에 실패했습니다 (${res.status}).`)
  return data
}

export const verifyCode = (accessCode) => post('/api/verify', { accessCode })

export const generateIdeas = (accessCode, input) => post('/api/generate', { accessCode, ...input })

export async function getNetworkUrls() {
  try {
    const res = await fetch('/api/network')
    if (!res.ok) return []
    return (await res.json()).urls || []
  } catch {
    return []
  }
}
