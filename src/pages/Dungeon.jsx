// 던전 진행 화면 — 퀘스트 카드를 나열하고 클리어를 처리한다.
import { useParams, Link } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { CATEGORIES } from '../lib/content'

function QuestCard({ quest, dungeon, onFinish }) {
  const cat = CATEGORIES[quest.category]
  return (
    <div className={`quest-card ${quest.done ? 'done' : ''} ${quest.isBoss ? 'boss' : ''}`}>
      <div className="qc-icon">{cat.icon}</div>
      <div className="qc-body">
        <div className="qc-title">
          {quest.title}
          {quest.isBoss && <span className="boss-tag">👑 보스</span>}
        </div>
        <div className="qc-flavor">{quest.flavor}</div>
        <div className="qc-tags">
          <span className="tag">{quest.category}</span>
          <span className="tag">{quest.difficulty}</span>
          <span className="tag">👹 {quest.monster}</span>
        </div>
        <div className="qc-reward">
          보상 +{quest.xp} XP · +{quest.gold} G · 전리품 {Math.round(quest.lootChance * 100)}%
        </div>
      </div>
      <div className="qc-action">
        {quest.done ? (
          <span className="qc-done-badge">✔ 완료</span>
        ) : (
          <button className="btn" onClick={() => onFinish(dungeon.id, quest.id)}>
            처치
          </button>
        )}
      </div>
    </div>
  )
}

export default function Dungeon() {
  const { id } = useParams()
  const { dungeons, finishQuest } = useGame()
  const dungeon = dungeons.find((d) => d.id === id)

  if (!dungeon) {
    return (
      <div className="panel empty-big">
        <p>던전을 찾을 수 없습니다.</p>
        <Link to="/" className="btn">
          본거지로
        </Link>
      </div>
    )
  }

  const total = dungeon.quests.length
  const done = dungeon.quests.filter((q) => q.done).length
  const cleared = dungeon.status === 'cleared'

  return (
    <div className="dungeon-page">
      <div className="dungeon-header">
        <Link to="/" className="back-link">
          ← 본거지
        </Link>
        <div className="dh-title">
          <span className="dh-rank" style={{ background: dungeon.rankColor }}>
            {dungeon.rank}
          </span>
          <h1>{dungeon.name}</h1>
        </div>
        <p className="dh-intro">{dungeon.intro}</p>
        <div className="dh-progress-wrap">
          <div className="dh-progress">
            <div className="dh-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="dh-progress-text">
            {done} / {total} {cleared && '· 정복 완료 🏆'}
          </span>
        </div>
      </div>

      <div className="quest-list">
        {dungeon.quests.map((q) => (
          <QuestCard key={q.id} quest={q} dungeon={dungeon} onFinish={finishQuest} />
        ))}
      </div>
    </div>
  )
}
