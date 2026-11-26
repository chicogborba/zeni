import fs from 'node:fs'
// Troca no .glb só os vértices que scripts/abrir-no-blender.py moveu (posição e normal). Ossos, pesos e clipes ficam iguais.
// Uso: node scripts/aplicar-ajustes.mjs <base.glb> <movidos.json> <saida.glb>  (normalmente via scripts/aplicar-ajustes.sh)
const [ENTRADA, MOVIDOS, SAIDA] = process.argv.slice(2)
const b = fs.readFileSync(ENTRADA)
const n = b.readUInt32LE(12)
const j = JSON.parse(b.subarray(20, 20 + n).toString('utf8'))
const bin = Buffer.from(b.subarray(20 + n + 8))
const prim = j.meshes[0].primitives[0]
const view = (ai) => { const a = j.accessors[ai], v = j.bufferViews[a.bufferView]
  if (v.byteStride && v.byteStride !== 12) throw new Error('stride')
  return { a, f: new Float32Array(bin.buffer, bin.byteOffset + (v.byteOffset || 0) + (a.byteOffset || 0), a.count * 3) } }
const P = view(prim.attributes.POSITION), N = view(prim.attributes.NORMAL)
const k = (x, y, z) => `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`
const mapa = new Map()
for (const m of JSON.parse(fs.readFileSync(MOVIDOS))) mapa.set(k(m[0], m[1], m[2]), m)
let feitos = 0; const usados = new Set()
for (let i = 0; i < P.a.count; i++) {
  const kk = k(P.f[i * 3], P.f[i * 3 + 1], P.f[i * 3 + 2]); const m = mapa.get(kk)
  if (!m) continue
  usados.add(kk); feitos++
  P.f.set(m.slice(3, 6), i * 3)
  const l = Math.hypot(m[6], m[7], m[8]) || 1
  N.f.set([m[6] / l, m[7] / l, m[8] / l], i * 3)
}
for (const [kk, m] of mapa) {
  if (usados.has(kk)) continue
  for (let i = 0; i < P.a.count; i++) {
    if (Math.hypot(P.f[i * 3] - m[0], P.f[i * 3 + 1] - m[1], P.f[i * 3 + 2] - m[2]) > 1e-6) continue
    P.f.set(m.slice(3, 6), i * 3); const l = Math.hypot(m[6], m[7], m[8]) || 1
    N.f.set([m[6] / l, m[7] / l, m[8] / l], i * 3); usados.add(kk); feitos++
  }
}
const min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9]
for (let i = 0; i < P.a.count; i++) for (let c = 0; c < 3; c++) { min[c] = Math.min(min[c], P.f[i * 3 + c]); max[c] = Math.max(max[c], P.f[i * 3 + c]) }
P.a.min = min; P.a.max = max
console.log('vértices no glb', P.a.count, '| trocados', feitos, '| movidos sem par', mapa.size - usados.size)
let js = Buffer.from(JSON.stringify(j)); const pad = (4 - (js.length % 4)) % 4; js = Buffer.concat([js, Buffer.alloc(pad, 0x20)])
const cab = Buffer.alloc(12); cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8)
const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4)
const c2 = Buffer.alloc(8); c2.writeUInt32LE(bin.length, 0); c2.writeUInt32LE(0x004e4942, 4)
fs.writeFileSync(SAIDA, Buffer.concat([cab, c1, js, c2, bin]))
