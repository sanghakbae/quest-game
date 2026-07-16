// 게임 저장/불러오기 — 로컬(localStorage)과 클라우드(Firestore)를 분리 제공한다.
// 안전 원칙: 클라우드는 "성공적으로 읽은 뒤"에만 쓴다(빈 상태로 덮어쓰기 방지).
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const LS_KEY = 'checklist-dungeon-save'

export function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveLocal(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {
    /* 용량 초과 등 무시 */
  }
}

// 클라우드 읽기. 실패 시 throw(호출부가 폴백 처리). 문서 없으면 null.
export async function loadCloud(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'game', 'save'))
  return snap.exists() ? snap.data() : null
}

// 클라우드 쓰기. 실패 시 throw.
export async function saveCloud(uid, data) {
  await setDoc(doc(db, 'users', uid, 'game', 'save'), data, { merge: false })
}
