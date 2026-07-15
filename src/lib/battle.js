// 턴기반 전투 로직 — 몬스터 생성과 데미지 계산(순수 함수). UI 상태는 컴포넌트에서 관리.
import { makeRng } from './rng'
import { DIFFICULTIES } from './content'

// 몬스터 스탯 생성 (퀘스트 난이도 × 던전 랭크 배수 기반, 결정적)
export function makeMonster(quest, rankInfo) {
  const w = DIFFICULTIES[quest.difficulty].weight
  const m = rankInfo.mult
  const boss = quest.isBoss
  return {
    name: quest.monster,
    isBoss: boss,
    maxHp: Math.round((18 * w * m + 12) * (boss ? 1.8 : 1)),
    atk: Math.round((2.6 * w * m + 3) * (boss ? 1.3 : 1)),
    def: Math.round(1.2 * w * m + 1),
  }
}

// 기본 데미지: 공격력에서 상대 방어력 절반을 뺀 값(최소 1)
function baseDamage(atk, def) {
  return Math.max(1, atk - def * 0.5)
}

// 플레이어 공격 결과 계산. type: 'attack' | 'power'
// rng는 컴포넌트가 매 턴 새로 만들어 넘긴다(라벨로 시드 분리).
export function playerStrike(player, monster, type, rng) {
  const power = type === 'power'
  if (power && rng.chance(0.3)) {
    return { damage: 0, miss: true, crit: false }
  }
  const critChance = Math.min(0.5, player.luck * 0.015)
  const crit = rng.chance(critChance)
  let dmg = baseDamage(player.atk, monster.def)
  dmg *= power ? 1.7 : 1
  dmg *= 0.85 + rng.next() * 0.3 // 변동 0.85~1.15
  if (crit) dmg *= 2
  return { damage: Math.max(1, Math.round(dmg)), miss: false, crit }
}

// 몬스터 공격 결과. defending이면 피해 절반.
export function monsterStrike(monster, player, defending, rng) {
  let dmg = baseDamage(monster.atk, player.def)
  dmg *= 0.85 + rng.next() * 0.3
  if (defending) dmg *= 0.5
  return { damage: Math.max(1, Math.round(dmg)) }
}

export const POTION_HEAL = 0.45 // 최대 HP의 45% 회복
export const POTION_MAX = 2 // 전투당 물약 횟수
