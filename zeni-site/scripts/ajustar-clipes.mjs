// Reescreve as rotações do braço direito em dois clipes, para que sejam bem diferentes entre si:
//   A_girar_o_punho: ombro e cotovelo parados; só o antebraço gira em torno do próprio eixo (pronação/supinação).
//   D_tocar_na_mesa: elevação grande: cotovelo quase esticado (mão na mesa) até muito dobrado (mão perto do queixo), e volta.
// Não muda nomes de ossos nem de clipes, nem a duração e o loop do arquivo (amostragem a 30 fps, primeira = última chave).
// Os outros clipes (B, C, E, F) ficam como estão. Também cria três clipes novos: G_virar_a_mao_esticada, H_circulo_com_o_pulso,
// I_alcancar_a_frente (copiam a estrutura de C_no_ritmo; ainda não estão ligados ao catálogo do app).
// Ângulos de cotovelo abaixo são o ângulo interno do braço (180° = esticado); a rotação aplicada é a flexão (180° − interno).
// Entrada: scripts/zeni-personagem-alinhado.glb (saída de alinhar-ossos.mjs). Saída: scripts/zeni-personagem-clipes.glb.
// Uso (na pasta zeni-site): node scripts/ajustar-clipes.mjs
import fs from 'node:fs'
import * as THREE from 'three'
import { lerGlb } from './glb-ler.mjs'

const ENTRADA = process.argv[2] ?? new URL('./zeni-personagem-alinhado.glb', import.meta.url).pathname
const SAIDA = process.argv[3] ?? new URL('./zeni-personagem-clipes.glb', import.meta.url).pathname
const FPS = 30

// ---------- as poses (graus) ----------
const A = {
  braco: { flex: 10, abd: 0 }, // braço junto ao corpo, parado
  cotovelo: 180 - 100, // cotovelo a ~100° (interno): antebraço quase na horizontal à frente
  giro: 55, // oscilação total do antebraço: ±55° em torno do eixo dele (metade no antebraço, metade na mão)
}
const D = {
  braco: { flex: 44, abd: 4 }, // braço estendido à frente e para baixo; o ombro não se mexe
  cotoveloBaixo: 180 - 155, // começa quase esticado (~155° interno), mão na altura da mesa
  cotoveloAlto: 180 - 50, // sobe até ~50° interno, mão perto do queixo/ombro
  maoBaixo: 25, // punho que mantém o ZENI de pé na mesa
  maoAlto: -55, // no alto o ZENI se inclina um pouco para trás (compensação parcial: o punho não dobra além do natural)
}

const D2R = Math.PI / 180
const eixo = (x, y, z, g) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(x, y, z).normalize(), g * D2R)
const qx = (g) => eixo(1, 0, 0, g)
const qz = (g) => eixo(0, 0, 1, g)
const cosE = (t, T) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / T) // 0 em 0 e T, 1 em T/2 (velocidade zero nas pontas)
const sen = (t, T) => Math.sin((2 * Math.PI * t) / T)
// braço direito: flex sobe para a frente (rotação −x), abd afasta do corpo (−z no lado direito)
const qBraco = ({ flex, abd }) => qz(-abd).multiply(qx(-flex))

const g = lerGlb(ENTRADA)
const j = g.json
let bin = Buffer.from(g.bin)
const nos = j.nodes
const idx = (n) => nos.findIndex((x) => x.name === n)

// eixo do antebraço (do cotovelo ao punho), no espaço do osso: o giro é em torno dele, para a mão não sair do lugar
const t = nos[idx('Hand.R')].translation
const EIXO_ANTEBRACO = new THREE.Vector3(...t).normalize().negate() // aponta para o cotovelo; o sinal só define o sentido do giro
const giroNoAntebraco = (graus) => new THREE.Quaternion().setFromAxisAngle(EIXO_ANTEBRACO, graus * D2R)

const POSES = {
  A_: (tt, T) => {
    const u = sen(tt, T)
    return {
      'UpperArm.R': qBraco(A.braco),
      'Forearm.R': qx(-A.cotovelo).multiply(giroNoAntebraco((A.giro * u) / 2)),
      'Hand.R': giroNoAntebraco((A.giro * u) / 2),
    }
  },
  D_: (tt, T) => {
    const k = cosE(tt, T)
    const cot = D.cotoveloBaixo + (D.cotoveloAlto - D.cotoveloBaixo) * k
    const mao = D.maoBaixo + (D.maoAlto - D.maoBaixo) * k
    return { 'UpperArm.R': qBraco(D.braco), 'Forearm.R': qx(-cot), 'Hand.R': qx(-mao) } // sem giro do antebraço
  },
}

const anexar = (typed) => {
  const pad = (4 - (bin.length % 4)) % 4
  bin = Buffer.concat([bin, Buffer.alloc(pad)])
  const off = bin.length
  bin = Buffer.concat([bin, Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength)])
  j.bufferViews.push({ buffer: 0, byteOffset: off, byteLength: typed.byteLength })
  return j.bufferViews.length - 1
}
const acessor = (typed, tipo, n, extra = {}) => {
  j.accessors.push({ bufferView: anexar(typed), componentType: 5126, count: n, type: tipo, ...extra })
  return j.accessors.length - 1
}

// ---------- clipes novos (G, H, I): mesma estrutura dos atuais (copiam os canais de C_no_ritmo e trocam só o braço direito) ----------
const DUR_NOVOS = 2.4 // s de um ciclo (mesma duração que A usa no app)
const G = { abd: 88, flex: 10, cotovelo: 180 - 165, giro: 55 } // braço esticado para o lado, cotovelo ~165°
const H = { braco: { flex: 10, abd: 0 }, cotovelo: 180 - 100, flexPunho: 28, desvioPunho: 20, giro: 15 } // cotovelo ~100°, círculo com o pulso
const I = { cotoveloPerto: 180 - 90, cotoveloLonge: 180 - 165, bracoPerto: 10, bracoLonge: 85, abd: 3 } // da cintura até o braço esticado na horizontal
const NOVOS = {
  G_virar_a_mao_esticada: (tt, T) => {
    const u = sen(tt, T) // só o antebraço gira; ombro e cotovelo parados
    return {
      'UpperArm.R': qBraco({ flex: G.flex, abd: G.abd }),
      'Forearm.R': qx(-G.cotovelo).multiply(giroNoAntebraco((G.giro * u) / 2)),
      'Hand.R': giroNoAntebraco((G.giro * u) / 2),
    }
  },
  H_circulo_com_o_pulso: (tt, T) => {
    // círculo contínuo: flexão/extensão do pulso (eixo z da mão) e desvio (eixo x) defasados de 90°, mais um pouco de giro do antebraço
    const f = (2 * Math.PI * tt) / T
    return {
      'UpperArm.R': qBraco(H.braco),
      'Forearm.R': qx(-H.cotovelo).multiply(giroNoAntebraco(H.giro * Math.sin(f))),
      'Hand.R': qz(H.flexPunho * Math.sin(f)).multiply(qx(-H.desvioPunho * Math.cos(f))),
    }
  },
  I_alcancar_a_frente: (tt, T) => {
    const k = cosE(tt, T) // 0 perto do corpo, 1 braço esticado na horizontal
    return {
      'UpperArm.R': qBraco({ flex: I.bracoPerto + (I.bracoLonge - I.bracoPerto) * k, abd: I.abd }),
      'Forearm.R': qx(-(I.cotoveloPerto + (I.cotoveloLonge - I.cotoveloPerto) * k)),
      'Hand.R': new THREE.Quaternion(),
    }
  },
}
const base = j.animations.find((x) => x.name.startsWith('C_'))
for (const [nome, pose] of Object.entries(NOVOS)) {
  if (j.animations.some((x) => x.name === nome)) continue // idempotente
  const clipe = { name: nome, samplers: base.samplers.map((x) => ({ ...x })), channels: base.channels.map((c) => ({ sampler: c.sampler, target: { ...c.target } })) }
  const T = DUR_NOVOS
  const n = Math.round(T * FPS)
  const tempos = new Float32Array(n + 1).map((_, i) => Math.min(T, i / FPS))
  const aT = acessor(tempos, 'SCALAR', n + 1, { min: [0], max: [T] })
  const saidas = {}
  for (let i = 0; i <= n; i++) {
    const p = pose(i === n ? 0 : tempos[i], T)
    for (const [osso, q] of Object.entries(p)) (saidas[osso] ??= []).push(q.x, q.y, q.z, q.w)
  }
  for (const [osso, v] of Object.entries(saidas)) {
    const c = clipe.channels.find((c) => c.target.path === 'rotation' && nos[c.target.node].name === osso)
    clipe.samplers[c.sampler] = { input: aT, output: acessor(Float32Array.from(v), 'VEC4', n + 1), interpolation: 'LINEAR' }
  }
  j.animations.push(clipe)
  console.log(`${nome}: ${n + 1} chaves, ${T.toFixed(3)} s (novo)`)
}

for (const [prefixo, pose] of Object.entries(POSES)) {
  const clipe = j.animations.find((a) => a.name.startsWith(prefixo))
  const T = Math.max(...clipe.channels.map((c) => j.accessors[clipe.samplers[c.sampler].input].max?.[0] ?? 0)) // duração do arquivo
  const n = Math.round(T * FPS)
  const tempos = new Float32Array(n + 1).map((_, i) => Math.min(T, i / FPS))
  const aT = acessor(tempos, 'SCALAR', n + 1, { min: [0], max: [T] })
  const saidas = {}
  for (let i = 0; i <= n; i++) {
    const p = pose(i === n ? 0 : tempos[i], T) // última chave = primeira, para o loop fechar
    for (const [osso, q] of Object.entries(p)) (saidas[osso] ??= []).push(q.x, q.y, q.z, q.w)
  }
  for (const [osso, v] of Object.entries(saidas)) {
    const c = clipe.channels.find((c) => c.target.path === 'rotation' && nos[c.target.node].name === osso)
    const s = clipe.samplers[c.sampler]
    s.input = aT
    s.output = acessor(Float32Array.from(v), 'VEC4', n + 1)
  }
  console.log(`${clipe.name}: ${n + 1} chaves, ${T.toFixed(3)} s`)
}

j.buffers[0].byteLength = bin.length
let js = Buffer.from(JSON.stringify(j))
js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)])
const cab = Buffer.alloc(12); cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8)
const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4)
const c2 = Buffer.alloc(8); c2.writeUInt32LE(bin.length, 0); c2.writeUInt32LE(0x004e4942, 4)
fs.writeFileSync(SAIDA, Buffer.concat([cab, c1, js, c2, bin]))
console.log('ok:', SAIDA)
