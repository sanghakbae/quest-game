# 컨텍스트 노트 — 체크리스트 던전

작업 중 내린 결정과 이유를 계속 append.

## 컨셉 (사용자 확정)
- 핵심: **판타지 RPG 시나리오**. 체크리스트로 던전/모험 시나리오가 자동 생성되고, 퀘스트를 깨며 캐릭터가 성장.
- 스택: **React + Vite + Firebase** (기존 api 프로젝트와 동일 패턴).
- 생성 방식: **규칙 기반 자동생성** (LLM/API 불필요, 오프라인 동작).

## 핵심 설계 결정
1. **오프라인 우선 / Firebase 선택적**
   - api 프로젝트의 `firebase.js` 패턴 재사용: env 없으면 `isFirebaseConfigured=false`.
   - store.js가 이를 감지해 localStorage로 폴백 → env 설정 없이도 즉시 실행 가능.
   - 이유: 사용자가 바로 플레이할 수 있어야 하고, Firebase 연동은 나중에 키만 넣으면 됨.

2. **시드 기반 결정적 생성 (rng.js)**
   - 체크리스트 id + 항목 인덱스로 시드를 만들어 몬스터/전리품/플레이버 텍스트를 뽑음.
   - 이유: 같은 던전을 다시 봐도 내용이 흔들리지 않고, "규칙 기반"이 무작위 쓰레기가 아니라 재현 가능한 결과가 되게.

3. **규칙 기반 생성 매핑**
   - 난이도: 쉬움(1) / 보통(2) / 어려움(3) / 극악(5) → 가중치.
   - 카테고리: 전투/탐험/수집/지식/사교 → 몬스터 테마 + 퀘스트 아키타입.
   - 던전 랭크: 총 가중치 합 → F~S 랭크 (임계값 테이블).
   - 층수/퀘스트 수 = 항목 수. 가장 어려운 항목 = 보스 퀘스트.
   - 던전 테마 = 최다 카테고리 → 테마 풀에서 시드로 이름 선택.

4. **성장 규칙 (game.js)**
   - XP = 난이도 기본치 × 랭크 배수. 레벨업 임계 = round(100 * level^1.5).
   - 레벨업 시 maxHp/atk/def 증가 + 스탯 포인트.
   - 장비 슬롯: 무기/방어구/장신구. 전리품 착용 시 스탯 합산.
   - 전리품 드랍: 난이도 기반 확률, 티어는 랭크 기반, 희귀도 rng.

## 데이터 모델
- Character: `{ name, level, xp, hp/maxHp, atk, def, luck, gold, statPoints, equipment{weapon,armor,accessory}, inventory[], cleared, titles[] }`
- Scenario: `{ id, name, theme, rank, seed, intro, quests[], status, createdAt }`
- Quest: `{ id, title, category, difficulty, xp, gold, monster, flavor, lootChance, done }`
- Item: `{ id, name, slot, tier, rarity, atk, def, hp, luck, icon }`

## 미해결 / TODO
- Firebase 실제 프로젝트 연동은 사용자가 키 제공 시.
- 배포(Cloudflare Pages / Firebase Hosting)는 요청 시.
