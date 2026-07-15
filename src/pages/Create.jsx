// 던전 생성 — 체크리스트를 작성하면 규칙 기반으로 던전 시나리오를 미리보기하고 생성한다.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { generateScenario } from '../lib/generator'
import { DIFFICULTY_LIST, CATEGORY_LIST, CATEGORIES } from '../lib/content'

let rowCounter = 0
const newRow = () => ({ id: `r${Date.now()}_${rowCounter++}`, title: '', difficulty: '보통', category: '전투' })

const EXAMPLES = [
  { title: '운동 30분 하기', difficulty: '보통', category: '전투' },
  { title: '방 청소하기', difficulty: '쉬움', category: '탐험' },
  { title: '밀린 이메일 정리', difficulty: '보통', category: '지식' },
  { title: '보고서 초안 완성', difficulty: '어려움', category: '지식' },
  { title: '발표 리허설', difficulty: '극악', category: '사교' },
]

export default function Create() {
  const { addDungeon } = useGame()
  const navigate = useNavigate()
  const [checklistName, setChecklistName] = useState('')
  const [rows, setRows] = useState([newRow(), newRow(), newRow()])

  const updateRow = (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const addRowAt = () => setRows((rs) => [...rs, newRow()])
  const removeRow = (id) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs))
  const loadExamples = () =>
    setRows(EXAMPLES.map((e) => ({ id: `r${Date.now()}_${rowCounter++}`, ...e })))

  const filled = rows.filter((r) => r.title.trim())

  // 미리보기: 시드를 고정하기 위해 임시 id 사용
  const preview = useMemo(() => {
    if (!filled.length) return null
    try {
      return generateScenario({ id: 'preview', name: checklistName, items: filled })
    } catch {
      return null
    }
  }, [filled, checklistName])

  const create = () => {
    if (!filled.length) return
    const id = `${Date.now()}`
    const scenario = generateScenario({ id, name: checklistName, items: filled })
    addDungeon(scenario)
    navigate(`/dungeon/${scenario.id}`)
  }

  return (
    <div className="create">
      <div className="create-form">
        <h2>📝 체크리스트 작성</h2>
        <p className="empty-hint">
          할 일을 적으면 판타지 던전으로 변신합니다. 난이도와 종류가 몬스터와 보상을 결정합니다.
        </p>

        <input
          className="checklist-name"
          placeholder="체크리스트 이름 (선택)"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          maxLength={40}
        />

        <div className="rows">
          {rows.map((r, i) => (
            <div key={r.id} className="row">
              <span className="row-num">{i + 1}</span>
              <input
                className="row-title"
                placeholder="할 일 / 목표"
                value={r.title}
                onChange={(e) => updateRow(r.id, { title: e.target.value })}
                maxLength={60}
              />
              <select value={r.category} onChange={(e) => updateRow(r.id, { category: e.target.value })}>
                {CATEGORY_LIST.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIES[c].icon} {c}
                  </option>
                ))}
              </select>
              <select value={r.difficulty} onChange={(e) => updateRow(r.id, { difficulty: e.target.value })}>
                {DIFFICULTY_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <button className="row-del" onClick={() => removeRow(r.id)} title="삭제">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="create-actions">
          <button className="btn ghost" onClick={addRowAt}>
            + 항목 추가
          </button>
          <button className="btn ghost" onClick={loadExamples}>
            예시 채우기
          </button>
        </div>
      </div>

      <div className="create-preview">
        <h3 className="panel-title">🔮 던전 미리보기</h3>
        {preview ? (
          <div className="panel preview-panel">
            <div className="preview-head">
              <span className="preview-rank" style={{ background: preview.rankColor }}>
                {preview.rank}
              </span>
              <span className="preview-name">{preview.name}</span>
            </div>
            <p className="preview-intro">{preview.intro}</p>
            <div className="preview-quests">
              {preview.quests.map((q) => (
                <div key={q.id} className="preview-quest">
                  <span>
                    {CATEGORIES[q.category].icon} {q.title}
                    {q.isBoss && <span className="boss-tag">보스</span>}
                  </span>
                  <span className="pq-reward">
                    +{q.xp}XP · +{q.gold}G
                  </span>
                </div>
              ))}
            </div>
            <button className="btn big" onClick={create}>
              ⚔️ 던전 생성 & 입장
            </button>
          </div>
        ) : (
          <div className="panel empty-big">
            <p>할 일을 하나 이상 입력하면 던전이 나타납니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
