import { useState } from 'react'
import { draftToText, attachmentToText, copyText } from '../format.js'

// [추측], 내부 확인 필요, 링크 확인 필요 표시를 눈에 띄게
function Marked({ text }) {
  const parts = text.split(/(\[추측\]|내부 확인 필요|링크 확인 필요)/g)
  return parts.map((p, i) =>
    /^(\[추측\]|내부 확인 필요|링크 확인 필요)$/.test(p) ? (
      <mark key={i} className="flag">{p}</mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

function CopyButton({ getText, label }) {
  const [state, setState] = useState('')
  async function click() {
    const ok = await copyText(getText())
    setState(ok ? '복사됨' : '복사 실패')
    setTimeout(() => setState(''), 1500)
  }
  return (
    <button type="button" className="copy" onClick={click}>
      {state || label}
    </button>
  )
}

function Status({ v }) {
  return v === 'ok' ? <span className="ok">✅</span> : <span className="warn">⚠</span>
}

function Cards({ cards }) {
  return (
    <section>
      <h2>아이디어 카드 {cards.length}개</h2>
      <div className="cards">
        {cards.map((c) => (
          <article key={c.no} className={`card ${c.selected ? 'selected' : ''}`}>
            <div className="card-head">
              <span className="num">카드 {c.no}</span>
              <span className={`badge ${c.selected ? 'on' : ''}`}>초안 {c.selected ? 'O' : 'X'}</span>
            </div>
            <h3>{c.title}</h3>
            <p>{c.summary}</p>
            <dl>
              <dt>근거</dt>
              <dd>
                <a href={c.source.url} target="_blank" rel="noreferrer">{c.source.title}</a>
                {' '}/ {c.source.press} / {c.source.date} / {c.source.region}
              </dd>
              <dt>적용 방안</dt>
              <dd>{c.application}</dd>
              <dt>협력 기관</dt>
              <dd>{c.partner}</dd>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}

function Draft({ d }) {
  const block = (name, items) => (
    <div className="draft-sec">
      <h4>□ {name}</h4>
      <ul>
        {items.map((t, i) => (
          <li key={i}><Marked text={t} /></li>
        ))}
      </ul>
    </div>
  )
  const m = d.attachment.main
  return (
    <div className="draft">
      <div className="draft-actions">
        <CopyButton label="본문 복사" getText={() => draftToText(d)} />
        <CopyButton label="붙임 복사" getText={() => attachmentToText(d)} />
      </div>
      <h3>기획안 초안 {d.no}. {d.title}</h3>
      {block('추진배경', d.background)}
      {block('추진내용', d.content)}
      {block('기대효과', d.effects)}
      {block('향후계획', d.plan)}

      <div className="attachment">
        <h4>[붙임] 관련 기사 (기획안 {d.no})</h4>
        <p className="att-title">■ 대표 기사</p>
        <p>
          1. <a href={m.url} target="_blank" rel="noreferrer">{m.title}</a> / {m.press} / {m.date}
        </p>
        <p className="indent">핵심 요지: {m.summary}</p>
        <p className="indent muted">원문: ※ 원문 스크랩 첨부</p>
        <p className="att-title">■ 관련 기사</p>
        {d.attachment.related.length === 0 && <p className="indent muted">(없음)</p>}
        {d.attachment.related.map((r) => (
          <p key={r.no}>
            {r.no}. <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> / {r.press} / {r.date} — {r.summary}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function Results({ result, onRestart }) {
  const [tab, setTab] = useState(result.drafts[0]?.no ?? null)
  const current = result.drafts.find((d) => d.no === tab)

  return (
    <div className="results">
      {result.meta?.sample && (
        <div className="sample-banner">
          가상 샘플 결과입니다. 실제 기사가 아니며 링크는 example.com 입니다. (AI 연동 전 화면 확인용)
        </div>
      )}

      {result.meta?.scope && (
        <p className="scope">
          검색 범위: <b>{result.meta.scope.source}</b>, <b>{result.meta.scope.from} ~ {result.meta.scope.to}</b>
          {' '}· 해외 사례: {result.meta.scope.overseas}
        </p>
      )}

      <Cards cards={result.cards} />

      <section>
        <h2>선정 결과</h2>
        <ul className="selection">
          {result.selection.map((s) => (
            <li key={s.cardNo}><b>카드 {s.cardNo}</b> — {s.reason}</li>
          ))}
        </ul>
        {result.notes && <p className="notice">{result.notes}</p>}
      </section>

      <section>
        <h2>기획안 초안 {result.drafts.length}건</h2>
        <div className="tabs" role="tablist">
          {result.drafts.map((d) => (
            <button
              key={d.no}
              role="tab"
              aria-selected={d.no === tab}
              className={d.no === tab ? 'tab active' : 'tab'}
              onClick={() => setTab(d.no)}
            >
              초안 {d.no}
            </button>
          ))}
        </div>
        {current && <Draft d={current} />}
      </section>

      <section>
        <h2>자체 점검표 (기획안 초안 대상)</h2>
        <p className="hint">초안에 쓰인 근거 기사 링크만 직접 열어 확인하세요. ⚠ 항목부터 보면 됩니다.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>기획안</th><th>근거 링크</th><th>기사 날짜</th><th>수치·기관명 일치</th><th>[추측]</th><th>내가 확인할 부분</th>
              </tr>
            </thead>
            <tbody>
              {result.checklist.map((r) => (
                <tr key={r.draftNo}>
                  <td>{r.draftNo}</td>
                  <td><Status v={r.link} /></td>
                  <td>{r.oldestDate}</td>
                  <td><Status v={r.factMatch} /></td>
                  <td>{r.guessCount}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button className="secondary" type="button" onClick={onRestart}>다시 입력하기</button>
    </div>
  )
}
