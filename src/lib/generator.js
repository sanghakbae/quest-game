// 체크리스트 → 판타지 던전 시나리오 + 퀘스트로 변환하는 규칙 기반 생성기.
import { makeRng } from './rng'
import {
  DIFFICULTIES,
  CATEGORIES,
  CATEGORY_LIST,
  QUEST_NAMES,
  THEME_NAMES,
  RANKS,
  RARITIES,
  SLOTS,
  SLOT_KEYS,
} from './content'

// 총 가중치로 던전 랭크 결정
function rankFor(totalWeight) {
  return RANKS.find((r) => totalWeight >= r.min) || RANKS[RANKS.length - 1]
}

// 항목들에서 최다 카테고리를 던전 테마로 (동점이면 첫 번째)
function dominantCategory(items) {
  const count = {}
  for (const it of items) count[it.category] = (count[it.category] || 0) + 1
  let best = items[0].category
  let bestN = 0
  for (const c of Object.keys(count)) {
    if (count[c] > bestN) {
      bestN = count[c]
      best = c
    }
  }
  return best
}

// 던전 도입부 플레이버 텍스트
function introText(rng, theme, rank, questCount) {
  const openers = [
    `${theme}의 문이 삐걱이며 열린다.`,
    `안개 너머로 ${theme}이(가) 모습을 드러낸다.`,
    `오래된 지도가 그대를 ${theme}으로 이끌었다.`,
    `${theme}에서 심상치 않은 기운이 흘러나온다.`,
  ]
  return `${rng.pick(openers)} 총 ${questCount}개의 시련과 ${rank}랭크의 위험이 그대를 기다린다.`
}

// 퀘스트 하나에 대한 몬스터/보상/플레이버 생성
function buildQuest(rng, item, rankInfo, isBoss) {
  const diff = DIFFICULTIES[item.difficulty]
  const cat = CATEGORIES[item.category]
  const monster = isBoss ? `${rng.pick(cat.monsters)} (보스)` : rng.pick(cat.monsters)
  const bossMult = isBoss ? 2.5 : 1

  const flavors = {
    전투: [`${monster}이(가) 길을 막아선다.`, `${monster}과(와)의 결투가 시작된다.`],
    탐험: [`${monster}이(가) 도사린 통로를 지나야 한다.`, `${monster}의 영역을 탐색한다.`],
    수집: [`${monster}이(가) 지키는 보물을 노린다.`, `${monster}에게서 전리품을 되찾는다.`],
    지식: [`${monster}이(가) 낸 수수께끼를 풀어야 한다.`, `${monster}의 봉인을 해독한다.`],
    사교: [`${monster}의 술수를 간파해야 한다.`, `${monster}과(와)의 심리전이 벌어진다.`],
  }

  return {
    id: `q_${item.id}`,
    sourceId: item.id,
    title: item.title,
    category: item.category,
    difficulty: item.difficulty,
    isBoss,
    monster,
    flavor: rng.pick(flavors[item.category]),
    xp: Math.round(diff.xp * rankInfo.mult * bossMult),
    gold: Math.round(diff.gold * rankInfo.mult * bossMult),
    lootChance: Math.min(0.95, diff.loot * (isBoss ? 1.6 : 1)),
    done: false,
  }
}

// 메인: 체크리스트를 시나리오로 변환
// checklist: { id, name, items: [{ id, title, difficulty, category }] }
export function generateScenario(checklist) {
  const items = checklist.items.filter((it) => it.title.trim())
  if (!items.length) throw new Error('체크리스트 항목이 필요합니다.')

  const totalWeight = items.reduce((s, it) => s + DIFFICULTIES[it.difficulty].weight, 0)
  const rankInfo = rankFor(totalWeight)
  const theme = dominantCategory(items)
  // 시드는 콘텐츠(이름+항목) 기반 → 미리보기와 실제 생성 결과가 일치한다.
  const seedStr = `${checklist.name || ''}|${items
    .map((i) => `${i.title}:${i.category}:${i.difficulty}`)
    .join('|')}`
  const rng = makeRng(seedStr)

  const dungeonName = rng.pick(THEME_NAMES[theme])

  // 가장 어려운(가중치 최대) 항목을 보스로. 동점이면 마지막 항목.
  let bossIdx = 0
  let bossW = -1
  items.forEach((it, i) => {
    const w = DIFFICULTIES[it.difficulty].weight
    if (w >= bossW) {
      bossW = w
      bossIdx = i
    }
  })

  const quests = items.map((it, i) => buildQuest(rng, it, rankInfo, i === bossIdx))

  return {
    id: `dg_${checklist.id}`,
    name: dungeonName,
    theme,
    rank: rankInfo.rank,
    rankColor: rankInfo.color,
    seed: seedStr,
    intro: introText(rng, dungeonName, rankInfo.rank, quests.length),
    quests,
    status: 'active',
    createdAt: Date.now(),
  }
}

// 플레이어 레벨에 맞춰 난이도 하나를 뽑는다(레벨이 높을수록 어려운 쪽으로).
function pickDifficulty(level, rng) {
  const r = rng.next()
  if (level <= 2) return r < 0.5 ? '쉬움' : r < 0.85 ? '보통' : '어려움'
  if (level <= 5) return r < 0.25 ? '쉬움' : r < 0.65 ? '보통' : r < 0.9 ? '어려움' : '극악'
  if (level <= 9) return r < 0.35 ? '보통' : r < 0.75 ? '어려움' : '극악'
  return r < 0.2 ? '보통' : r < 0.55 ? '어려움' : '극악'
}

// 랜덤 모험 자동 생성 — 사용자 입력 없이 판타지 퀘스트로 던전을 만든다.
// salt로 매번 다른 결과(호출부에서 Date.now() 등을 넘긴다).
export function generateRandomScenario(level = 1, salt = 0) {
  const rng = makeRng(`rnd|${salt}`)
  const theme = rng.pick(CATEGORY_LIST)
  const count = rng.int(3, 5)
  const usedTitles = new Set()

  const items = []
  for (let i = 0; i < count; i++) {
    // 대부분 테마 카테고리, 가끔 다른 카테고리를 섞는다.
    const cat = rng.chance(0.65) ? theme : rng.pick(CATEGORY_LIST)
    const pool = QUEST_NAMES[cat]
    let title = rng.pick(pool)
    let guard = 0
    while (usedTitles.has(title) && guard++ < 8) title = rng.pick(pool)
    usedTitles.add(title)
    items.push({ id: `${salt}_${i}`, title, category: cat, difficulty: pickDifficulty(level, rng) })
  }

  // 시드가 salt에 따라 달라지도록 이름에 salt를 섞는다(표시용 아님).
  return generateScenario({ id: `rnd${salt}`, name: `adv-${salt}`, items })
}

// 퀘스트 하나의 전리품을 굴린다. 드랍 없으면 null.
// 시드는 퀘스트 id + 캐릭터 운(luck)으로 → 운이 높으면 더 좋은 희귀도 확률.
export function rollLoot(quest, rankInfo, luck = 0) {
  const rng = makeRng(`${quest.id}|loot|${luck}`)
  if (!rng.chance(quest.lootChance)) return null

  // 희귀도 가중 선택 (운이 높을수록 상위 희귀도 가중치 상승)
  const luckBoost = 1 + Math.min(luck, 50) / 25
  const weights = RARITIES.map((r, i) => r.weight * (i >= 2 ? luckBoost : 1))
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = rng.next() * total
  let rarity = RARITIES[0]
  for (let i = 0; i < RARITIES.length; i++) {
    roll -= weights[i]
    if (roll <= 0) {
      rarity = RARITIES[i]
      break
    }
  }

  const slot = rng.pick(SLOT_KEYS)
  const def = SLOTS[slot]
  const tier = rankInfo.tier
  const typeName = rng.pick(def.names) // 종류는 무작위(다양성), 강함은 티어×희귀도로 표현
  const base = 3 + tier * 2
  const power = base * rarity.mult

  const stat = (k) => Math.max(0, Math.round(power * def.stats[k] * (0.8 + rng.next() * 0.4)))

  return {
    id: `it_${quest.id}_${rarity.name}`,
    name: `${rarity.name} ${typeName}`,
    slot,
    icon: def.icon,
    rarity: rarity.name,
    rarityColor: rarity.color,
    atk: stat('atk'),
    def: stat('def'),
    hp: stat('hp'),
    luck: stat('luck'),
  }
}
