# 체크리스트 던전 — 개발 체크리스트

## 0. 설계
- [x] 컨셉 확정: 판타지 RPG 시나리오 + React+Vite+Firebase + 규칙 기반 자동생성
- [x] 데이터 모델 정의 (캐릭터 / 시나리오 / 퀘스트 / 아이템)
- [x] 계획·체크리스트·컨텍스트 노트 작성

## 1. 스캐폴딩
- [x] package.json / vite.config.js / index.html / .gitignore / .env.example
- [x] firebase.js (env 없으면 자동 비활성화 → localStorage 폴백)
- [x] main.jsx / App.jsx / styles.css

## 2. 코어 로직 (규칙 기반, API 불필요)
- [x] lib/rng.js — 시드 기반 난수 (재현 가능한 생성)
- [x] lib/content.js — 테마 풀 / 몬스터 / 전리품 테이블 (데이터)
- [x] lib/generator.js — 체크리스트 → 던전 시나리오 + 퀘스트 생성 규칙
- [x] lib/game.js — 경험치/레벨업/스탯/장비/전리품 성장 규칙
- [x] lib/store.js — 저장/불러오기 (Firebase or localStorage)

## 3. UI
- [x] context/GameContext.jsx — 게임 상태 전역 관리
- [x] pages/Home — 캐릭터 시트 + 던전 목록
- [x] pages/Create — 체크리스트 작성 → 시나리오 미리보기 → 생성
- [x] pages/Dungeon — 시나리오 진행, 퀘스트 클리어
- [x] components — CharacterPanel / Inventory / Toast

## 4. 검증 (CLAUDE.md #8)
- [x] npm install 성공
- [x] npm run build 성공 (컴파일 검증)
- [x] dev 서버 실행 후 브라우저로 핵심 흐름 확인
  - [x] 체크리스트 작성 → 던전 생성 (라이브 미리보기)
  - [x] 퀘스트 클리어 → 경험치/골드 획득 → 레벨업 (Lv.1→4)
  - [x] 전리품 획득 → 장비 착용 → 스탯 변화 (공격력 +6 등)
  - [x] 던전 전체 클리어 → 보상/칭호 (초보 모험가)
  - [x] 새로고침 후 저장 상태 유지 (localStorage)
- [x] 미리보기=실제 생성 결과 일치 (시드 콘텐츠 기반으로 수정)
- [x] 시맨틱 커밋

## 향후(요청 시)
- [ ] Firebase 실제 연동 + Google 로그인
- [ ] Cloudflare Pages / Firebase Hosting 배포
- [ ] 사운드/애니메이션, 상점, 스킬 트리 등 콘텐츠 확장
