// 한글 기획안에 바로 붙일 수 있는 개조식 텍스트로 변환 (v2 프롬프트 출력 형식과 동일)

export function draftToText(d) {
  const section = (name, items) => [`□ ${name}`, ...items.map((t) => ` ○ ${t}`)]
  return [
    `## 기획안 초안 ${d.no}. ${d.title}`,
    ...section('추진배경', d.background),
    ...section('추진내용', d.content),
    ...section('기대효과', d.effects),
    ...section('향후계획', d.plan),
  ].join('\n')
}

export function attachmentToText(d) {
  const m = d.attachment.main
  const lines = [
    `[붙임] 관련 기사 (기획안 ${d.no})`,
    '■ 대표 기사',
    ` 1. ${m.title} / ${m.press} / ${m.date}`,
    `    - ${m.url}`,
    `    - 핵심 요지: ${m.summary}`,
    '    - 원문: ※ 원문 스크랩 첨부',
    '■ 관련 기사',
  ]
  if (d.attachment.related.length === 0) lines.push(' (없음)')
  for (const r of d.attachment.related) {
    lines.push(` ${r.no}. ${r.title} / ${r.press} / ${r.date} / ${r.url}`, `    - 요지: ${r.summary}`)
  }
  return lines.join('\n')
}

// 옆자리 PC는 http://192.168.x.x 로 접속하므로 navigator.clipboard 를 쓸 수 없는 경우가 많음 → 예전 방식으로 대체
export async function copyText(text) {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* 아래 방식으로 재시도 */
    }
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}
