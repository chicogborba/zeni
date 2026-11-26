// O ZENI de verdade, por Bluetooth (Web Bluetooth). Espelha o protocolo de firmware/src/main.cpp e firmware/README.md.
//
// Onde funciona: Chrome e Edge no Android, no Mac, no Windows e no ChromeOS, sempre em HTTPS (ou localhost).
// No iPhone, o Safari não tem Web Bluetooth: o app Bluefy (gratuito) tem. Sem suporte, o app segue no modo de
// demonstração (src/simulacao.js), com os mesmos eventos de sinal e bateria.
//
// O navegador só abre a lista de aparelhos depois de um toque da pessoa (regra de segurança): por isso `conectar()`
// tem de ser chamado direto de um onClick. Depois de conectado, se o sinal cair, este módulo tenta voltar sozinho.
//
// Para a equipe: abra o site com `?tecnico` no endereço para ver o painel técnico (taxa, perdas, ângulos, firmware).
import { emitirBateriaFraca, emitirSinal } from './simulacao.js'

export const UUID = {
  servico: '7a3e0001-5a2b-4c8e-9b1f-2e6d0c5a9e10',
  dados: '7a3e0002-5a2b-4c8e-9b1f-2e6d0c5a9e10',
  comando: '7a3e0003-5a2b-4c8e-9b1f-2e6d0c5a9e10',
  estado: '7a3e0004-5a2b-4c8e-9b1f-2e6d0c5a9e10',
  info: '7a3e0005-5a2b-4c8e-9b1f-2e6d0c5a9e10',
}

export const CAL = { nunca: 0, medindo: 1, ok: 2, mexeu: 3, semSensor: 4 }
export const FLAG = { sensorOk: 1, calibrado: 2, calibrando: 4, usb: 8, bateriaFraca: 16 }

const HZ = 50
const BATERIA_FRACA = 20 // % abaixo da qual o exercício mostra o aviso discreto (uma vez por conexão)
const RECONEXAO_MS = [500, 1000, 2000, 3000, 5000] // espera entre tentativas automáticas

// ---------- Estado do módulo ----------
let aparelho = null
let caracteristicas = null
let conectadoAgora = false
let desligandoDePropósito = false
let tentativaReconexao = 0
let avisouBateria = false
let ultimoPacote = null
let info = null

const ouvintes = new Set() // mudanças de estado (para a interface re-renderizar)
const ouvintesPacote = new Set()

const estado = {
  nome: null,
  bateria: null, // 0–100 ou null (o ZENI não mede a bateria)
  calibracao: CAL.nunca,
  flags: 0,
  roll: 0,
  pitch: 0,
  // Qualidade do sinal, para o painel técnico e para o teste
  pacotes: 0,
  perdidos: 0,
  hz: 0,
}

const avisar = () => ouvintes.forEach((f) => f(estado))
export function aoMudarEstado(f) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}
export function aoPacote(f) {
  ouvintesPacote.add(f)
  return () => ouvintesPacote.delete(f)
}
export const estadoAtual = () => estado
export const infoDoFirmware = () => info
export const conectado = () => conectadoAgora
export const nomeDoAparelho = () => aparelho?.name ?? null

// ---------- Suporte ----------
const forcarDemonstracao = () => typeof location !== 'undefined' && new URLSearchParams(location.search).has('simular')

export function suporte() {
  if (forcarDemonstracao()) return { ok: false, motivo: 'demonstracao' }
  if (typeof navigator === 'undefined' || !navigator.bluetooth) {
    const ios = /iPhone|iPad|iPod/.test(navigator?.userAgent ?? '') || (navigator?.platform === 'MacIntel' && navigator?.maxTouchPoints > 1)
    return { ok: false, motivo: ios ? 'iphone' : 'navegador' }
  }
  if (!window.isSecureContext) return { ok: false, motivo: 'inseguro' }
  return { ok: true }
}

export async function bluetoothLigado() {
  try {
    return navigator.bluetooth.getAvailability ? await navigator.bluetooth.getAvailability() : true
  } catch {
    return true
  }
}

// ---------- Pacote de dados (20 bytes, little-endian) ----------
// [0] seq  [1] flags  [2..7] acel x,y,z (mg)  [8..13] giro x,y,z (0,1 °/s)  [14..17] roll, pitch (0,01 °)
// [18] bateria (0–100, 255 = não mede)  [19] calibração
let ultimoSeq = null
let janelaHz = { t0: 0, n: 0 }

function lerPacote(dv) {
  const p = {
    t: performance.now(),
    seq: dv.getUint8(0),
    flags: dv.getUint8(1),
    ax: dv.getInt16(2, true) / 1000,
    ay: dv.getInt16(4, true) / 1000,
    az: dv.getInt16(6, true) / 1000,
    gx: dv.getInt16(8, true) / 10,
    gy: dv.getInt16(10, true) / 10,
    gz: dv.getInt16(12, true) / 10,
    roll: dv.getInt16(14, true) / 100,
    pitch: dv.getInt16(16, true) / 100,
    bateria: dv.getUint8(18),
    calibracao: dv.getUint8(19),
  }
  if (ultimoSeq !== null) {
    const salto = (p.seq - ultimoSeq + 256) % 256
    if (salto > 1 && salto < 128) estado.perdidos += salto - 1
  }
  ultimoSeq = p.seq
  estado.pacotes += 1
  janelaHz.n += 1
  if (p.t - janelaHz.t0 >= 1000) {
    estado.hz = Math.round((janelaHz.n * 1000) / (p.t - janelaHz.t0))
    janelaHz = { t0: p.t, n: 0 }
  }
  return p
}

function aoNotificarDados(evento) {
  const p = lerPacote(evento.target.value)
  ultimoPacote = p
  estado.roll = p.roll
  estado.pitch = p.pitch
  estado.flags = p.flags
  const mudouBateria = aplicarBateria(p.bateria)
  const mudouCal = p.calibracao !== estado.calibracao
  estado.calibracao = p.calibracao
  processador.adicionar(p)
  ouvintesPacote.forEach((f) => f(p))
  if (mudouBateria || mudouCal) avisar()
}

function aplicarBateria(bruto) {
  const nova = bruto === 255 ? null : bruto
  if (nova === estado.bateria) return false
  estado.bateria = nova
  if (nova !== null && nova <= BATERIA_FRACA && !avisouBateria) {
    avisouBateria = true
    emitirBateriaFraca()
  }
  return true
}

function aoNotificarEstado(evento) {
  const dv = evento.target.value
  estado.calibracao = dv.getUint8(0)
  aplicarBateria(dv.getUint8(1))
  estado.flags = dv.getUint8(2)
  avisar()
}

// ---------- Conexão ----------
async function abrirGatt() {
  const gatt = await aparelho.gatt.connect()
  const servico = await gatt.getPrimaryService(UUID.servico)
  const [dados, comando, est, inf] = await Promise.all(
    [UUID.dados, UUID.comando, UUID.estado, UUID.info].map((u) => servico.getCharacteristic(u)),
  )
  caracteristicas = { dados, comando, estado: est }
  try {
    info = JSON.parse(new TextDecoder().decode(await inf.readValue()))
  } catch {
    info = null
  }
  aoNotificarEstado({ target: { value: await est.readValue() } })
  est.addEventListener('characteristicvaluechanged', aoNotificarEstado)
  await est.startNotifications()
  dados.addEventListener('characteristicvaluechanged', aoNotificarDados)
  await dados.startNotifications()
  ultimoSeq = null
  janelaHz = { t0: performance.now(), n: 0 }
  processador.zerar()
  conectadoAgora = true
  tentativaReconexao = 0
  estado.nome = aparelho.name
  emitirSinal(true)
  avisar()
}

async function aoDesconectar() {
  const estava = conectadoAgora
  conectadoAgora = false
  caracteristicas = null
  if (estava) emitirSinal(false)
  avisar()
  if (desligandoDePropósito || !aparelho) return
  // Reconexão automática: o objeto do aparelho continua válido enquanto a página estiver aberta
  while (!conectadoAgora && aparelho && !desligandoDePropósito) {
    const espera = RECONEXAO_MS[Math.min(tentativaReconexao, RECONEXAO_MS.length - 1)]
    tentativaReconexao += 1
    await new Promise((r) => setTimeout(r, espera))
    try {
      await abrirGatt()
    } catch {
      // segue tentando; o exercício decide quando perguntar à pessoa (duas tentativas de 10 s)
    }
  }
}

function prenderAparelho(novo) {
  if (aparelho && aparelho !== novo) aparelho.removeEventListener('gattserverdisconnected', aoDesconectar)
  aparelho = novo
  aparelho.addEventListener('gattserverdisconnected', aoDesconectar)
}

// Abre a lista do navegador. Chamar direto de um toque. Lança:
//   'cancelado'        a pessoa fechou a lista sem escolher
//   'bluetooth-desligado'
//   'falhou'           achou, mas não conseguiu conversar (longe, desligou no meio, outro celular conectado)
export async function conectar() {
  desligandoDePropósito = false
  let escolhido
  try {
    escolhido = await navigator.bluetooth.requestDevice({
      filters: [{ services: [UUID.servico] }, { namePrefix: 'ZENI' }],
      optionalServices: [UUID.servico, 'battery_service'],
    })
  } catch (e) {
    if (e?.name === 'NotFoundError' && /adapter|Bluetooth.*(off|unavailable)/i.test(e.message)) throw new Error('bluetooth-desligado')
    if (e?.name === 'NotFoundError' || e?.name === 'AbortError') throw new Error('cancelado')
    throw new Error('falhou')
  }
  prenderAparelho(escolhido)
  try {
    await abrirGatt()
  } catch {
    throw new Error('falhou')
  }
  avisouBateria = false
}

// Na abertura do app: se o navegador lembra do ZENI (Chrome com getDevices), reconecta sem pedir a lista de novo.
export async function reconectarLembrado() {
  if (!suporte().ok || !navigator.bluetooth.getDevices || conectadoAgora) return false
  try {
    const lembrados = (await navigator.bluetooth.getDevices()).filter((d) => d.name?.startsWith('ZENI'))
    if (!lembrados.length) return false
    prenderAparelho(lembrados[0])
    await abrirGatt()
    return true
  } catch {
    return false
  }
}

export function desconectar() {
  desligandoDePropósito = true
  aparelho?.gatt?.disconnect()
}

async function enviar(letra) {
  if (!caracteristicas) throw new Error('falhou')
  const byte = new Uint8Array([letra.charCodeAt(0)])
  const c = caracteristicas.comando
  await (c.writeValueWithResponse ? c.writeValueWithResponse(byte) : c.writeValue(byte))
}

// "Apoie o ZENI na mesa por 3 segundos": o ZENI mede o próprio repouso e decide.
// Resolve com 'ok' | 'mexeu' | 'sem-sensor'.
export function calibrar() {
  return new Promise((resolve, reject) => {
    let comecou = false
    const limite = setTimeout(() => {
      parar()
      reject(new Error('falhou'))
    }, 8000)
    const parar = aoMudarEstado((e) => {
      if (e.calibracao === CAL.medindo) comecou = true
      else if (comecou || e.calibracao === CAL.semSensor) {
        clearTimeout(limite)
        parar()
        resolve(e.calibracao === CAL.ok ? 'ok' : e.calibracao === CAL.semSensor ? 'sem-sensor' : 'mexeu')
      }
    })
    enviar('C').catch((err) => {
      clearTimeout(limite)
      parar()
      reject(err)
    })
  })
}

export const piscar = () => enviar('I').catch(() => {})
export const dormir = () => enviar('S').catch(() => {})

// ---------- Do sensor ao "tamanho do movimento" ----------
// O exercício (src/telas/Exercicio.jsx) lê uma amostra a cada 250 ms. Cada janela de 250 ms vira três números:
//   tamanho   0–100  quanto a pessoa está se mexendo (velocidade de giro e aceleração, sem o tremor)
//   oscilacao -1–1   o movimento com sinal, no eixo em que a pessoa mais se mexe (para o ritmo: 1 vai-e-volta = 1 ciclo)
//   tremor    0–100  tremido rápido por cima do movimento (vibração de 3 a 12 Hz)
// As escalas abaixo são o primeiro ajuste com o protótipo. Mude aqui depois de testar com pessoas.
export const AJUSTE = {
  giroCheio: 120, // °/s de giro que já valem tamanho 100 (girar o punho de lado a lado em ~1 s)
  aceleracaoCheia: 0.45, // g de aceleração (sem a gravidade) que já valem tamanho 100 (levantar, tocar na mesa)
  tremorCheio: 25, // °/s de tremido que já valem tremor 100
  corteLento: 3.5, // Hz: abaixo disto é movimento de propósito; acima é tremido (tremor de Parkinson: 4 a 6 Hz)
}

// Passa-alta Butterworth de 4ª ordem (duas biquads, fórmulas do "Audio EQ Cookbook"). Separa o tremido (3 a 12 Hz)
// do movimento de propósito (0,3 a 2 Hz) sem deixar o giro do punho vazar para o "tremor".
function biquadPassaAlta(fc, q) {
  const w = (2 * Math.PI * fc) / HZ
  const al = Math.sin(w) / (2 * q)
  const c = Math.cos(w)
  const a0 = 1 + al
  const b0 = (1 + c) / 2 / a0
  const b1 = -(1 + c) / a0
  const a1 = (-2 * c) / a0
  const a2 = (1 - al) / a0
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  return (x) => {
    const y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2
    x2 = x1
    x1 = x
    y2 = y1
    y1 = y
    return y
  }
}
const passaAlta4 = (fc) => {
  const f1 = biquadPassaAlta(fc, 0.5412)
  const f2 = biquadPassaAlta(fc, 1.3066)
  return (x) => f2(f1(x))
}

function criarProcessador() {
  const kGravidade = 1 - Math.exp((-2 * Math.PI * 0.3) / HZ)
  let filtros = null
  let gravidade = null
  let janela = []
  let variancia = [0, 0, 0] // para descobrir o eixo principal do movimento
  let aquecendo = 0 // os filtros levam ~1 s para assentar: nesse tempo o tremor não conta
  return {
    zerar() {
      filtros = null
      gravidade = null
      janela = []
      variancia = [0, 0, 0]
    },
    adicionar(p) {
      const g = [p.gx, p.gy, p.gz]
      const a = [p.ax, p.ay, p.az]
      if (!filtros) {
        filtros = [0, 1, 2].map(() => passaAlta4(AJUSTE.corteLento))
        gravidade = [...a]
        aquecendo = HZ
      }
      const rapido = [0, 0, 0]
      const lento = [0, 0, 0]
      for (let i = 0; i < 3; i++) {
        rapido[i] = filtros[i](g[i])
        lento[i] = g[i] - rapido[i] // o resto é o movimento de propósito
        gravidade[i] += kGravidade * (a[i] - gravidade[i])
        variancia[i] = variancia[i] * 0.99 + 0.01 * lento[i] * lento[i]
      }
      if (aquecendo > 0) aquecendo -= 1
      const dinamica = Math.hypot(a[0] - gravidade[0], a[1] - gravidade[1], a[2] - gravidade[2])
      janela.push({ lento, rapido: aquecendo > 0 ? 0 : Math.hypot(...rapido), dinamica })
    },
    // Fecha a janela atual (chamado a cada 250 ms). null se não chegou nada (sinal caído).
    fecharJanela() {
      if (!janela.length) return null
      const eixo = variancia.indexOf(Math.max(...variancia))
      const n = janela.length
      const giro = janela.reduce((s, j) => s + Math.hypot(...j.lento), 0) / n
      const dinamica = janela.reduce((s, j) => s + j.dinamica, 0) / n
      const tremido = janela.reduce((s, j) => s + j.rapido, 0) / n
      const comSinal = janela.reduce((s, j) => s + j.lento[eixo], 0) / n
      janela = []
      const lim = (v) => Math.max(0, Math.min(100, v))
      return {
        tamanho: lim(Math.max(giro / AJUSTE.giroCheio, dinamica / AJUSTE.aceleracaoCheia) * 100),
        oscilacao: Math.max(-1, Math.min(1, comSinal / AJUSTE.giroCheio)),
        tremor: lim((tremido / AJUSTE.tremorCheio) * 100),
      }
    },
  }
}
const processador = criarProcessador()
export const fecharJanela = () => processador.fecharJanela()
export const ultimo = () => ultimoPacote

// Para testes (tools/testar-zeni.mjs): injeta um pacote cru como se tivesse chegado pelo Bluetooth.
export const receberPacote = (dv) => aoNotificarDados({ target: { value: dv } })
