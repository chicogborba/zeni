// Leitor mínimo de .glb (JSON + BIN), sem dependências. Usado pelo script de preparo e para inspeção.
import fs from 'node:fs'
export function lerGlb(caminho) {
  const b = fs.readFileSync(caminho)
  const n = b.readUInt32LE(12)
  const json = JSON.parse(b.subarray(20, 20 + n).toString('utf8'))
  const bin = b.subarray(20 + n + 8)
  const acessor = (i) => {
    const a = json.accessors[i], v = json.bufferViews[a.bufferView]
    const nc = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type]
    const off = (v.byteOffset || 0) + (a.byteOffset || 0)
    const T = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array, 5121: Uint8Array }[a.componentType]
    const dados = new T(bin.buffer.slice(bin.byteOffset + off, bin.byteOffset + off + a.count * nc * T.BYTES_PER_ELEMENT))
    return { dados, nc, count: a.count }
  }
  return { json, bin, acessor }
}
