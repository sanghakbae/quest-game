// 턴기반 전투 오버레이 — 플레이어 vs 몬스터. 승리 시 onWin(보상), 패배 시 재도전/후퇴.
import { useState } from 'react'
import { makeMonster, playerStrike, monsterStrike, POTION_HEAL, POTION_MAX } from '../lib/battle'
import { makeRng } from '../lib/rng'
import { CATEGORIES } from '../lib/content'

export default function Battle({ player, quest, rankInfo, onWin, onClose }) {
  const monster = makeMonster(quest, rankInfo)
  const icon = CATEGORIES[quest.category].icon

  const [playerHp, setPlayerHp] = useState(player.maxHp)
  const [monsterHp, setMonsterHp] = useState(monster.maxHp)
  const [potions, setPotions] = useState(POTION_MAX)
  const [turn, setTurn] = useState(0)
  const [log, setLog] = useState([`${monster.name}이(가) 나타났다!`])
  const [phase, setPhase] = useState('fighting') // fighting | won | lost
  const [busy, setBusy] = useState(false)

  const pushLog = (line) => setLog((l) => [...l.slice(-4), line])

  const restart = () => {
    setPlayerHp(player.maxHp)
    setMonsterHp(monster.maxHp)
    setPotions(POTION_MAX)
    setTurn(0)
    setLog([`${monster.name}에게 다시 도전한다!`])
    setPhase('fighting')
    setBusy(false)
  }

  // 몬스터 반격 → 플레이어 HP 갱신, 사망 판정
  const monsterTurn = (curPlayerHp, defending) => {
    setBusy(true)
    setTimeout(() => {
      const rng = makeRng(`${quest.id}|${turn}|m`)
      const res = monsterStrike(monster, player, defending, rng)
      const pHp = curPlayerHp - res.damage
      pushLog(`👹 ${monster.name}의 반격 — 내 HP -${res.damage}`)
      setPlayerHp(Math.max(0, pHp))
      if (pHp <= 0) {
        setPhase('lost')
        pushLog('💀 쓰러졌다…')
      }
      setTurn((t) => t + 1)
      setBusy(false)
    }, 500)
  }

  const act = (type) => {
    if (busy || phase !== 'fighting') return

    if (type === 'potion') {
      if (potions <= 0) return
      const heal = Math.round(player.maxHp * POTION_HEAL)
      const newHp = Math.min(player.maxHp, playerHp + heal)
      pushLog(`🧪 물약 사용 — HP +${newHp - playerHp}`)
      setPlayerHp(newHp)
      setPotions((p) => p - 1)
      monsterTurn(newHp, false)
      return
    }

    if (type === 'defend') {
      pushLog('🛡️ 방어 태세를 취한다')
      monsterTurn(playerHp, true)
      return
    }

    // attack | power
    const rng = makeRng(`${quest.id}|${turn}|${type}`)
    const res = playerStrike(player, monster, type, rng)
    if (res.miss) {
      pushLog('💨 강공격이 빗나갔다!')
    } else {
      pushLog(`${res.crit ? '💥 치명타! ' : '⚔️ '}${monster.name}에게 ${res.damage} 피해`)
    }
    const mHp = monsterHp - res.damage
    setMonsterHp(Math.max(0, mHp))
    if (mHp <= 0) {
      setPhase('won')
      pushLog('🎉 승리!')
      return
    }
    monsterTurn(playerHp, false)
  }

  const pPct = Math.max(0, Math.round((playerHp / player.maxHp) * 100))
  const mPct = Math.max(0, Math.round((monsterHp / monster.maxHp) * 100))

  return (
    <div className="battle-overlay" onClick={(e) => e.target === e.currentTarget && phase !== 'fighting' && onClose()}>
      <div className="battle">
        <div className="battle-head">
          <span className={`b-quest ${quest.isBoss ? 'boss' : ''}`}>
            {quest.isBoss ? '👑 보스전' : '⚔️ 전투'} · {quest.title}
          </span>
        </div>

        {/* 몬스터 */}
        <div className="combatant monster">
          <div className="c-icon big">{icon}</div>
          <div className="c-info">
            <div className="c-name">
              {monster.name} <span className="c-mstat">⚔️{monster.atk} 🛡️{monster.def}</span>
            </div>
            <div className="hpbar mob">
              <div className="hpbar-fill" style={{ width: `${mPct}%` }} />
              <span className="hpbar-text">{Math.max(0, monsterHp)} / {monster.maxHp}</span>
            </div>
          </div>
        </div>

        {/* 전투 로그 */}
        <div className="battle-log">
          {log.map((l, i) => (
            <div key={i} className={i === log.length - 1 ? 'log-new' : ''}>
              {l}
            </div>
          ))}
        </div>

        {/* 플레이어 */}
        <div className="combatant player">
          <div className="c-icon big">🧝</div>
          <div className="c-info">
            <div className="c-name">
              나 <span className="c-mstat">⚔️{player.atk} 🛡️{player.def} 🍀{player.luck}</span>
            </div>
            <div className="hpbar">
              <div className="hpbar-fill" style={{ width: `${pPct}%` }} />
              <span className="hpbar-text">{Math.max(0, playerHp)} / {player.maxHp}</span>
            </div>
          </div>
        </div>

        {/* 액션 / 결과 */}
        {phase === 'fighting' && (
          <div className="battle-actions">
            <button className="b-act" disabled={busy} onClick={() => act('attack')}>
              ⚔️ 공격
            </button>
            <button className="b-act" disabled={busy} onClick={() => act('power')}>
              💥 강공격
              <small>1.7배·명중70%</small>
            </button>
            <button className="b-act" disabled={busy} onClick={() => act('defend')}>
              🛡️ 방어
              <small>피해 절반</small>
            </button>
            <button className="b-act" disabled={busy || potions <= 0} onClick={() => act('potion')}>
              🧪 물약 ({potions})
              <small>HP +{Math.round(POTION_HEAL * 100)}%</small>
            </button>
          </div>
        )}

        {phase === 'won' && (
          <div className="battle-result win">
            <div className="br-title">🎉 승리!</div>
            <button
              className="btn big"
              onClick={() => {
                onWin()
                onClose()
              }}
            >
              보상 받기 (+{quest.xp} XP · +{quest.gold} G)
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="battle-result lose">
            <div className="br-title">💀 패배…</div>
            <p className="br-sub">더 강해진 뒤 다시 도전하세요.</p>
            <div className="br-buttons">
              <button className="btn" onClick={restart}>
                다시 도전
              </button>
              <button className="btn ghost" onClick={onClose}>
                후퇴
              </button>
            </div>
          </div>
        )}

        {phase === 'fighting' && (
          <button className="flee" onClick={onClose}>
            후퇴하기
          </button>
        )}
      </div>
    </div>
  )
}
