// Cria os ossos dos dedos e a pegada do ZENI na mão do personagem (a malha tem a mão aberta, sem dedos separados).
// Por mão: Fingers (dedos, base), FingersTip (pontas), Thumb (polegar) e ThumbTip. Calcula os pesos de pele pela posição
// dos vértices da mão (dedos abaixo da linha dos nós dos dedos; polegar à frente), acrescenta ao esqueleto e aos 6 clipes
// uma track constante de fechar a mão (a direita segura o ZENI; a esquerda fica relaxada) e põe o Socket no centro da pegada.
// Entrada: scripts/zeni-personagem-alinhado.glb (saída de alinhar-ossos.mjs). Saída: src/assets/zeni-personagem.glb.
// Uso (na pasta zeni-site): node scripts/alinhar-ossos.mjs scripts/fonte/zeni-personagem-blender.glb scripts/zeni-personagem-alinhado.glb
//                           node scripts/adicionar-dedos.mjs
import fs from 'node:fs'
import { lerGlb } from './glb-ler.mjs'

const ENTRADA = process.argv[2] ?? new URL('./zeni-personagem-alinhado.glb', import.meta.url).pathname
const SAIDA = process.argv[3] ?? new URL('../src/assets/zeni-personagem.glb', import.meta.url).pathname

// --- medidas (metros), relativas ao osso da mão no lado direito; no esquerdo o x é espelhado ---
const DEDOS = { base: [0, -0.088, -0.007], ponta: [0, -0.145, -0.007] }
const POLEGAR = { base: [0, -0.06, 0.04], ponta: [0, -0.115, 0.045] }
// centro do ZENI na pegada: a 0,044 m (raio do ZENI 0,03 + meia espessura do dedo 0,014) do nó dos dedos, para o arco dos dedos abraçá-lo
const CENTRO_ZENI = [0.044, -0.088, 0.0]
// ângulos de fechar (graus, em torno do eixo z da mão; o sinal vira o lado)
const PEGADA = {
  R: { Fingers: 40, FingersTip: 80, Thumb: 25, ThumbTip: 40 }, // segura o ZENI (cada ângulo é relativo ao osso pai)
  L: { Fingers: 20, FingersTip: 25, Thumb: 8, ThumbTip: 10 }, // relaxada
}

const g = lerGlb(ENTRADA)
const j = g.json
let bin = Buffer.from(g.bin)
const nos = j.nodes
const idx = (n) => nos.findIndex((x) => x.name === n)
const pai = new Map()
nos.forEach((n, i) => (n.children ?? []).forEach((c) => pai.set(c, i)))
const mundo = (i) => { let p = [0, 0, 0]; for (let k = i; k !== undefined; k = pai.get(k)) { const t = nos[k].translation ?? [0, 0, 0]; p = p.map((v, d) => v + t[d]) } return p }
const suave = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

// --- ler o que vamos reescrever ---
const prim = j.meshes[0].primitives[0]
const accP = j.accessors[prim.attributes.POSITION], accJ = j.accessors[prim.attributes.JOINTS_0], accW = j.accessors[prim.attributes.WEIGHTS_0]
const desloc = (acc) => (j.bufferViews[acc.bufferView].byteOffset ?? 0) + (acc.byteOffset ?? 0)
const P = new Float32Array(bin.buffer.slice(bin.byteOffset + desloc(accP), bin.byteOffset + desloc(accP) + accP.count * 12))
const Jn = new Uint8Array(bin.buffer.slice(bin.byteOffset + desloc(accJ), bin.byteOffset + desloc(accJ) + accJ.count * 4))
const Wt = new Float32Array(bin.buffer.slice(bin.byteOffset + desloc(accW), bin.byteOffset + desloc(accW) + accW.count * 16))
const skin = j.skins[0]
const IBM_antigo = new Float32Array(bin.buffer.slice(bin.byteOffset + desloc(j.accessors[skin.inverseBindMatrices]), bin.byteOffset + desloc(j.accessors[skin.inverseBindMatrices]) + skin.joints.length * 64))

// --- helpers para acrescentar dados ao .glb ---
const anexar = (typed, alvo) => {
  const pad = (4 - (bin.length % 4)) % 4
  bin = Buffer.concat([bin, Buffer.alloc(pad)])
  const off = bin.length
  bin = Buffer.concat([bin, Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength)])
  j.bufferViews.push({ buffer: 0, byteOffset: off, byteLength: typed.byteLength, ...(alvo ? { target: alvo } : {}) })
  return j.bufferViews.length - 1
}
const novoAcessor = (typed, tipo, contagem, extra = {}) => {
  j.accessors.push({ bufferView: anexar(typed), componentType: 5126, count: contagem, type: tipo, ...extra })
  return j.accessors.length - 1
}

// --- ossos novos ---
const novasJuntas = [] // { nome, mundo, lado }
const idxJunta = Object.fromEntries(skin.joints.map((n, i) => [nos[n].name, i]))
const rotZ = (graus) => { const h = (graus * Math.PI) / 360; return [0, 0, Math.sin(h), Math.cos(h)] }
for (const lado of ['R', 'L']) {
  const sx = lado === 'R' ? 1 : -1
  const iMao = idx(`Hand.${lado}`)
  const H = mundo(iMao)
  const rel = (v) => [H[0] + sx * v[0], H[1] + v[1], H[2] + v[2]]
  const defs = [
    ['Fingers', iMao, rel(DEDOS.base)],
    ['FingersTip', null, rel(DEDOS.ponta), 'Fingers'],
    ['Thumb', iMao, rel(POLEGAR.base)],
    ['ThumbTip', null, rel(POLEGAR.ponta), 'Thumb'],
  ]
  const criados = {}
  for (const [nome, paiIdx, pos, paiNome] of defs) {
    const pIdx = paiNome ? criados[paiNome].i : paiIdx
    const pMundo = paiNome ? criados[paiNome].mundo : H
    nos.push({ name: `${nome}.${lado}`, translation: pos.map((v, d) => +(v - pMundo[d]).toFixed(6)) })
    const i = nos.length - 1
    pai.set(i, pIdx);
    (nos[pIdx].children ??= []).push(i)
    criados[nome] = { i, mundo: pos }
    novasJuntas.push({ nome: `${nome}.${lado}`, i, mundo: pos, lado })
  }
  // o Socket marca o centro da pegada (o ZENI entra ali, do lado de dentro da palma)
  const s = nos[idx(`Socket.${lado}`)]
  s.translation = CENTRO_ZENI.map((v, d) => +(d === 0 ? sx * v : v).toFixed(6))
}
for (const nj of novasJuntas) { skin.joints.push(nj.i); idxJunta[nj.nome] = skin.joints.length - 1 }

// IBM: as antigas + translação negativa do mundo das novas
const IBM = new Float32Array(skin.joints.length * 16)
IBM.set(IBM_antigo)
novasJuntas.forEach((nj, k) => {
  const o = (IBM_antigo.length / 16 + k) * 16
  IBM.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -nj.mundo[0], -nj.mundo[1], -nj.mundo[2], 1], o)
})
skin.inverseBindMatrices = novoAcessor(IBM, 'MAT4', skin.joints.length)

// --- pesos de pele: separar dedos e polegar dentro da mão ---
let movidos = 0
for (const lado of ['R', 'L']) {
  const sx = lado === 'R' ? 1 : -1
  const H = mundo(idx(`Hand.${lado}`))
  const hand = idxJunta[`Hand.${lado}`]
  const id = (n) => idxJunta[`${n}.${lado}`]
  for (let v = 0; v < accP.count; v++) {
    let wh = 0
    for (let k = 0; k < 4; k++) if (Jn[v * 4 + k] === hand) wh += Wt[v * 4 + k]
    if (wh < 0.01) continue
    const dy = -(P[v * 3 + 1] - H[1]) // para baixo, a partir do punho
    const dz = P[v * 3 + 2] - H[2]
    const polegar = suave(dz, 0.018, 0.032) // à frente: polegar
    const dedos = 1 - polegar
    const pesos = {
      Fingers: wh * dedos * suave(dy, 0.075, 0.095) * (1 - suave(dy, 0.135, 0.155)),
      FingersTip: wh * dedos * suave(dy, 0.135, 0.155),
      Thumb: wh * polegar * suave(dy, 0.045, 0.065) * (1 - suave(dy, 0.1, 0.12)),
      ThumbTip: wh * polegar * suave(dy, 0.1, 0.12),
    }
    const lista = []
    for (let k = 0; k < 4; k++) if (Wt[v * 4 + k] > 0) lista.push([Jn[v * 4 + k], Wt[v * 4 + k] - (Jn[v * 4 + k] === hand ? Object.values(pesos).reduce((a, b) => a + b, 0) : 0)])
    for (const [n, w] of Object.entries(pesos)) if (w > 1e-4) lista.push([id(n), w])
    const top = lista.filter(([, w]) => w > 1e-4).sort((a, b) => b[1] - a[1]).slice(0, 4)
    const soma = top.reduce((a, [, w]) => a + w, 0)
    for (let k = 0; k < 4; k++) { Jn[v * 4 + k] = top[k]?.[0] ?? 0; Wt[v * 4 + k] = top[k] ? top[k][1] / soma : 0 }
    movidos++
  }
}
// gravar JOINTS_0 / WEIGHTS_0 no lugar
Buffer.from(Jn.buffer).copy(bin, desloc(accJ))
Buffer.from(Wt.buffer).copy(bin, desloc(accW))

// --- tracks de fechar a mão, constantes, em cada clipe ---
for (const a of j.animations) {
  const dur = Math.max(...a.channels.map((c) => j.accessors[a.samplers[c.sampler].input].max?.[0] ?? 0))
  const tempos = novoAcessor(new Float32Array([0, dur]), 'SCALAR', 2, { min: [0], max: [dur] })
  for (const nj of novasJuntas) {
    const grau = PEGADA[nj.lado][nj.nome.split('.')[0]] * (nj.lado === 'R' ? 1 : -1) // curvar para dentro (+x no direito, −x no esquerdo)
    const q = rotZ(grau)
    const saida = novoAcessor(new Float32Array([...q, ...q]), 'VEC4', 2)
    a.samplers.push({ input: tempos, output: saida, interpolation: 'LINEAR' })
    a.channels.push({ sampler: a.samplers.length - 1, target: { node: nj.i, path: 'rotation' } })
  }
}

j.buffers[0].byteLength = bin.length
let js = Buffer.from(JSON.stringify(j))
js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)])
const cab = Buffer.alloc(12); cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8)
const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4)
const c2 = Buffer.alloc(8); c2.writeUInt32LE(bin.length, 0); c2.writeUInt32LE(0x004e4942, 4)
fs.writeFileSync(SAIDA, Buffer.concat([cab, c1, js, c2, bin]))
console.log(`ok: ${SAIDA}\n  ossos novos: ${novasJuntas.length}, vértices da mão reponderados: ${movidos}, juntas no esqueleto: ${skin.joints.length}`)
