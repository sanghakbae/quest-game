// 캐릭터 시트 — 이름/레벨/경험치/스탯/장비/칭호를 보여주고 이름 변경을 지원한다.
import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { totalStats, equipBonus, xpToNext } from '../lib/game'
import PaperDoll from './PaperDoll'

export default function CharacterPanel() {
  const { character, renameCharacter, unequip } = useGame()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(character.name)

  const st = totalStats(character)
  const bonus = equipBonus(character)
  const need = xpToNext(character.level)
  const pct = Math.min(100, Math.round((character.xp / need) * 100))

  const saveName = () => {
    renameCharacter(name)
    setEditing(false)
  }

  const StatRow = ({ icon, label, base, add }) => (
    <div className="stat-row">
      <span className="stat-label">
        {icon} {label}
      </span>
      <span className="stat-val">
        {base + add}
        {add > 0 && <span className="stat-bonus"> (+{add})</span>}
      </span>
    </div>
  )

  return (
    <div className="panel char-panel">
      <div className="char-head">
        {editing ? (
          <div className="name-edit">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              maxLength={20}
              autoFocus
            />
            <button onClick={saveName}>저장</button>
          </div>
        ) : (
          <h2 className="char-name" onClick={() => setEditing(true)} title="클릭하여 이름 변경">
            {character.name} <span className="edit-hint">✎</span>
          </h2>
        )}
        <div className="char-lv">Lv.{character.level}</div>
      </div>

      {character.titles.length > 0 && (
        <div className="titles">
          {character.titles.map((t) => (
            <span key={t} className="title-badge">
              🏅 {t}
            </span>
          ))}
        </div>
      )}

      <div className="xp-bar" title={`${character.xp} / ${need} XP`}>
        <div className="xp-fill" style={{ width: `${pct}%` }} />
        <span className="xp-text">
          {character.xp} / {need} XP
        </span>
      </div>

      <div className="stats">
        <StatRow icon="❤️" label="체력" base={character.baseMaxHp} add={bonus.hp} />
        <StatRow icon="⚔️" label="공격력" base={character.baseAtk} add={bonus.atk} />
        <StatRow icon="🛡️" label="방어력" base={character.baseDef} add={bonus.def} />
        <StatRow icon="🍀" label="행운" base={character.baseLuck} add={bonus.luck} />
      </div>

      <PaperDoll equipment={character.equipment} onUnequip={unequip} />
      <p className="doll-hint">부위를 눌러 장착 해제 · 인벤토리에서 장착</p>

      <div className="char-foot">
        <span>💰 {character.gold} G</span>
        <span>🗺️ 클리어 {character.cleared}</span>
      </div>
    </div>
  )
}
