import { useState } from 'react'
import { scopeFor } from '../../server/searchScope.js'

function today() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// initial: 이전에 입력한 값 (결과 화면에서 '다시 입력하기'로 돌아올 때 유지)
export default function InputForm({ onSubmit, initial }) {
  const [date, setDate] = useState(initial?.date || today())
  const [restAreas, setRestAreas] = useState(initial?.restAreas ?? '')
  const [previousIdeas, setPreviousIdeas] = useState(initial?.previousIdeas ?? '')

  function submit(e) {
    e.preventDefault()
    onSubmit(
      {
        date,
        restAreas: restAreas.trim() || '없음',
        previousIdeas: previousIdeas.trim() || '없음',
      },
      { date, restAreas, previousIdeas }, // 화면에 다시 보여줄 원래 입력값
    )
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>이번 주 입력</h2>
      <div className="notice">
        외부 AI로 전송됩니다. <b>매출·원가 등 내부 수치, 내부 문서, 개인정보는 넣지 마세요.</b> (공개된 휴게소명·특성까지만)
      </div>

      <label className="field">
        <span>오늘 날짜 <em>필수</em></span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>

      {date && (
        <p className="scope">
          검색 범위: <b>{scopeFor(date).source}</b>, <b>{scopeFor(date).from} ~ {date}</b> (최근 3개월).
          해외 사례는 국내 언론의 해외 보도로 찾습니다.
        </p>
      )}

      <label className="field">
        <span>참고할 휴게소명·특성 <em className="opt">선택</em></span>
        <input
          type="text"
          value={restAreas}
          onChange={(e) => setRestAreas(e.target.value)}
          placeholder="비워 두면 '없음'"
        />
      </label>

      <label className="field">
        <span>지난번 아이디어 (중복 제외용) <em className="opt">선택</em></span>
        <textarea
          rows={3}
          value={previousIdeas}
          onChange={(e) => setPreviousIdeas(e.target.value)}
          placeholder="쉼표로 구분. 예: 아이디어A, 아이디어B"
        />
      </label>

      <button className="primary" type="submit" disabled={!date}>
        아이디어 생성
      </button>
    </form>
  )
}
