// Alinha os ossos do braço à malha, quando o modelo vem do Blender com os braços inclinados e os ossos no lugar antigo.
// Mede, em cada braço, onde a malha da mão está em relação ao osso da mão; gira o cotovelo, o punho e o Socket em torno
// do ombro até o osso passar pelo meio da mão; e reescreve só o que depende disso: translações dos nós, matrizes inversas de
// bind (IBM) e as tracks de translação (constantes) dos clipes. Malha, pesos, clipes de rotação e materiais não mudam.
// Uso (na pasta zeni-site): node scripts/alinhar-ossos.mjs [entrada.glb] [saida.glb]
import fs from 'node:fs'
import { lerGlb } from './glb-ler.mjs'

const ENTRADA = process.argv[2] ?? new URL('./fonte/zeni-personagem-blender.glb', import.meta.url).pathname
const SAIDA = process.argv[3] ?? new URL('../src/assets/zeni-personagem.glb', import.meta.url).pathname
const g = lerGlb(ENTRADA)
const { json: j, bin } = g
const nos = j.nodes
const idx = (n) => nos.findIndex((x) => x.name === n)
const pai = new Map()
nos.forEach((n, i) => (n.children ?? []).forEach((c) => pai.set(c, i)))
const mundo = (i) => { let p = [0, 0, 0]; for (let k = i; k !== undefined; k = pai.get(k)) { const t = nos[k].translation ?? [0, 0, 0]; p = p.map((v, d) => v + t[d]) } return p }

// centro da malha da mão (vértices com peso > 0,9 no osso da mão)
const prim = j.meshes[0].primitives[0]
const P = g.acessor(prim.attributes.POSITION).dados
const J = g.acessor(prim.attributes.JOINTS_0).dados
const W = g.acessor(prim.attributes.WEIGHTS_0).dados
const juntas = j.skins[0].joints.map((i) => nos[i].name)
const centro = (osso) => {
  const a = juntas.indexOf(osso); let n = 0; const c = [0, 0, 0]
  for (let i = 0; i < P.length / 3; i++) { let w = 0; for (let k = 0; k < 4; k++) if (J[i * 4 + k] === a) w += W[i * 4 + k]; if (w > 0.9) { n++; for (let d = 0; d < 3; d++) c[d] += P[i * 3 + d] } }
  return c.map((v) => v / n)
}

// posições de mundo originais (antes de reescrever os nós), para conferir a IBM
const originais = Object.fromEntries(juntas.map((n) => [n, mundo(idx(n))]))

// novas posições de mundo
const novo = {}
for (const lado of ['R', 'L']) {
  const S = mundo(idx(`UpperArm.${lado}`))
  const alvo = centro(`Hand.${lado}`)[0] // a mão deve ficar com o osso no meio dela
  const ossos = ['Forearm', 'Hand', 'Socket'].map((o) => `${o}.${lado}`)
  const gira = (p, a) => { const dx = p[0] - S[0], dy = p[1] - S[1]; return [S[0] + dx * Math.cos(a) - dy * Math.sin(a), S[1] + dx * Math.sin(a) + dy * Math.cos(a), p[2]] }
  const mao = mundo(idx(`Hand.${lado}`))
  let lo = -0.6, hi = 0.6 // bisseção do ângulo (rad)
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if ((gira(mao, m)[0] - alvo) > 0 !== (gira(mao, lo)[0] - alvo) > 0) hi = m; else lo = m }
  const ang = (lo + hi) / 2
  console.log(`braço ${lado}: giro de ${((ang * 180) / Math.PI).toFixed(1)}° em torno do ombro`)
  for (const o of ossos) novo[o] = gira(mundo(idx(o)), ang)
}

// reescrever translações locais dos nós
const mundoNovo = (nome) => novo[nome] ?? mundo(idx(nome))
const locais = {}
for (const nome of Object.keys(novo)) {
  const i = idx(nome); const pm = mundoNovo(nos[pai.get(i)].name)
  locais[nome] = novo[nome].map((v, d) => v - pm[d])
  nos[i].translation = locais[nome].map((v) => +v.toFixed(6))
}

// IBM: só translação (rotações de repouso são identidade); confere antes de escrever
const aIbm = j.accessors[j.skins[0].inverseBindMatrices]
const vIbm = j.bufferViews[aIbm.bufferView]
const base = (vIbm.byteOffset ?? 0) + (aIbm.byteOffset ?? 0)
const f32 = new Float32Array(bin.buffer, bin.byteOffset, bin.byteLength / 4)
juntas.forEach((nome, k) => {
  const o = base / 4 + k * 16 + 12
  const antigo = originais[nome]
  if ([0, 1, 2].some((d) => Math.abs(f32[o + d] + antigo[d]) > 1e-4)) throw new Error(`IBM de ${nome} não é só translação`)
  if (novo[nome]) novo[nome].forEach((v, d) => (f32[o + d] = -v))
})

// tracks de translação dos clipes (constantes): trocar pelo valor local novo
let trocadas = 0
for (const a of j.animations) for (const c of a.channels) {
  const nome = nos[c.target.node].name
  if (c.target.path !== 'translation' || !locais[nome]) continue
  const acc = j.accessors[a.samplers[c.sampler].output]; const v = j.bufferViews[acc.bufferView]
  const off = ((v.byteOffset ?? 0) + (acc.byteOffset ?? 0)) / 4
  for (let k = 0; k < acc.count; k++) locais[nome].forEach((x, d) => (f32[off + k * 3 + d] = x))
  trocadas++
}
console.log(`tracks de translação reescritas: ${trocadas}`)

// escrever
let js = Buffer.from(JSON.stringify(j))
js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)])
const cab = Buffer.alloc(12); cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8)
const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4)
const c2 = Buffer.alloc(8); c2.writeUInt32LE(bin.length, 0); c2.writeUInt32LE(0x004e4942, 4)
fs.writeFileSync(SAIDA, Buffer.concat([cab, c1, js, c2, bin]))
console.log('ok:', SAIDA)
