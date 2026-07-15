// 본거지 — 캐릭터 시트, 인벤토리, 던전 목록을 보여주는 메인 화면.
import { Link } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useAuth } from '../auth/AuthContext'
import CharacterPanel from '../components/CharacterPanel'
import Inventory from '../components/Inventory'

function DungeonCard({ d, onDelete }) {
  const total = d.quests.length
  const done = d.quests.filter((q) => q.done).length
  const cleared = d.status === 'cleared'
  return (
    <div className={`dungeon-card ${cleared ? 'cleared' : ''}`}>
      <div className="dc-rank" style={{ background: d.rankColor }}>
        {d.rank}
      </div>
      <div className="dc-body">
        <Link to={`/dungeon/${d.id}`} className="dc-name">
          {d.name}
        </Link>
        <div className="dc-meta">
          {d.theme} · 퀘스트 {done}/{total}
          {cleared && <span className="dc-clear">✔ 클리어</span>}
        </div>
        <div className="dc-progress">
          <div className="dc-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>
      <button className="dc-del" title="삭제" onClick={() => onDelete(d.id)}>
        ✕
      </button>
    </div>
  )
}

export default function Home() {
  const { dungeons, deleteDungeon, resetGame, configured } = useGame()
  const { user, signIn, signOut } = useAuth()

  const active = dungeons.filter((d) => d.status !== 'cleared')
  const cleared = dungeons.filter((d) => d.status === 'cleared')

  return (
    <div className="home">
      <div className="home-left">
        <CharacterPanel />
        <Inventory />
        <div className="panel account-panel">
          {configured ? (
            user ? (
              <button className="btn ghost" onClick={signOut}>
                로그아웃 ({user.email})
              </button>
            ) : (
              <button className="btn" onClick={signIn}>
                Google 로그인 (클라우드 저장)
              </button>
            )
          ) : (
            <p className="empty-hint">로컬 저장 모드입니다. 이 브라우저에 진행 상황이 저장됩니다.</p>
          )}
          <button
            className="btn ghost danger"
            onClick={() => {
              if (confirm('정말 처음부터 다시 시작할까요? 캐릭터와 던전이 모두 사라집니다.')) resetGame()
            }}
          >
            게임 초기화
          </button>
        </div>
      </div>

      <div className="home-right">
        <div className="section-head">
          <h2>진행 중인 던전</h2>
          <Link to="/create" className="btn">
            + 새 던전 생성
          </Link>
        </div>
        {active.length === 0 ? (
          <div className="panel empty-big">
            <p>진행 중인 던전이 없습니다.</p>
            <p className="empty-hint">체크리스트를 작성해 새 던전을 생성하세요.</p>
          </div>
        ) : (
          <div className="dungeon-list">
            {active.map((d) => (
              <DungeonCard key={d.id} d={d} onDelete={deleteDungeon} />
            ))}
          </div>
        )}

        {cleared.length > 0 && (
          <>
            <div className="section-head">
              <h2>정복한 던전</h2>
            </div>
            <div className="dungeon-list">
              {cleared.map((d) => (
                <DungeonCard key={d.id} d={d} onDelete={deleteDungeon} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
