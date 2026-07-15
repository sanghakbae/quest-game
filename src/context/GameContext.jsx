// 게임 상태 전역 관리 — 캐릭터/던전 목록을 보관하고 저장소와 동기화한다.
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadGame, saveGame } from '../lib/store'
import { newCharacter, completeQuest, clearDungeon, equipItem, sellItem } from '../lib/game'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const { user, configured } = useAuth()
  const uid = user?.uid || null
  const [character, setCharacter] = useState(null)
  const [dungeons, setDungeons] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast] = useState(null)

  // 저장소에서 로드 (uid 변경 시)
  useEffect(() => {
    let cancelled = false
    setLoaded(false)
    // Firestore 읽기가 실패하거나(미설정/권한) 응답이 없어도 로딩이 멈추지 않도록 타임아웃을 건다.
    const withTimeout = (p, ms) =>
      Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])
    ;(async () => {
      let data = null
      try {
        data = await withTimeout(loadGame(uid), 6000)
        // 첫 로그인 시 클라우드가 비어있으면 로컬 저장분을 이어받는다(이후 저장 effect가 클라우드로 동기화).
        if (!data?.character && uid) {
          const local = await loadGame(null)
          if (local?.character) data = local
        }
      } catch (e) {
        // 클라우드 로드 실패/지연 → 로컬 저장분으로 폴백해 게임을 계속할 수 있게 한다.
        console.warn('클라우드 로드 실패, 로컬 저장으로 폴백합니다.', e)
        try {
          data = await loadGame(null)
        } catch {
          data = null
        }
      }
      if (cancelled) return
      setCharacter(data?.character || newCharacter())
      setDungeons(data?.dungeons || [])
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [uid])

  // 변경 시 저장 (로드 완료 후에만)
  useEffect(() => {
    if (!loaded || !character) return
    saveGame(uid, { character, dungeons }).catch(() => {})
  }, [character, dungeons, loaded, uid])

  const showToast = useCallback((t) => {
    setToast({ ...t, key: `${t.title}-${Math.random()}` })
  }, [])

  const addDungeon = useCallback((scenario) => {
    setDungeons((prev) => [scenario, ...prev.filter((d) => d.id !== scenario.id)])
  }, [])

  const deleteDungeon = useCallback((id) => {
    setDungeons((prev) => prev.filter((d) => d.id !== id))
  }, [])

  // 퀘스트 완료: 캐릭터 보상 반영 + 던전 상태 갱신. 전부 완료면 클리어 처리.
  // 현재 state(character/dungeons)를 클로저에서 읽어 계산한 뒤 값으로 set한다.
  // (setState 중첩을 피해 StrictMode의 이중 호출로 보상이 중복 적용되는 것을 방지.)
  const finishQuest = useCallback(
    (dungeonId, questId) => {
      const dungeon = dungeons.find((d) => d.id === dungeonId)
      if (!dungeon || !character) return
      const quest = dungeon.quests.find((q) => q.id === questId)
      if (!quest || quest.done) return

      const updatedQuests = dungeon.quests.map((q) => (q.id === questId ? { ...q, done: true } : q))
      const allDone = updatedQuests.every((q) => q.done)

      const { char, rewards } = completeQuest(character, quest, dungeon.rank)

      let finalChar = char
      let finalStatus = dungeon.status
      if (allDone && dungeon.status !== 'cleared') {
        const { char: cleared, bonus } = clearDungeon(char, { ...dungeon, quests: updatedQuests })
        finalChar = cleared
        finalStatus = 'cleared'
        showToast({
          title: '🏆 던전 클리어!',
          lines: [
            `${dungeon.name} 정복`,
            `보너스 +${bonus.xp} XP · +${bonus.gold} G`,
            ...(bonus.newTitles.length ? [`새 칭호: ${bonus.newTitles.join(', ')}`] : []),
            ...(rewards.levelsGained + bonus.levelsGained > 0 ? [`레벨 업! Lv.${cleared.level}`] : []),
          ],
          loot: rewards.loot,
        })
      } else {
        showToast({
          title: quest.isBoss ? '👑 보스 처치' : '✅ 퀘스트 완료',
          lines: [
            quest.title,
            `+${rewards.xp} XP · +${rewards.gold} G`,
            ...(rewards.levelsGained > 0 ? [`레벨 업! Lv.${char.level}`] : []),
          ],
          loot: rewards.loot,
        })
      }

      setCharacter(finalChar)
      setDungeons((prev) =>
        prev.map((d) => (d.id === dungeonId ? { ...d, quests: updatedQuests, status: finalStatus } : d))
      )
    },
    [character, dungeons, showToast]
  )

  const equip = useCallback(
    (item) => {
      if (!character) return
      setCharacter(equipItem(character, item))
      showToast({ title: '🎽 장착 완료', lines: [item.name] })
    },
    [character, showToast]
  )

  const sell = useCallback(
    (item) => {
      if (!character) return
      const { char, price } = sellItem(character, item)
      setCharacter(char)
      showToast({ title: '💰 판매 완료', lines: [item.name, `+${price} G`] })
    },
    [character, showToast]
  )

  const renameCharacter = useCallback((name) => {
    setCharacter((c) => ({ ...c, name: name.trim() || c.name }))
  }, [])

  const resetGame = useCallback(() => {
    setCharacter(newCharacter())
    setDungeons([])
  }, [])

  const value = useMemo(
    () => ({
      character,
      dungeons,
      loaded,
      configured,
      toast,
      clearToast: () => setToast(null),
      addDungeon,
      deleteDungeon,
      finishQuest,
      equip,
      sell,
      renameCharacter,
      resetGame,
    }),
    [
      character,
      dungeons,
      loaded,
      configured,
      toast,
      addDungeon,
      deleteDungeon,
      finishQuest,
      equip,
      sell,
      renameCharacter,
      resetGame,
    ]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => useContext(GameContext)
