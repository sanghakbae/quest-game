// Firebase 초기화 — 웹 config는 공개되어도 되는 값이라 기본값으로 내장하고, 필요 시 VITE_FIREBASE_* 로 덮어쓴다.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAB9wj0Er-bS078TT90oaqnGL2Ot_BYBrY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'quest-game-9be08.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'quest-game-9be08',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'quest-game-9be08.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '25091781495',
  appId: env.VITE_FIREBASE_APP_ID || '1:25091781495:web:7452594bc8e54b21516772',
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// 로그인 허용 이메일 제한 (쉼표 구분). 비우면 모든 Google 계정 허용.
export const ALLOWED_EMAILS = (env.VITE_ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
