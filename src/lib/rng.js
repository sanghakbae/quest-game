// 시드 기반 결정적 난수 생성기 — 같은 시드면 항상 같은 결과가 나와 던전 생성이 재현 가능하다.

// 문자열을 32비트 정수 시드로 해시 (cyrb53 단순화 버전)
export function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return (h ^ (h >>> 16)) >>> 0
}

// mulberry32 PRNG. next()는 0~1 실수를 반환한다.
export function makeRng(seed) {
  let a = typeof seed === 'string' ? hashSeed(seed) : seed >>> 0
  const next = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    // min~max 정수 (양끝 포함)
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    // 배열에서 하나 선택
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    // 확률 p(0~1)로 true
    chance: (p) => next() < p,
  }
}
