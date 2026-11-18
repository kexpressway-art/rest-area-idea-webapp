// 웹앱 기사 검색 범위 (2026-11-18 결정, 웹앱에만 적용)
// - 출처: 네이버 뉴스 (네이버 검색 API 뉴스 검색. 실제 호출은 개발 계획 2단계에서 연결)
// - 기간: 기준일(입력한 오늘 날짜)로부터 최근 3개월
// - 해외 사례: 네이버에 실린 국내 언론의 해외 사례 보도로 대신함
// v1·v2 프롬프트와 BRD·PRD의 기준(국내+해외, 기간 제한 없음)은 바꾸지 않음.

export const SEARCH_SCOPE = {
  source: '네이버 뉴스',
  months: 3,
  overseas: '국내 언론의 해외 사례 보도로 대신',
}

const pad = (n) => String(n).padStart(2, '0')
const fmt = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`

// 'YYYY-MM-DD' 기준 n개월 전 날짜. 해당 월에 같은 날이 없으면 그 달 마지막 날로 맞춤 (예: 05-31 → 02-28)
export function monthsBefore(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number)
  let year = y
  let month = m - n
  while (month < 1) {
    month += 12
    year -= 1
  }
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return fmt(year, month, Math.min(d, lastDay))
}

export function scopeFor(baseDate) {
  return {
    source: SEARCH_SCOPE.source,
    from: monthsBefore(baseDate, SEARCH_SCOPE.months),
    to: baseDate,
    overseas: SEARCH_SCOPE.overseas,
  }
}

// 기사 날짜가 범위 안인지 (양 끝 포함). 2단계에서 네이버 API 결과(pubDate)를 거를 때 사용
export function inScope(articleDate, scope) {
  return articleDate >= scope.from && articleDate <= scope.to
}

// 기준일에서 n일 전 'YYYY-MM-DD' (샘플 데이터용)
export function daysBefore(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d - n))
  return fmt(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate())
}
