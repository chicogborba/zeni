// Prepara o personagem do ZENI a partir de "Wii fit - camisa lisa.glb" (malha estática, sem ossos nem animações).
// Gera scripts/zeni-personagem-gerado.glb com: malha da cintura para cima, braços baixados, cabeça virada para a frente,
// esqueleto de 13 ossos (mesmos nomes de docs/rig-atual.md), pesos de pele e os 6 clipes A–F, tudo por código.
// Uso (na pasta zeni-site): node scripts/preparar-modelo.mjs
// Não edita o arquivo de origem. Sem dependências além do three (só matemática de quaternion).
import fs from 'node:fs'
import * as THREE from 'three'
import { lerGlb } from './glb-ler.mjs'

const ORIGEM = new URL('./fonte/wii-fit-camisa-lisa.glb', import.meta.url).pathname
// Não sobrescreve src/assets/zeni-personagem.glb: o arquivo do app vem do Blender (scripts/fonte/zeni-personagem-blender.glb)
// e passa por scripts/alinhar-ossos.mjs. Para usar esta versão gerada, copie-a por cima.
const SAIDA = new URL('./zeni-personagem-gerado.glb', import.meta.url).pathname

// ---------- medidas achadas olhando a malha (unidades do arquivo de origem) ----------
const ESCALA = 0.09 // unidades de origem -> metros (a mão fica com ~0,2 m e o ZENI com 0,16 m cabe nela)
const CINTURA = [1.0, 10.8, 0.1] // origem do esqueleto (Hips)
const CORTE_Y = 9.5 // triângulos totalmente abaixo disto (pernas) saem
const PESCOCO = { y0: 15.1, y1: 15.95 } // faixa onde a cabeça gira em relação ao tronco
const BRACOS = {
  R: { dentro: [-1.44, 14.21, -0.98], fora: [-8.51, 14.37, -2.62], recuo: -0.2, queda: [-0.08, -1, 0] },
  L: { dentro: [3.44, 14.22, -0.54], fora: [10.55, 14.49, 0.0], recuo: -0.2, queda: [0.08, -1, 0] },
}
const COMP = { braco: 3.0, antebraco: 2.8, mao: 2.3 } // comprimentos na origem

const suave = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const V = (a) => new THREE.Vector3(...a)

// ---------- 1. ler e juntar as peças numa sopa de triângulos ----------
const g = lerGlb(ORIGEM)
const prims = g.json.meshes[0].primitives
const pedacos = prims.map((p) => g.acessor(p.attributes.POSITION).dados)
const corpoIdx = pedacos.reduce((m, p, i) => (p.length > pedacos[m].length ? i : m), 0)
let soup = []
const tipoDaPeca = []
pedacos.forEach((p, i) => {
  for (let k = 0; k < p.length; k++) soup.push(p[k])
  for (let k = 0; k < p.length / 3; k++) tipoDaPeca.push(i === corpoIdx ? 'corpo' : 'cabeca')
})
soup = Float32Array.from(soup)

// soldar vértices iguais
const chave = (x, y, z) => `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)}`
const mapa = new Map()
const posO = []
const tipoO = []
const tri = []
for (let i = 0; i < soup.length / 3; i++) {
  const k = chave(soup[i * 3], soup[i * 3 + 1], soup[i * 3 + 2])
  if (!mapa.has(k)) { mapa.set(k, posO.length); posO.push([soup[i * 3], soup[i * 3 + 1], soup[i * 3 + 2]]); tipoO.push(tipoDaPeca[i]) }
  tri.push(mapa.get(k))
}

// partes conectadas: o que não é o corpo grande (cabelo, rosto, olhos) gira junto com a cabeça
const pai = posO.map((_, i) => i)
const raiz = (a) => { while (pai[a] !== a) { pai[a] = pai[pai[a]]; a = pai[a] } return a }
for (let t = 0; t < tri.length; t += 3) { const a = raiz(tri[t]); pai[raiz(tri[t + 1])] = a; pai[raiz(tri[t + 2])] = a }
const tamanho = new Map()
posO.forEach((_, i) => tamanho.set(raiz(i), (tamanho.get(raiz(i)) ?? 0) + 1))
const maior = [...tamanho.entries()].sort((a, b) => b[1] - a[1])[0][0]
// cabelo = a peça grande que sobe até o topo da cabeça; as pequenas (olhos, sobrancelhas) giram inteiras com o rosto
const topoPorPeca = new Map()
posO.forEach((p, i) => topoPorPeca.set(raiz(i), Math.max(topoPorPeca.get(raiz(i)) ?? -1e9, p[1])))
const tipo = posO.map((p, i) => (raiz(i) === maior ? 'corpo' : topoPorPeca.get(raiz(i)) > 18 ? 'cabelo' : 'cabeca'))

// ---------- 2. cortar da cintura para baixo ----------
const trisBons = []
for (let t = 0; t < tri.length; t += 3) {
  const ymax = Math.max(posO[tri[t]][1], posO[tri[t + 1]][1], posO[tri[t + 2]][1])
  const ehCabeca = tipo[tri[t]] !== 'corpo' && ymax > 13 // cabelo, rosto e olhos ficam; pés e pernas (peças soltas) saem
  if (ymax >= CORTE_Y || ehCabeca) trisBons.push(tri[t], tri[t + 1], tri[t + 2])
}
// reindexar só o que sobrou
const novo = new Map()
const pos = []
const tp = []
const idx = []
for (const v of trisBons) {
  if (!novo.has(v)) { novo.set(v, pos.length); pos.push(posO[v].slice()); tp.push(tipo[v]) }
  idx.push(novo.get(v))
}

// ---------- 3. pescoço: onde a cabeça gira (ela olha para +x no arquivo; vira para +z) ----------
{
  let n = 0, sx = 0, sz = 0
  for (const p of pos) if (p[1] > 15.3 && p[1] < 15.6 && Math.abs(p[0] - 0.9) < 0.8 && Math.abs(p[2]) < 1.2) { n++; sx += p[0]; sz += p[2] }
  var EIXO_PESCOCO = [sx / n, sz / n]
  console.log('eixo do pescoço (x,z):', EIXO_PESCOCO.map((v) => v.toFixed(2)), 'vértices', n)
}
const GIRO = (-66 * Math.PI) / 180 // o rosto olhava uns 24° para dentro de +x; este giro o põe de frente (+z)
for (let i = 0; i < pos.length; i++) {
  const p = pos[i]
  const dx0 = p[0] - EIXO_PESCOCO[0], dz0 = p[2] - EIXO_PESCOCO[1]
  const rn = Math.hypot(dx0, dz0)
  // miolo do pescoço (perto do eixo): torce devagar com a altura. Fora dele (mandíbula): gira inteiro acima dos ombros. Cabelo, rosto e olhos giram inteiros, como a cabeça.
  const f = tp[i] !== 'corpo' ? 1 : Math.max(suave(p[1], PESCOCO.y0, PESCOCO.y1), suave(rn, 0.6, 0.9) * suave(p[1], 15.3, 15.5))
  if (f <= 0) continue
  const a = GIRO * f
  const dx = p[0] - EIXO_PESCOCO[0], dz = p[2] - EIXO_PESCOCO[1]
  p[0] = EIXO_PESCOCO[0] + dx * Math.cos(a) + dz * Math.sin(a)
  p[2] = EIXO_PESCOCO[1] - dx * Math.sin(a) + dz * Math.cos(a)
}

// ---------- 4. braços: de "T" para pendurados (rotação em torno do ombro, com mistura suave) ----------
const lados = {}
for (const [nome, b] of Object.entries(BRACOS)) {
  const d = V(b.fora).sub(V(b.dentro)).normalize()
  const S = V(b.dentro).addScaledVector(d, b.recuo)
  const t = V(b.queda).normalize()
  const R = new THREE.Quaternion().setFromUnitVectors(d, t)
  lados[nome] = { d, S, t, R, a: new Float32Array(pos.length), ub: new Float32Array(pos.length) }
}
const tmp = new THREE.Vector3()
const I = new THREE.Quaternion()
for (let i = 0; i < pos.length; i++) {
  if (tp[i] !== 'corpo') continue
  // pertencer ao braço: quanto mais longe do ombro ao longo do braço e perto do eixo, mais "braço"
  for (const nome of ['R', 'L']) {
    const L = lados[nome]
    tmp.set(pos[i][0], pos[i][1], pos[i][2]).sub(L.S)
    const u = tmp.dot(L.d)
    const r = Math.sqrt(Math.max(0, tmp.lengthSq() - u * u))
    const a = suave(u, -1.1, 0.4) * (1 - suave(r, 1.0, 1.7))
    L.a[i] = a
  }
}
for (let i = 0; i < pos.length; i++) {
  for (const nome of ['R', 'L']) {
    const L = lados[nome]
    const a = L.a[i]
    if (a <= 0) continue
    tmp.set(pos[i][0], pos[i][1], pos[i][2]).sub(L.S)
    tmp.applyQuaternion(I.clone().slerp(L.R, a)).add(L.S)
    pos[i][0] = tmp.x; pos[i][1] = tmp.y; pos[i][2] = tmp.z
    L.ub[i] = tmp.clone().sub(L.S).dot(L.t)
  }
}
for (const nome of ['R', 'L']) { // ub também para os vértices sem rotação (a = 0): não importam, mas ficam definidos
  const L = lados[nome]
  for (let i = 0; i < pos.length; i++) if (L.a[i] <= 0) L.ub[i] = tmp.set(pos[i][0], pos[i][1], pos[i][2]).sub(L.S).dot(L.t)
}

// ---------- 5. esqueleto (posições de repouso em metros, todas as rotações de repouso são identidade) ----------
const noMundo = (p) => [(p[0] - CINTURA[0]) * ESCALA, (p[1] - CINTURA[1]) * ESCALA, (p[2] - CINTURA[2]) * ESCALA]
const osso = {}
osso.Hips = noMundo(CINTURA)
osso.Spine = noMundo([1.0, 12.4, 0.1])
osso.Chest = noMundo([1.0, 13.9, 0.1])
osso.Neck = noMundo([EIXO_PESCOCO[0], 15.2, EIXO_PESCOCO[1]])
osso.Head = noMundo([EIXO_PESCOCO[0], 15.9, EIXO_PESCOCO[1]])
for (const nome of ['R', 'L']) {
  const L = lados[nome]
  const E = L.S.clone().addScaledVector(L.t, COMP.braco)
  const W = E.clone().addScaledVector(L.t, COMP.antebraco)
  const palma = W.clone().addScaledVector(L.t, COMP.mao * 0.35)
  osso[`Clavicle.${nome}`] = noMundo([nome === 'R' ? 0.45 : 1.55, 14.8, 0.1])
  osso[`UpperArm.${nome}`] = noMundo(L.S.toArray())
  osso[`Forearm.${nome}`] = noMundo(E.toArray())
  osso[`Hand.${nome}`] = noMundo(W.toArray())
  osso[`Socket.${nome}`] = noMundo(palma.toArray())
}
const PAI = {
  Hips: null, Spine: 'Hips', Chest: 'Spine', Neck: 'Chest', Head: 'Neck',
  'Clavicle.L': 'Chest', 'UpperArm.L': 'Clavicle.L', 'Forearm.L': 'UpperArm.L', 'Hand.L': 'Forearm.L', 'Socket.L': 'Hand.L',
  'Clavicle.R': 'Chest', 'UpperArm.R': 'Clavicle.R', 'Forearm.R': 'UpperArm.R', 'Hand.R': 'Forearm.R', 'Socket.R': 'Hand.R',
}
const JUNTAS = ['Hips', 'Spine', 'Chest', 'Neck', 'Head', 'Clavicle.L', 'UpperArm.L', 'Forearm.L', 'Hand.L', 'Clavicle.R', 'UpperArm.R', 'Forearm.R', 'Hand.R']
const ordem = Object.keys(PAI)
const local = (nome) => osso[nome].map((v, k) => v - (PAI[nome] ? osso[PAI[nome]][k] : 0))

// ---------- 6. pesos de pele ----------
const ji = Object.fromEntries(JUNTAS.map((n, i) => [n, i]))
const TRONCO = [['Hips', 10.8], ['Spine', 12.4], ['Chest', 13.9], ['Neck', 15.2], ['Head', 15.9]]
function pesosDoTronco(y) {
  if (y <= TRONCO[0][1]) return { Hips: 1 }
  for (let k = 0; k < TRONCO.length - 1; k++) {
    const [n0, y0] = TRONCO[k], [n1, y1] = TRONCO[k + 1]
    if (y <= y1) { const t = (y - y0) / (y1 - y0); return { [n0]: 1 - t, [n1]: t } }
  }
  return { Head: 1 }
}
const L1 = COMP.braco, L2 = COMP.antebraco
const NUCLEO = 0.55 // largura da mistura nas dobras (cotovelo e punho), em unidades de origem
const joints = new Uint8Array(pos.length * 4)
const weights = new Float32Array(pos.length * 4)
// o tronco usa a altura de origem (antes da escala); posições de repouso do tronco ainda estão em unidades de origem
for (let i = 0; i < pos.length; i++) {
  const w = {}
  const a = Math.max(lados.R.a[i], lados.L.a[i])
  const lado = lados.R.a[i] >= lados.L.a[i] ? 'R' : 'L'
  const yTronco = tp[i] === 'cabeca' ? 99 : pos[i][1] // cabelo segue a altura, como o pescoço
  if (a <= 0.0005) Object.assign(w, pesosDoTronco(yTronco))
  else {
    w.Chest = 1 - a
    const ub = lados[lado].ub[i]
    const f = suave(ub, L1 - NUCLEO, L1 + NUCLEO)
    const m = suave(ub, L1 + L2 - NUCLEO * 0.8, L1 + L2 + NUCLEO * 0.8)
    w[`UpperArm.${lado}`] = a * (1 - f)
    w[`Forearm.${lado}`] = a * f * (1 - m)
    w[`Hand.${lado}`] = a * f * m
  }
  const lista = Object.entries(w).filter(([, v]) => v > 1e-4).sort((p, q) => q[1] - p[1]).slice(0, 4)
  const soma = lista.reduce((s, [, v]) => s + v, 0)
  lista.forEach(([n, v], k) => { joints[i * 4 + k] = ji[n]; weights[i * 4 + k] = v / soma })
}

// ---------- 7. para metros e normais suaves ----------
const P = new Float32Array(pos.length * 3)
pos.forEach((p, i) => { const q = noMundo(p); P.set(q, i * 3) })
const N = new Float32Array(pos.length * 3)
for (let t = 0; t < idx.length; t += 3) {
  const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]]
  const A = new THREE.Vector3().fromArray(P, a * 3), B = new THREE.Vector3().fromArray(P, b * 3), C = new THREE.Vector3().fromArray(P, c * 3)
  const n = B.sub(A).cross(C.sub(A)) // área-ponderada
  for (const v of [a, b, c]) { N[v * 3] += n.x; N[v * 3 + 1] += n.y; N[v * 3 + 2] += n.z }
}
for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l }

// ---------- 8. clipes por código ----------
const D2R = Math.PI / 180
const FPS = 30
const qx = (g) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), g * D2R)
const qy = (g) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), g * D2R)
const qz = (g) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), g * D2R)
// Rotação local de um osso do braço, no quadro de repouso (braço para baixo, eixo longo = y):
//   guinada em torno do vertical, afastar do corpo (abd), subir para a frente (flex) e girar em torno do próprio eixo (giro).
function rot({ guinada = 0, abd = 0, flex = 0, giro = 0 }, lado) {
  const fora = lado === 'R' ? -1 : 1 // fora do corpo é -x no braço direito do personagem
  return qy(guinada).multiply(qz(fora * abd)).multiply(qx(-flex)).multiply(qy(giro))
}
const cosE = (t, T) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / T) // 0 em 0 e T, 1 em T/2
const sen = (t, T) => Math.sin((2 * Math.PI * t) / T)

// Pose neutra (início e fim de todos): braço relaxado ao lado, cotovelo dobrado, antebraço à frente na cintura, ZENI de pé.
const NEUTRO = { braco: { flex: 18, abd: 6 }, antebraco: { flex: 72 }, mao: {} }
// A mão mantém o ZENI na vertical quando pedido: o total de "flex" (braço + antebraço + mão) fica igual ao do neutro (90°)
const compensar = (braco, antebraco) => 90 - (braco.flex + antebraco.flex)

const CLIPES = {
  A_girar_o_punho: { dur: 2.4, pose: (t) => { const g = 70 * sen(t, 2.4); return { braco: NEUTRO.braco, antebraco: { flex: 72, giro: g / 2 }, mao: { giro: g / 2 } } } },
  B_levantar_ate_o_ombro: { dur: 3.2, pose: (t) => { const k = cosE(t, 3.2); return { braco: { flex: 18 + 8 * k, abd: 6 + 2 * k }, antebraco: { flex: 72 + 46 * k }, mao: {} } } },
  C_no_ritmo: { dur: 1.0, pose: (t) => ({ braco: NEUTRO.braco, antebraco: NEUTRO.antebraco, mao: { flex: 16 * sen(t, 1.0) } }) },
  D_tocar_na_mesa: { dur: 1.2, pose: (t) => { const k = cosE(t, 1.2); const braco = { flex: 35, abd: 4 }; const antebraco = { flex: 40 + 26 * k }; return { braco, antebraco, mao: { flex: compensar(braco, antebraco) } } } },
  E_mesma_forca_ate_o_fim: { dur: 1.0, pose: (t) => { const g = 45 * sen(t, 1.0); return { braco: NEUTRO.braco, antebraco: { flex: 72, giro: g / 2 }, mao: { giro: g / 2 } } } },
  F_lado_a_lado: { dur: 1.6, pose: (t) => { const g = 9 - 21 * Math.cos((2 * Math.PI * (t - 0.4)) / 1.6); return { braco: { flex: 40, abd: 0, guinada: g }, antebraco: { flex: 50 }, mao: {} } } },
}
// braço esquerdo: pose fixa, relaxado (como hoje, a pose fica "assada" como track constante em todos os clipes)
const ESQ = { braco: { flex: 14, abd: 6 }, antebraco: { flex: 75 }, mao: {} }

// ---------- 9. escrever o .glb ----------
const blobs = []
const views = []
const accs = []
const add = (dados, alvo, comp, tipoAcc, contagem, extra = {}) => {
  const buf = Buffer.from(dados.buffer, dados.byteOffset, dados.byteLength)
  const pad = (4 - (buf.length % 4)) % 4
  const off = blobs.reduce((s, b) => s + b.length, 0)
  blobs.push(Buffer.concat([buf, Buffer.alloc(pad)]))
  views.push({ buffer: 0, byteOffset: off, byteLength: buf.length, ...(alvo ? { target: alvo } : {}) })
  accs.push({ bufferView: views.length - 1, componentType: comp, count: contagem, type: tipoAcc, ...extra })
  return accs.length - 1
}
const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]
for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P[i + k]); mx[k] = Math.max(mx[k], P[i + k]) }
const aPos = add(P, 34962, 5126, 'VEC3', P.length / 3, { min: mn, max: mx })
const aNor = add(N, 34962, 5126, 'VEC3', N.length / 3)
const aJnt = add(joints, 34962, 5121, 'VEC4', joints.length / 4)
const aWgt = add(weights, 34962, 5126, 'VEC4', weights.length / 4)
const aIdx = add(Uint16Array.from(idx), 34963, 5123, 'SCALAR', idx.length)
// matrizes inversas de bind: só translação (rotações de repouso são identidade)
const ibm = new Float32Array(JUNTAS.length * 16)
JUNTAS.forEach((n, i) => { const m = new THREE.Matrix4().makeTranslation(-osso[n][0], -osso[n][1], -osso[n][2]); m.toArray(ibm, i * 16) })
const aIbm = add(ibm, null, 5126, 'MAT4', JUNTAS.length)

const nodes = []
const idxNo = {}
for (const n of ordem) { idxNo[n] = nodes.length; nodes.push({ name: n, translation: local(n).map((v) => +v.toFixed(6)) }) }
for (const n of ordem) if (PAI[n]) (nodes[idxNo[PAI[n]]].children ??= []).push(idxNo[n])
const noCorpo = nodes.length
nodes.push({ name: 'Corpo', mesh: 0, skin: 0 })

const animacoes = []
for (const [nome, c] of Object.entries(CLIPES)) {
  const n = Math.round(c.dur * FPS)
  const tempos = new Float32Array(n + 1).map((_, i) => i / FPS)
  const aT = add(tempos, null, 5126, 'SCALAR', n + 1, { min: [0], max: [c.dur] })
  const canais = []
  const amostras = {}
  const guardar = (osso, q) => { (amostras[osso] ??= []).push(q.x, q.y, q.z, q.w) }
  for (let i = 0; i <= n; i++) {
    const t = Math.min(c.dur, i / FPS)
    const p = c.pose(t)
    guardar('UpperArm.R', rot(p.braco, 'R')); guardar('Forearm.R', rot(p.antebraco, 'R')); guardar('Hand.R', rot(p.mao, 'R'))
    guardar('Clavicle.R', new THREE.Quaternion()); guardar('Clavicle.L', new THREE.Quaternion())
    guardar('UpperArm.L', rot(ESQ.braco, 'L')); guardar('Forearm.L', rot(ESQ.antebraco, 'L')); guardar('Hand.L', rot(ESQ.mao, 'L'))
  }
  const samplers = []
  for (const [osso, v] of Object.entries(amostras)) {
    const aQ = add(Float32Array.from(v), null, 5126, 'VEC4', n + 1)
    samplers.push({ input: aT, output: aQ, interpolation: 'LINEAR' })
    canais.push({ sampler: samplers.length - 1, target: { node: idxNo[osso], path: 'rotation' } })
  }
  animacoes.push({ name: nome, samplers, channels: canais })
}

const json = {
  asset: { version: '2.0', generator: 'zeni-site/scripts/preparar-modelo.mjs', copyright: 'Malha de origem: "Wii fit - camisa lisa.glb" (verificar licença e dar crédito)' },
  scene: 0,
  scenes: [{ nodes: [idxNo.Hips, noCorpo] }],
  nodes,
  skins: [{ name: 'Esqueleto', joints: JUNTAS.map((n) => idxNo[n]), skeleton: idxNo.Hips, inverseBindMatrices: aIbm }],
  meshes: [{ name: 'Corpo', primitives: [{ attributes: { POSITION: aPos, NORMAL: aNor, JOINTS_0: aJnt, WEIGHTS_0: aWgt }, indices: aIdx, material: 0 }] }],
  materials: [{ name: 'Suave', pbrMetallicRoughness: { baseColorFactor: [0.93, 0.95, 0.96, 1], metallicFactor: 0, roughnessFactor: 1 } }],
  animations: animacoes,
  accessors: accs,
  bufferViews: views,
  buffers: [{ byteLength: blobs.reduce((s, b) => s + b.length, 0) }],
}
const bin = Buffer.concat(blobs)
let js = Buffer.from(JSON.stringify(json))
js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)])
const cab = Buffer.alloc(12); cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8)
const ch1 = Buffer.alloc(8); ch1.writeUInt32LE(js.length, 0); ch1.writeUInt32LE(0x4e4f534a, 4)
const ch2 = Buffer.alloc(8); ch2.writeUInt32LE(bin.length, 0); ch2.writeUInt32LE(0x004e4942, 4)
fs.writeFileSync(SAIDA, Buffer.concat([cab, ch1, js, ch2, bin]))
console.log(`ok: ${SAIDA}\n  vértices ${pos.length}, triângulos ${idx.length / 3}, ${(fs.statSync(SAIDA).size / 1024).toFixed(0)} KB`)
