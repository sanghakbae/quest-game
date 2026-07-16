// 캐릭터 성장 규칙 — 경험치/레벨업/스탯/장비 착용/전리품 반영.
import { RANKS, TITLES, SLOT_KEYS } from './content'
import { rollLoot } from './generator'

// 모든 슬롯을 null로 채운 빈 장비 객체
export function emptyEquipment() {
  return Object.fromEntries(SLOT_KEYS.map((k) => [k, null]))
}

export function rankInfoByName(name) {
  return RANKS.find((r) => r.rank === name) || RANKS[RANKS.length - 1]
}

// 레벨업에 필요한 누적 경험치 임계값
export function xpToNext(level) {
  return Math.round(100 * Math.pow(level, 1.5))
}

// 새 캐릭터 초기 상태
export function newCharacter(name = '이름 없는 모험가') {
  return {
    name,
    level: 1,
    xp: 0,
    baseMaxHp: 100,
    baseAtk: 10,
    baseDef: 5,
    baseLuck: 3,
    gold: 0,
    statPoints: 0,
    equipment: emptyEquipment(),
    inventory: [],
    cleared: 0,
    titles: [],
  }
}

// 저장 데이터 마이그레이션 — 새 슬롯 체계로 정규화.
// 없는 슬롯은 null로 채우고, 더 이상 없는 슬롯('accessory' 등)의 아이템은 인벤토리로 되돌린다.
const LEGACY_SLOT_MAP = { accessory: 'ring' } // 구버전 슬롯 → 새 슬롯

function remapItem(item) {
  const mapped = LEGACY_SLOT_MAP[item.slot]
  return mapped ? { ...item, slot: mapped } : item
}

export function normalizeCharacter(char) {
  if (!char) return char
  const equipment = emptyEquipment()
  const inventory = (char.inventory || []).map(remapItem)
  const old = char.equipment || {}
  for (const key of Object.keys(old)) {
    if (!old[key]) continue
    const item = remapItem(old[key])
    if (SLOT_KEYS.includes(item.slot) && equipment[item.slot] === null) {
      equipment[item.slot] = item
    } else {
      inventory.push(item) // 슬롯이 이미 찼거나 알 수 없으면 인벤토리로 회수
    }
  }
  return { ...char, equipment, inventory }
}

// 장비 보너스 합산
export function equipBonus(char) {
  const b = { atk: 0, def: 0, hp: 0, luck: 0 }
  for (const slot of Object.keys(char.equipment)) {
    const it = char.equipment[slot]
    if (!it) continue
    b.atk += it.atk || 0
    b.def += it.def || 0
    b.hp += it.hp || 0
    b.luck += it.luck || 0
  }
  return b
}

// 장비 포함 최종 스탯
export function totalStats(char) {
  const b = equipBonus(char)
  return {
    maxHp: char.baseMaxHp + b.hp,
    atk: char.baseAtk + b.atk,
    def: char.baseDef + b.def,
    luck: char.baseLuck + b.luck,
  }
}

// 경험치 적용 + 연쇄 레벨업 처리. { char, levelsGained } 반환.
function applyXp(char, amount) {
  let c = { ...char, xp: char.xp + amount }
  let levelsGained = 0
  while (c.xp >= xpToNext(c.level)) {
    c.xp -= xpToNext(c.level)
    c.level += 1
    levelsGained += 1
    c.baseMaxHp += 20
    c.baseAtk += 3
    c.baseDef += 2
    c.baseLuck += 1
    c.statPoints += 3
  }
  return { char: c, levelsGained }
}

// 퀘스트 완료 처리. 보상 계산 + 전리품 굴림.
// 반환: { char, rewards: { xp, gold, loot, levelsGained } }
export function completeQuest(char, quest, rankName) {
  const rankInfo = rankInfoByName(rankName)
  const { luck } = totalStats(char)
  const loot = rollLoot(quest, rankInfo, luck)

  let c = { ...char, gold: char.gold + quest.gold }
  if (loot) c = { ...c, inventory: [...c.inventory, loot] }

  const res = applyXp(c, quest.xp)
  return {
    char: res.char,
    rewards: { xp: quest.xp, gold: quest.gold, loot, levelsGained: res.levelsGained },
  }
}

// 던전 전체 클리어 보너스 + 칭호 획득
// 반환: { char, bonus: { xp, gold, newTitles } }
export function clearDungeon(char, scenario) {
  const bonusGold = scenario.quests.reduce((s, q) => s + q.gold, 0)
  const bonusXp = Math.round(scenario.quests.reduce((s, q) => s + q.xp, 0) * 0.5)

  let c = { ...char, gold: char.gold + bonusGold, cleared: char.cleared + 1 }
  const res = applyXp(c, bonusXp)
  c = res.char

  const newTitles = TITLES.filter((t) => c.cleared >= t.at && !c.titles.includes(t.name)).map(
    (t) => t.name
  )
  if (newTitles.length) c = { ...c, titles: [...c.titles, ...newTitles] }

  return { char: c, bonus: { xp: bonusXp, gold: bonusGold, newTitles, levelsGained: res.levelsGained } }
}

// 아이템 착용. 기존 장비는 인벤토리로 되돌린다.
export function equipItem(char, item) {
  const slot = item.slot
  const prev = char.equipment[slot]
  const idx = char.inventory.indexOf(item)
  const newInv =
    idx >= 0 ? [...char.inventory.slice(0, idx), ...char.inventory.slice(idx + 1)] : [...char.inventory]
  if (prev) newInv.push(prev)
  return { ...char, equipment: { ...char.equipment, [slot]: item }, inventory: newInv }
}

// 장비 해제 — 착용 중인 아이템을 인벤토리로 되돌린다.
export function unequipItem(char, slot) {
  const item = char.equipment[slot]
  if (!item) return char
  return {
    ...char,
    equipment: { ...char.equipment, [slot]: null },
    inventory: [...char.inventory, item],
  }
}

// 아이템 판매 (골드 획득, 인벤토리에서 제거)
export function sellItem(char, item) {
  const price = Math.max(5, Math.round((item.atk + item.def + item.hp + item.luck) * 2))
  const idx = char.inventory.indexOf(item)
  if (idx < 0) return { char, price: 0 }
  const newInv = [...char.inventory.slice(0, idx), ...char.inventory.slice(idx + 1)]
  return { char: { ...char, inventory: newInv, gold: char.gold + price }, price }
}
