// Teste sem hardware: gera pacotes como os do firmware (50 Hz) e confere o processamento e a nota.
// Rodar: node tools/testar-zeni.mjs
import { avaliar } from '../src/avaliacao.js'
import { fecharJanela, receberPacote } from '../src/zeni-dispositivo.js'

function pacote(seq, gx, gy, gz, ax = 0, ay = 0, az = 1) {
  const dv = new DataView(new ArrayBuffer(20))
  dv.setUint8(0, seq & 255)
  dv.setUint8(1, 3)
  ;[ax, ay, az].forEach((v, i) => dv.setInt16(2 + i * 2, Math.round(v * 1000), true))
  ;[gx, gy, gz].forEach((v, i) => dv.setInt16(8 + i * 2, Math.round(v * 10), true))
  dv.setUint8(18, 80)
  dv.setUint8(19, 2)
  return dv
}

function sessao({ segundos = 30, periodo = 1.6, giro = 150, tremorHz = 0, tremorDps = 0, parado = false }) {
  const res = { amostras: [], oscilacao: [], tremores: [], pausas: 0, ritmoSeg: periodo }
  let seq = 0
  for (let i = 0; i < segundos * 50; i++) {
    const t = i / 50
    const voluntario = parado ? 0 : giro * Math.sin((2 * Math.PI * t) / periodo)
    const trem = tremorDps * Math.sin(2 * Math.PI * tremorHz * t)
    receberPacote(pacote(seq++, voluntario + trem, trem * 0.5, 0))
    if (i % 12 === 11) {
      const j = fecharJanela()
      res.amostras.push(Math.round(j.tamanho))
      res.oscilacao.push(j.oscilacao)
      res.tremores.push(Math.round(j.tremor))
    }
  }
  return res
}

const casos = {
  'suave, no ritmo (1,6 s)': sessao({}),
  'com tremor de 5 Hz': sessao({ tremorHz: 5, tremorDps: 30 }),
  'fora do ritmo (0,8 s)': sessao({ periodo: 0.8 }),
  parado: sessao({ parado: true }),
}
for (const [nome, r] of Object.entries(casos)) {
  const a = avaliar({ ...r, ritmoSeg: 1.6 }, 60)
  console.log(nome.padEnd(26), `tamanho ${a.tamanho}  suavidade ${a.suavidade}  ritmo ${a.ritmo}  nota ${a.nota}`)
}
