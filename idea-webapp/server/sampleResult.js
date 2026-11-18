// 개발용 가상 샘플 결과입니다. 실제 기사가 아니며, 링크는 모두 example.com 입니다.
// 실제 AI 연동(개발 계획 2단계) 전까지 화면 확인용으로만 사용합니다.
// 형식은 v2 프롬프트의 출력 구성을 따르고, 검색 범위는 웹앱 기준(네이버 뉴스, 최근 3개월)을 따릅니다.
import { scopeFor, daysBefore } from './searchScope.js'

const DOMESTIC = '국내'
const OVERSEAS = '해외 사례(국내 보도)'

export function buildSampleResult({ date }) {
  const scope = scopeFor(date)
  const ago = (n) => daysBefore(date, n) // 모두 3개월(약 90일) 이내로 설정
  const art = (key, title, press, days, region) => ({
    title,
    press,
    date: ago(days),
    url: `https://example.com/naver-news/${key}`,
    region,
  })

  const A = art('a', '가상 기사 A: 지역 특산물 간편식 인기', '가상일보', 47, DOMESTIC)
  const A2 = art('a2', '가상 기사 A-2: 휴게시설 계절 메뉴 순환', '가상방송', 66, DOMESTIC)
  const B = art('b', '가상 기사 B: 해외 휴게소 충전 대기 픽업 서비스', '가상경제', 34, OVERSEAS)
  const B2 = art('b2', '가상 기사 B-2: EV 충전 대기 불편 증가', '가상일보', 29, DOMESTIC)
  const C = art('c', '가상 기사 C: 세차·커피 결합 할인', '가상신문', 81, DOMESTIC)
  const D = art('d', '가상 기사 D: 해외 심야 운전자 휴식 상품', '가상뉴스', 75, OVERSEAS)
  const E = art('e', '가상 기사 E: 지역 관광 굿즈 판매처 확대', '가상신문', 12, DOMESTIC)

  const card = (no, title, summary, source, application, partner, selected) => ({
    no, title, summary, source, application, partner, selected,
  })
  const main = (a, summary) => ({ title: a.title, press: a.press, date: a.date, url: a.url, summary })
  const related = (no, a, summary) => ({ no, title: a.title, press: a.press, date: a.date, url: a.url, summary })

  return {
    meta: {
      sample: true,
      baseDate: date,
      generatedAt: new Date().toISOString(),
      scope,
    },
    cards: [
      card(1, '지역 특산물 한 그릇 메뉴 순환 운영 (가상)', '계절마다 지역 농협과 특산물 한 그릇 메뉴를 바꿔 운영', A,
        '관할 휴게소 1곳에서 분기별 특산물 메뉴 1종을 시범 판매', '지역 농협', true),
      card(2, 'EV 충전 대기 고객용 간편 식음 픽업 (가상)', '충전 대기 시간에 미리 주문한 음식을 받아 가는 서비스', B,
        'EV 충전소 옆 픽업대 설치, 충전 시작 시 주문 안내', '민간 브랜드', true),
      card(3, '셀프 세차 연계 커피 할인 (가상)', '세차 이용 영수증으로 매장 음료 할인', C,
        '주유소 세차장 이용객 대상 공동 마케팅', '민간 브랜드', false),
      card(4, '야간 운전자 휴식 패키지 (가상)', '심야 시간대 간단식 + 휴게 공간 안내 묶음 상품', D,
        '심야 운영 매장에서 패키지 메뉴 시범 운영', '해당 없음', true),
      card(5, '편의점 지역 굿즈 코너 (가상)', '지자체 관광 굿즈를 휴게소 편의점에서 판매', E,
        '편의점 내 소형 진열대로 시범 운영', '지자체', false),
    ],
    selection: [
      { cardNo: 1, reason: '고객 체감이 크고 MoU와 바로 연결됨' },
      { cardNo: 2, reason: 'EV 충전 대기 시간 활용, 시범 적용이 쉬움' },
      { cardNo: 4, reason: '근거 기사가 구체적이고 심야 매장에 바로 적용 가능' },
    ],
    drafts: [
      {
        no: 1,
        cardNo: 1,
        title: '지역 특산물 한 그릇 메뉴 순환 운영 (가상)',
        background: [
          '지역 특산물을 활용한 간편식 수요가 늘고 있다는 보도가 이어지고 있음 [1]',
          '타 지역 휴게시설에서 계절 메뉴 순환으로 재방문을 유도한 사례가 있음 [2]',
        ],
        content: ['관할 휴게소 1곳에서 분기별 특산물 한 그릇 메뉴 1종 시범 판매', '협력 가능 기관 유형: 지역 농협'],
        effects: ['(고객) 지역 특색 있는 메뉴 선택지 확대', '(운영) 재방문 고객 증가 가능성 [추측]'],
        plan: ['시범 판매 → 효과 분석 → 확대 검토 (일정: 내부 확인 필요)'],
        attachment: {
          main: main(A, '지역 특산물 간편식 수요 증가를 다룬 가상 기사 요지'),
          related: [related(2, A2, '계절 메뉴 순환 사례 (가상)')],
        },
      },
      {
        no: 2,
        cardNo: 2,
        title: 'EV 충전 대기 고객용 간편 식음 픽업 (가상)',
        background: [
          '국내 언론이 해외 고속도로 휴게시설의 충전 대기 고객 픽업 서비스를 소개함 [1]',
          'EV 충전 대기 시간이 길다는 이용객 불편 보도가 있음 [2]',
        ],
        content: ['EV 충전소 인근 픽업대 설치, 충전 시작 시 주문 안내', '협력 가능 기관 유형: 민간 브랜드'],
        effects: ['(고객) 충전 대기 시간 활용 편의 향상', '(운영) 객단가 상승 가능성 [추측]'],
        plan: ['시범 휴게소 선정 → 픽업대 시범 운영 → 이용 실적 분석'],
        attachment: {
          main: main(B, '해외 휴게시설의 충전 대기 고객 픽업 서비스 소개 (가상)'),
          related: [related(2, B2, 'EV 충전 대기 불편 보도 (가상)')],
        },
      },
      {
        no: 3,
        cardNo: 4,
        title: '야간 운전자 휴식 패키지 (가상)',
        background: ['국내 언론이 해외 휴게시설의 심야 운전자 전용 상품 사례를 소개함 [1]'],
        content: ['심야 운영 매장에서 간단식 + 휴게 공간 안내 패키지 시범 운영'],
        effects: ['(고객) 졸음운전 예방에 도움', '(운영) 심야 시간대 매출 보완 가능성 [추측]'],
        plan: ['심야 이용 현황 확인(내부 확인 필요) → 패키지 구성 → 시범 운영'],
        attachment: {
          main: main(D, '해외 심야 운전자 휴식 상품 사례 소개 (가상)'),
          related: [],
        },
      },
    ],
    checklist: [
      { draftNo: 1, link: 'ok', oldestDate: A2.date, factMatch: 'warn', guessCount: 1, note: '기대효과의 재방문 관련 문장 확인' },
      { draftNo: 2, link: 'ok', oldestDate: B.date, factMatch: 'ok', guessCount: 1, note: '해외 사례 소개 기사 원문 확인' },
      { draftNo: 3, link: 'warn', oldestDate: D.date, factMatch: 'ok', guessCount: 1, note: '관련 기사 부족, 대표 기사 링크 직접 확인' },
    ],
    notes: '',
  }
}
