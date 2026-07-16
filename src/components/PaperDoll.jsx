// 캐릭터 종이인형 — 사람 모양 위 부위별 위치에 착용 아이템을 표시한다. 착용 부위 클릭 시 해제.
import { SLOTS, SLOT_KEYS } from '../lib/content'

export default function PaperDoll({ equipment, onUnequip }) {
  return (
    <div className="paperdoll">
      <svg className="doll-figure" viewBox="0 0 100 130" aria-hidden="true">
        <defs>
          <linearGradient id="dollBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#565f97" />
            <stop offset="1" stopColor="#2b3157" />
          </linearGradient>
        </defs>
        {/* 바닥 그림자 */}
        <ellipse cx="50" cy="125" rx="23" ry="3.4" fill="rgba(0,0,0,0.35)" />
        <g fill="url(#dollBody)">
          {/* 다리 */}
          <rect x="40.5" y="72" width="9" height="44" rx="4.5" />
          <rect x="50.5" y="72" width="9" height="44" rx="4.5" />
          <ellipse cx="45" cy="117" rx="6.2" ry="3.2" />
          <ellipse cx="55" cy="117" rx="6.2" ry="3.2" />
          {/* 팔 */}
          <rect x="23" y="35" width="8" height="35" rx="4" transform="rotate(9 27 52)" />
          <rect x="69" y="35" width="8" height="35" rx="4" transform="rotate(-9 73 52)" />
          <circle cx="22" cy="70" r="4.6" />
          <circle cx="78" cy="70" r="4.6" />
          {/* 몸통 */}
          <path d="M35 35 Q33.5 30 39 29 L61 29 Q66.5 30 65 35 L61 67 Q60 72 53.5 72 L46.5 72 Q40 72 39 67 Z" />
          {/* 목 */}
          <rect x="45.5" y="21" width="9" height="9" rx="3.5" />
          {/* 머리 */}
          <circle cx="50" cy="14.5" r="10.5" />
        </g>
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
