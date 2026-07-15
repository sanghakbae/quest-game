// 게임 저장/불러오기 — Firebase가 설정되면 Firestore, 아니면 localStorage에 저장한다.
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'

const LS_KEY = 'checklist-dungeon-save'

// 저장 문서: { character, dungeons: [scenario] }
export async function loadGame(uid) {
  if (isFirebaseConfigured && uid) {
    const snap = await getDoc(doc(db, 'users', uid, 'game', 'save'))
    return snap.exists() ? snap.data() : null
  }
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function saveGame(uid, data) {
  if (isFirebaseConfigured && uid) {
    await setDoc(doc(db, 'users', uid, 'game', 'save'), data, { merge: false })
    return
  }
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}
