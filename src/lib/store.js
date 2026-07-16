// 게임 저장/불러오기 — 항상 localStorage에 백업하고, 로그인 상태면 Firestore에도 저장한다.
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'

const LS_KEY = 'checklist-dungeon-save'

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {
    /* 용량 초과 등은 무시 */
  }
}

// 저장 문서: { character, dungeons: [scenario] }
// 로그인 상태면 Firestore를 우선하되, 클라우드가 비었으면 로컬 백업으로 이관한다.
export async function loadGame(uid) {
  if (isFirebaseConfigured && uid) {
    const snap = await getDoc(doc(db, 'users', uid, 'game', 'save'))
    if (snap.exists()) return snap.data()
    return readLocal() // 클라우드에 아직 없음 → 로컬 진행분 이어받기
  }
  return readLocal()
}

// 항상 로컬에 백업 저장 → 클라우드가 실패해도 데이터가 사라지지 않는다.
export async function saveGame(uid, data) {
  writeLocal(data)
  if (isFirebaseConfigured && uid) {
    await setDoc(doc(db, 'users', uid, 'game', 'save'), data, { merge: false })
  }
}
