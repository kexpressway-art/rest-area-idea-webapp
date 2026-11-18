import { useEffect, useState } from 'react'
import { verifyCode, generateIdeas, getNetworkUrls } from './api.js'
import AccessGate from './components/AccessGate.jsx'
import InputForm from './components/InputForm.jsx'
import Results from './components/Results.jsx'

export default function App() {
  const [accessCode, setAccessCode] = useState('')
  const [stage, setStage] = useState('gate') // gate | form | loading | result
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [networkUrls, setNetworkUrls] = useState([])
  const [lastInput, setLastInput] = useState(null)

  useEffect(() => {
    getNetworkUrls().then(setNetworkUrls)
  }, [])

  async function handleVerify(code) {
    setError('')
    try {
      await verifyCode(code)
      setAccessCode(code)
      setStage('form')
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleGenerate(input, rawInput) {
    setLastInput(rawInput)
    setError('')
    setStage('loading')
    try {
      const data = await generateIdeas(accessCode, input)
      setResult(data)
      setStage('result')
    } catch (e) {
      setError(e.message)
      setStage('form')
    }
  }

  return (
    <div className="app">
      <header className="top">
        <h1>휴게소 아이디어 생성기</h1>
        <p className="sub">네이버 뉴스 최근 3개월 → 아이디어 카드 5개 → 기획안 초안 2~3건</p>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      {stage === 'gate' && <AccessGate onSubmit={handleVerify} />}
      {stage === 'form' && <InputForm onSubmit={handleGenerate} initial={lastInput} />}
      {stage === 'loading' && (
        <div className="panel loading" aria-live="polite">
          <div className="spinner" />
          <p>기사를 찾고 아이디어를 만드는 중입니다…</p>
        </div>
      )}
      {stage === 'result' && result && (
        <Results result={result} onRestart={() => setStage('form')} />
      )}

      {networkUrls.length > 0 && (
        <footer className="network">
          옆자리 접속 주소: {networkUrls.map((u) => <code key={u}>{u}</code>)}
        </footer>
      )}
    </div>
  )
}
