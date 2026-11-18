import { useState } from 'react'

export default function AccessGate({ onSubmit }) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    await onSubmit(code.trim())
    setBusy(false)
  }

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>접속 코드</h2>
      <p className="hint">팀에서 공유받은 공용 접속 코드를 입력하세요.</p>
      <label className="field">
        <span>접속 코드</span>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </label>
      <button className="primary" type="submit" disabled={busy || !code.trim()}>
        {busy ? '확인 중…' : '들어가기'}
      </button>
    </form>
  )
}
