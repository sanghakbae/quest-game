// 앱 셸 — 상단 네비게이션, 라우트, 레벨업/보상 토스트를 렌더링한다.
import { Routes, Route, NavLink } from 'react-router-dom'
import { useGame } from './context/GameContext'
import { totalStats, xpToNext } from './lib/game'
import Home from './pages/Home'
import Create from './pages/Create'
import Dungeon from './pages/Dungeon'
import Toast from './components/Toast'

function TopBar() {
  const { character } = useGame()
  if (!character) return null
  const st = totalStats(character)
  const pct = Math.min(100, Math.round((character.xp / xpToNext(character.level)) * 100))
  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        ⚔️ 체크리스트 던전
      </NavLink>
      <div className="topbar-char">
        <span className="tb-name">{character.name}</span>
        <span className="tb-lv">Lv.{character.level}</span>
        <div className="tb-xp" title={`${character.xp} / ${xpToNext(character.level)} XP`}>
          <div className="tb-xp-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="tb-stat">❤️ {st.maxHp}</span>
        <span className="tb-stat">⚔️ {st.atk}</span>
        <span className="tb-stat">🛡️ {st.def}</span>
        <span className="tb-stat">🍀 {st.luck}</span>
        <span className="tb-gold">💰 {character.gold}</span>
      </div>
      <nav className="topnav">
        <NavLink to="/" end>
          본거지
        </NavLink>
        <NavLink to="/create">던전 생성</NavLink>
      </nav>
    </header>
  )
}

export default function App() {
  const { loaded, toast, clearToast } = useGame()
  if (!loaded) return <div className="loading">불러오는 중…</div>
  return (
    <div className="app">
      <TopBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/dungeon/:id" element={<Dungeon />} />
        </Routes>
      </main>
      {toast && <Toast toast={toast} onClose={clearToast} />}
    </div>
  )
}
