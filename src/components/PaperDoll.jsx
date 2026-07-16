// 캐릭터 종이인형 — 사람 모양 위 부위별 위치에 착용 아이템을 표시한다. 착용 부위 클릭 시 해제.
import { SLOTS, SLOT_KEYS } from '../lib/content'

export default function PaperDoll({ equipment, onUnequip }) {
  return (
    <div className="paperdoll">
      <svg className="doll-figure" viewBox="0 0 100 130" aria-hidden="true">
        <g stroke="var(--doll)" strokeWidth="9" strokeLinecap="round" fill="none">
          <line x1="30" y1="38" x2="70" y2="38" /> {/* 어깨 */}
          <line x1="50" y1="30" x2="50" y2="72" /> {/* 몸통 */}
          <line x1="32" y1="40" x2="17" y2="68" /> {/* 왼팔 */}
          <line x1="68" y1="40" x2="83" y2="68" /> {/* 오른팔 */}
          <line x1="45" y1="72" x2="39" y2="114" /> {/* 왼다리 */}
          <line x1="55" y1="72" x2="61" y2="114" /> {/* 오른다리 */}
        </g>
        <circle cx="50" cy="16" r="11" fill="var(--doll)" />
      </svg>

      {SLOT_KEYS.map((key) => {
        const slot = SLOTS[key]
        const item = equipment?.[key] || null
        return (
          <button
            key={key}
            type="button"
            className={`doll-slot ${item ? 'filled' : 'empty'}`}
            style={{
              left: `${slot.pos.left}%`,
              top: `${slot.pos.top}%`,
              borderColor: item ? item.rarityColor : undefined,
            }}
            title={item ? `${slot.label}: ${item.name} (클릭하여 해제)` : `${slot.label} (비어 있음)`}
            onClick={() => item && onUnequip(key)}
          >
            <span className="doll-icon">{item ? item.icon : slot.icon}</span>
            <span className="doll-label" style={item ? { color: item.rarityColor } : undefined}>
              {slot.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
