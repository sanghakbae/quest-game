// 캐릭터 장비창 — 가운데 일러스트 영웅, 양옆에 부위별 장착 슬롯. 슬롯 클릭 시 해제.
import { SLOTS } from '../lib/content'

const LEFT = ['weapon', 'offhand', 'armor', 'top', 'bottom']
const RIGHT = ['inner', 'earring', 'ring', 'bracelet']

function Slot({ slotKey, item, onUnequip }) {
  const slot = SLOTS[slotKey]
  return (
    <button
      type="button"
      className={`doll-slot ${item ? 'filled' : 'empty'}`}
      style={{ borderColor: item ? item.rarityColor : undefined }}
      title={item ? `${slot.label}: ${item.name} (클릭하여 해제)` : `${slot.label} (비어 있음)`}
      onClick={() => item && onUnequip(slotKey)}
    >
      <span className="doll-icon">{item ? item.icon : slot.icon}</span>
      <span className="doll-label" style={item ? { color: item.rarityColor } : undefined}>
        {slot.label}
      </span>
    </button>
  )
}

function Hero() {
  return (
    <svg className="doll-hero" viewBox="0 0 120 175" aria-hidden="true">
      <defs>
        <radialGradient id="aura" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#8b6bff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8b6bff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe0c0" />
          <stop offset="1" stopColor="#f0b78a" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a30" />
          <stop offset="1" stopColor="#5a3a1e" />
        </linearGradient>
        <linearGradient id="armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f9ce6" />
          <stop offset="1" stopColor="#3b4590" />
        </linearGradient>
        <linearGradient id="armorL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#aab4f2" />
          <stop offset="1" stopColor="#5560ad" />
        </linearGradient>
        <linearGradient id="cape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d24d72" />
          <stop offset="1" stopColor="#8a2447" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe071" />
          <stop offset="1" stopColor="#e0a028" />
        </linearGradient>
        <linearGradient id="pants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5286" />
          <stop offset="1" stopColor="#2e3560" />
        </linearGradient>
      </defs>

      {/* 오라 + 바닥 */}
      <circle cx="60" cy="80" r="66" fill="url(#aura)" />
      <ellipse cx="60" cy="166" rx="30" ry="4.5" fill="rgba(0,0,0,0.4)" />

      {/* 망토 */}
      <path d="M43 82 L77 82 L88 156 Q60 142 32 156 Z" fill="url(#cape)" />
      <path d="M60 84 L60 150 Q49 148 40 152 Z" fill="#00000022" />

      {/* 다리 + 부츠 */}
      <rect x="50" y="116" width="8.5" height="26" rx="3.5" fill="url(#pants)" />
      <rect x="61.5" y="116" width="8.5" height="26" rx="3.5" fill="url(#pants)" />
      <path d="M46 138 h13 v6 q0 3 -3 3 h-13 q-2 0 -2 -2 z" fill="#2a2036" />
      <path d="M74 138 h-13 v6 q0 3 3 3 h13 q2 0 2 -2 z" fill="#2a2036" />

      {/* 팔 + 손(장갑) */}
      <rect x="36" y="86" width="9" height="26" rx="4.5" fill="url(#armor)" transform="rotate(6 40 99)" />
      <rect x="75" y="86" width="9" height="26" rx="4.5" fill="url(#armor)" transform="rotate(-6 80 99)" />
      <circle cx="39" cy="114" r="5" fill="url(#gold)" />
      <circle cx="81" cy="114" r="5" fill="url(#gold)" />

      {/* 몸통 갑옷 */}
      <path d="M43 84 Q60 79 77 84 L74 116 Q60 121 46 116 Z" fill="url(#armor)" />
      <path d="M60 82 V119" stroke="#ffffff22" strokeWidth="1.5" />
      {/* 가슴 문장 */}
      <path d="M60 91 l6 6 -6 8 -6 -8 z" fill="url(#gold)" />
      {/* 벨트 */}
      <rect x="45" y="110" width="30" height="6" rx="1.5" fill="url(#gold)" />
      <rect x="56" y="108.5" width="8" height="9" rx="1.5" fill="#c98a1e" />
      {/* 어깨 보호구 */}
      <circle cx="44" cy="85" r="8" fill="url(#armorL)" />
      <circle cx="76" cy="85" r="8" fill="url(#armorL)" />
      <circle cx="44" cy="85" r="8" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
      <circle cx="76" cy="85" r="8" fill="none" stroke="url(#gold)" strokeWidth="1.5" />

      {/* 목 + 머리 */}
      <rect x="55" y="72" width="10" height="9" rx="3" fill="url(#skin)" />
      <circle cx="34" cy="52" r="4.5" fill="url(#skin)" />
      <circle cx="86" cy="52" r="4.5" fill="url(#skin)" />
      <circle cx="60" cy="50" r="26" fill="url(#skin)" />

      {/* 얼굴 */}
      <circle cx="49" cy="65" r="3.2" fill="#ff9a9a" opacity="0.5" />
      <circle cx="71" cy="65" r="3.2" fill="#ff9a9a" opacity="0.5" />
      <ellipse cx="51" cy="56" rx="4" ry="5.6" fill="#2c2c40" />
      <ellipse cx="69" cy="56" rx="4" ry="5.6" fill="#2c2c40" />
      <circle cx="52.4" cy="53.6" r="1.5" fill="#fff" />
      <circle cx="70.4" cy="53.6" r="1.5" fill="#fff" />
      <path d="M45 47 Q51 44 56 47" stroke="#5a3a1e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M64 47 Q69 44 75 47" stroke="#5a3a1e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M55 67 Q60 71 65 67" stroke="#c8785a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* 머리카락 */}
      <path
        d="M33 54 Q28 20 60 18 Q92 20 87 54 Q83 42 74 45 Q71 30 61 34 Q56 26 50 34 Q47 33 46 45 Q37 42 33 54 Z"
        fill="url(#hair)"
      />
      <path d="M40 30 Q52 22 62 26" stroke="#a5723e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* 서클릿 */}
      <path d="M37 43 Q60 34 83 43" stroke="url(#gold)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M60 37 l3 3 -3 4 -3 -4 z" fill="#ff5470" />
    </svg>
  )
}

export default function PaperDoll({ equipment, onUnequip }) {
  return (
    <div className="paperdoll">
      <div className="doll-col">
        {LEFT.map((k) => (
          <Slot key={k} slotKey={k} item={equipment?.[k] || null} onUnequip={onUnequip} />
        ))}
      </div>
      <div className="doll-stage">
        <Hero />
      </div>
      <div className="doll-col">
        {RIGHT.map((k) => (
          <Slot key={k} slotKey={k} item={equipment?.[k] || null} onUnequip={onUnequip} />
        ))}
      </div>
    </div>
  )
}
