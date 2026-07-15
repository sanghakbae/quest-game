// 규칙 기반 생성에 쓰이는 정적 데이터 — 카테고리별 테마, 몬스터, 전리품 풀.

// 난이도 정의: 가중치와 기본 보상 배수
export const DIFFICULTIES = {
  쉬움: { weight: 1, xp: 20, gold: 10, loot: 0.15 },
  보통: { weight: 2, xp: 45, gold: 25, loot: 0.3 },
  어려움: { weight: 3, xp: 90, gold: 55, loot: 0.5 },
  극악: { weight: 5, xp: 180, gold: 120, loot: 0.8 },
}
export const DIFFICULTY_LIST = Object.keys(DIFFICULTIES)

// 카테고리: 퀘스트 성격 + 몬스터 테마
export const CATEGORIES = {
  전투: { icon: '⚔️', monsters: ['고블린 전사', '오크 광전사', '살점포식자', '강철 골렘', '피의 기사'] },
  탐험: { icon: '🧭', monsters: ['동굴 박쥐', '함정 수호자', '미로의 슬라임', '지하 웜', '그림자 정찰병'] },
  수집: { icon: '💎', monsters: ['보물 흉내쟁이', '탐욕의 임프', '수정 거미', '광맥 두더지', '황금 골렘'] },
  지식: { icon: '📜', monsters: ['저주받은 서적', '수수께끼 스핑크스', '망령 사서', '룬 감시자', '고대 마도서'] },
  사교: { icon: '🎭', monsters: ['속임수 요정', '가면 광대', '매혹의 세이렌', '궁정 음모가', '거울 도플갱어'] },
}
export const CATEGORY_LIST = Object.keys(CATEGORIES)

// 카테고리별 던전 테마 이름 풀 (시드로 선택)
export const THEME_NAMES = {
  전투: ['화염 마룡의 소굴', '피의 투기장', '무너진 요새', '강철 군단의 진지', '분노의 화산 동굴'],
  탐험: ['잊혀진 지하 미궁', '안개의 협곡', '끝없는 나선 계단', '침묵의 지하수로', '별빛 없는 심연'],
  수집: ['탐욕왕의 보물고', '수정 광맥 던전', '황금 파묻힌 무덤', '용의 재화 창고', '반짝이는 종유동'],
  지식: ['고대 도서관의 미궁', '봉인된 마도탑', '룬이 새겨진 성소', '망각의 기록보관소', '별을 읽는 천문대'],
  사교: ['가면무도회의 저택', '거울 궁전', '유령 극장', '음모의 왕궁', '환영의 살롱'],
}

// 던전 랭크: 총 가중치 임계값 → 랭크. 위에서부터 처음 만족하는 것.
export const RANKS = [
  { rank: 'S', min: 40, color: '#ff5470', mult: 2.2, tier: 5 },
  { rank: 'A', min: 26, color: '#ff9f45', mult: 1.8, tier: 4 },
  { rank: 'B', min: 16, color: '#ffd23f', mult: 1.5, tier: 3 },
  { rank: 'C', min: 9, color: '#8ac926', mult: 1.25, tier: 2 },
  { rank: 'D', min: 5, color: '#4cc9f0', mult: 1.1, tier: 1 },
  { rank: 'E', min: 2, color: '#8d99ae', mult: 1.0, tier: 1 },
  { rank: 'F', min: 0, color: '#6c757d', mult: 0.9, tier: 0 },
]

// 전리품 희귀도
export const RARITIES = [
  { name: '일반', color: '#b0b8c4', mult: 1.0, weight: 50 },
  { name: '고급', color: '#4cc9f0', mult: 1.5, weight: 28 },
  { name: '희귀', color: '#c77dff', mult: 2.2, weight: 14 },
  { name: '영웅', color: '#ff9f45', mult: 3.2, weight: 6 },
  { name: '전설', color: '#ff5470', mult: 4.5, weight: 2 },
]

// 장비 슬롯별 아이템 이름 풀과 스탯 성향
export const LOOT = {
  weapon: {
    icon: '🗡️',
    names: ['녹슨 검', '강철 장검', '화염 도끼', '용살자의 창', '서리 대검', '천둥 망치', '그림자 단검', '성스러운 클레이모어'],
    stats: { atk: 1.0, def: 0.1, hp: 0.2, luck: 0.1 },
  },
  armor: {
    icon: '🛡️',
    names: ['가죽 갑옷', '사슬 갑옷', '판금 흉갑', '용비늘 갑주', '수호자의 방패', '마법 로브', '거인의 판금', '불멸의 성갑'],
    stats: { atk: 0.1, def: 1.0, hp: 0.6, luck: 0.1 },
  },
  accessory: {
    icon: '💍',
    names: ['구리 반지', '행운의 부적', '현자의 목걸이', '용의 눈 보석', '수호 룬석', '별빛 팔찌', '왕의 인장', '영원의 성물'],
    stats: { atk: 0.3, def: 0.3, hp: 0.3, luck: 1.0 },
  },
}
export const SLOT_LABELS = { weapon: '무기', armor: '방어구', accessory: '장신구' }

// 던전 클리어 시 부여 가능한 칭호 (누적 클리어 수 기준)
export const TITLES = [
  { at: 1, name: '초보 모험가' },
  { at: 3, name: '던전 탐험가' },
  { at: 7, name: '숙련된 정복자' },
  { at: 15, name: '전설의 영웅' },
  { at: 30, name: '차원의 지배자' },
]
