// 보상/레벨업 알림 토스트 — 몇 초 뒤 자동으로 닫힌다.
import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [toast.key, onClose])

  return (
    <div className="toast" onClick={onClose} key={toast.key}>
      <div className="toast-title">{toast.title}</div>
      {toast.lines.map((l, i) => (
        <div key={i} className="toast-line">
          {l}
        </div>
      ))}
      {toast.loot && (
        <div className="toast-loot" style={{ borderColor: toast.loot.rarityColor }}>
          {toast.loot.icon} 전리품 획득! <span style={{ color: toast.loot.rarityColor }}>{toast.loot.name}</span>
        </div>
      )}
    </div>
  )
}
