// 인벤토리 — 획득한 전리품을 나열하고 장착/판매를 지원한다.
import { useGame } from '../context/GameContext'
import { SLOT_LABELS } from '../lib/content'

function statLine(it) {
  const parts = []
  if (it.atk) parts.push(`⚔️${it.atk}`)
  if (it.def) parts.push(`🛡️${it.def}`)
  if (it.hp) parts.push(`❤️${it.hp}`)
  if (it.luck) parts.push(`🍀${it.luck}`)
  return parts.join(' ')
}

export default function Inventory() {
  const { character, equip, sell } = useGame()
  const inv = character.inventory

  return (
    <div className="panel">
      <h3 className="panel-title">🎒 인벤토리 ({inv.length})</h3>
      {inv.length === 0 ? (
        <p className="empty-hint">아직 전리품이 없습니다. 던전에서 퀘스트를 클리어하세요.</p>
      ) : (
        <ul className="inv-list">
          {inv.map((it, i) => {
            const equipped = character.equipment[it.slot]
            const better = equipped
              ? it.atk + it.def + it.hp + it.luck - (equipped.atk + equipped.def + equipped.hp + equipped.luck)
              : null
            return (
              <li key={i} className="inv-item" style={{ borderLeftColor: it.rarityColor }}>
                <div className="inv-main">
                  <span className="inv-name" style={{ color: it.rarityColor }}>
                    {it.icon} {it.name}
                  </span>
                  <span className="inv-slot">{SLOT_LABELS[it.slot]}</span>
                </div>
                <div className="inv-stats">{statLine(it)}</div>
                {better !== null && (
                  <div className={`inv-compare ${better >= 0 ? 'up' : 'down'}`}>
                    현재 장비 대비 {better >= 0 ? '+' : ''}
                    {better}
                  </div>
                )}
                <div className="inv-actions">
                  <button className="btn-sm" onClick={() => equip(it)}>
                    장착
                  </button>
                  <button className="btn-sm ghost" onClick={() => sell(it)}>
                    판매
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
