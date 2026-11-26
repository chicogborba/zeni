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
  atualizarOrientacao(p) // antes: o processamento usa a orientação para tirar a gravidade
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
  orientacaoIniciada = false
  qRef = null
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
// O exercício (src/telas/Exercicio.jsx) lê uma janela a cada 250 ms. Cada janela vira três números:
//   tamanho   0–100  quanto a pessoa está se mexendo DO JEITO QUE O EXERCÍCIO PEDE
//   oscilacao -1–1   o movimento com sinal (vai = +, volta = −): um vai-e-volta = um ciclo, para medir o ritmo
//   tremor    0–100  tremido rápido por cima do movimento (3,5 a 12 Hz), que vira a suavidade
//
// Cada exercício usa o sensor que enxerga o movimento dele (MODO_DO_EXERCICIO):
//   A, C, E  punho girando: só GIRO. O ZENI quase não sai do lugar, e girar faz a gravidade "passear" no
//            acelerômetro, o que dava saltos falsos.
//   B        levar ao ombro: ACELERAÇÃO VERTICAL (no mundo, sem a gravidade), integrada em velocidade. É um
//            deslocamento; o giro aqui é pequeno e depende de como cada um segura.
//   D        tocar na mesa: ACELERAÇÃO VERTICAL com as batidas cortadas (a batida na mesa dá um pico de 2–4 g que
//            pulava a barra) e ignoradas no tremor; o ritmo é o sobe-desce.
//   F        lado a lado na mesa: GIRO EM TORNO DA VERTICAL (no mundo). O antebraço apoiado gira pelo cotovelo.
//   geral    fora do exercício (teste ao vivo): o maior entre giro e velocidade vertical.
// A aceleração só é usada já no mundo (pela orientação 3D), com a gravidade tirada. Por isso a orientação é atualizada
// antes do processamento de cada pacote.
export const MODO_DO_EXERCICIO = { A: 'giro', C: 'giro', E: 'giro', B: 'vertical', D: 'batida', F: 'giroVertical' }

// As escalas abaixo são o primeiro ajuste com o protótipo. Mude aqui depois de testar com pessoas.
export const AJUSTE = {
  // Os "cheios" são o PICO de velocidade de um movimento bom, que vale tamanho 100:
  giroCheio: 220, // °/s (A, C, E: virar a palma de um lado ao outro, ~140°, em ~1,6 s)
  giroVerticalCheio: 120, // °/s em torno da vertical (F: antebraço indo ±35° em ~1,6 s)
  velocidadeCheia: 0.65, // m/s na vertical (B: da cintura ao ombro, ~35 cm, em ~1,6 s)
  velocidadeBatida: 0.25, // m/s na vertical (D: levantar uns 10 cm e voltar à mesa no tempo do pulso)
  // O tamanho segue o maior pico recente (envelope) e não a velocidade do instante: a velocidade zera em cada virada do
  // movimento, e era isso que fazia a barra e o pulso amarelo "pularem" duas vezes por ciclo.
  esquecimento: 0.9, // por janela de 250 ms: o pico antigo perde 10% (meia-vida ~1,6 s, um ciclo de movimento)
  tremorCheio: 25, // °/s de tremido que valem tremor 100
  corteLento: 3.5, // Hz: abaixo disto é movimento de propósito; acima é tremido (tremor de Parkinson: 4 a 6 Hz)
  batida: 1.8, // g: acima disto é batida na mesa (D), não movimento
  // Como o MPU está montado dentro do ZENI: rotação (graus, x-y-z) que leva os eixos do sensor aos do ZENI 3D, cujo
  // eixo longo é o y. Padrão: o z do sensor ao longo do ZENI. Se o fantasma girar no eixo errado, ajuste aqui.
  montagem: [-90, 0, 0],
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
const passaBaixa = (fc) => {
  const k = 1 - Math.exp((-2 * Math.PI * fc) / HZ)
  let y = null
  return (x) => (y = y === null ? x : y + k * (x - y))
}

// ---------- Orientação 3D ----------
// O giro dos três eixos é integrado num quatérnio, com a gravidade corrigindo a inclinação (filtro de Mahony, só a
// parte proporcional). A correção só vale quando o ZENI está quase sem aceleração própria: levantar, descer e bater na
// mesa enganam o acelerômetro, e era isso que fazia o fantasma dar pulos. A rotação em torno da vertical deriva
// devagar; por isso o fantasma usa a orientação RELATIVA a uma referência marcada no começo de cada exercício.
const qMul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
]
const qConj = (q) => [-q[0], -q[1], -q[2], q[3]]
const qNorm = (q) => {
  const n = Math.hypot(...q) || 1
  return q.map((v) => v / n)
}
const girar = (q, v) => qMul(qMul(q, [v[0], v[1], v[2], 0]), qConj(q)).slice(0, 3) // vetor do corpo para o mundo
let qAtual = [0, 0, 0, 1] // do corpo do sensor para o mundo (z para cima)
let qRef = null
let orientacaoIniciada = false
const GANHO_GRAVIDADE = 1.5 // quanto a gravidade puxa a inclinação de volta, com o ZENI parado
const TOLERANCIA_G = 0.12 // longe de 1 g por mais que isto, o acelerômetro não corrige a inclinação

function atualizarOrientacao(p) {
  const n = Math.hypot(p.ax, p.ay, p.az)
  if (!orientacaoIniciada && n > 0.5) {
    // começa já inclinado como o sensor está (sem rotação em torno da vertical)
    const r = Math.atan2(p.ay, p.az)
    const pt = Math.atan2(-p.ax, Math.hypot(p.ay, p.az))
    qAtual = qNorm(qMul([0, Math.sin(pt / 2), 0, Math.cos(pt / 2)], [Math.sin(r / 2), 0, 0, Math.cos(r / 2)]))
    orientacaoIniciada = true
    return
  }
  const rad = Math.PI / 180
  let w = [p.gx * rad, p.gy * rad, p.gz * rad]
  const confianca = Math.max(0, 1 - Math.abs(n - 1) / TOLERANCIA_G)
  if (confianca > 0) {
    const v = qMul(qMul(qConj(qAtual), [0, 0, 1, 0]), qAtual) // "para cima" estimado, no corpo do sensor
    const a = [p.ax / n, p.ay / n, p.az / n]
    const e = [a[1] * v[2] - a[2] * v[1], a[2] * v[0] - a[0] * v[2], a[0] * v[1] - a[1] * v[0]]
    const k = GANHO_GRAVIDADE * confianca * confianca
    w = w.map((x, i) => x + k * e[i])
  }
  const ang = Math.hypot(...w) / HZ
  if (ang > 0) {
    const s = Math.sin(ang / 2) / (Math.hypot(...w) || 1)
    qAtual = qNorm(qMul(qAtual, [w[0] * s, w[1] * s, w[2] * s, Math.cos(ang / 2)]))
  }
}

export function marcarReferencia() {
  qRef = [...qAtual]
}
// Rotação desde a referência, no corpo do sensor: [x, y, z, w]. Sem referência, marca agora.
export function orientacaoRelativa() {
  if (!qRef) marcarReferencia()
  return qMul(qConj(qRef), qAtual)
}

// ---------- Processamento por exercício ----------
let modo = 'geral'
// Chamado pelo exercício ao começar (e com null ao sair): escolhe o sensor certo para o movimento pedido.
export function definirExercicio(id) {
  modo = (id && MODO_DO_EXERCICIO[id]) || 'geral'
  processador.zerar()
}
export const modoAtual = () => modo

function criarProcessador() {
  let f = null
  let janela = []
  let variancia = [0, 0, 0] // para descobrir o eixo principal do giro
  let aquecendo = 0 // os filtros levam ~1 s para assentar: nesse tempo o tremor não conta
  let velocidade = 0 // m/s na vertical
  let semTremor = 0 // amostras: depois de uma batida, o tremido fica de fora por um instante
  let envelope = 0
  return {
    zerar() {
      f = null
      janela = []
      variancia = [0, 0, 0]
      velocidade = 0
      envelope = 0
    },
    adicionar(p) {
      if (!f) {
        f = { alta: [0, 1, 2].map(() => passaAlta4(AJUSTE.corteLento)), vertical: passaBaixa(4), wz: passaBaixa(AJUSTE.corteLento) }
        aquecendo = HZ
      }
      const g = [p.gx, p.gy, p.gz]
      const rapido = [0, 0, 0]
      const lento = [0, 0, 0]
      for (let i = 0; i < 3; i++) {
        rapido[i] = f.alta[i](g[i])
        lento[i] = g[i] - rapido[i] // o resto é o movimento de propósito
        variancia[i] = variancia[i] * 0.99 + 0.01 * lento[i] * lento[i]
      }
      if (aquecendo > 0) aquecendo -= 1

      // Aceleração no mundo, sem a gravidade. Batidas cortadas: só o sobe-desce conta.
      const norma = Math.hypot(p.ax, p.ay, p.az)
      const batida = norma > AJUSTE.batida
      if (batida) semTremor = 8 // 160 ms
      const aMundo = girar(qAtual, [p.ax, p.ay, p.az])
      const azLin = Math.max(-1, Math.min(1, aMundo[2] - 1)) // g
      let az = f.vertical(batida ? 0 : azLin)
      if (Math.abs(az) < 0.02) az = 0 // zona morta: um grau de erro na inclinação já "vaza" 0,017 g de gravidade
      // velocidade vertical com "vazamento" (passa-alta de 0,3 Hz): integrar aceleração deriva, isto a traz de volta a 0
      velocidade += az * 9.81 * (1 / HZ)
      velocidade -= velocidade * 2 * Math.PI * 0.3 * (1 / HZ)
      // parado de verdade (sem giro e com 1 g certinho): a velocidade é zero
      if (Math.hypot(...g) < 8 && Math.abs(norma - 1) < 0.03) velocidade *= 0.8

      // giro em torno da vertical do mundo (F)
      const wz = f.wz(girar(qAtual, g)[2])

      if (semTremor > 0) semTremor -= 1
      const tremido = aquecendo > 0 || semTremor > 0 ? 0 : Math.hypot(...rapido)
      janela.push({ lento, wz, velocidade, tremido })
    },
    // Fecha a janela atual (chamado a cada 250 ms). null se não chegou nada (sinal caído).
    fecharJanela() {
      if (!janela.length) return null
      const n = janela.length
      const media = (fn) => janela.reduce((s, j) => s + fn(j), 0) / n
      const eixo = variancia.indexOf(Math.max(...variancia))
      const pico = (fn) => janela.reduce((m, j) => Math.max(m, Math.abs(fn(j))), 0)
      const cheioVel = modo === 'batida' ? AJUSTE.velocidadeBatida : AJUSTE.velocidadeCheia
      const giro = pico((j) => Math.hypot(...j.lento)) / AJUSTE.giroCheio
      const giroSinal = media((j) => j.lento[eixo]) / AJUSTE.giroCheio
      const vel = media((j) => j.velocidade) / cheioVel
      const velAbs = pico((j) => j.velocidade) / cheioVel
      const wz = media((j) => j.wz) / AJUSTE.giroVerticalCheio
      const wzAbs = pico((j) => j.wz) / AJUSTE.giroVerticalCheio
      const tremor = media((j) => j.tremido) / AJUSTE.tremorCheio
      janela = []
      let tamanho
      let oscilacao
      if (modo === 'giro') [tamanho, oscilacao] = [giro, giroSinal]
      else if (modo === 'vertical' || modo === 'batida') [tamanho, oscilacao] = [velAbs, vel]
      else if (modo === 'giroVertical') [tamanho, oscilacao] = [wzAbs, wz]
      else [tamanho, oscilacao] = velAbs > giro ? [velAbs, vel] : [giro, giroSinal]
      envelope = Math.max(tamanho, envelope * AJUSTE.esquecimento)
      const lim = (v) => Math.max(0, Math.min(100, v * 100))
      return { tamanho: lim(envelope), oscilacao: Math.max(-1, Math.min(1, oscilacao)), tremor: lim(tremor) }
    },
  }
}
const processador = criarProcessador()
export const fecharJanela = () => processador.fecharJanela()
export const ultimo = () => ultimoPacote

// Para testes (tools/testar-zeni.mjs): injeta um pacote cru como se tivesse chegado pelo Bluetooth.
export const receberPacote = (dv) => aoNotificarDados({ target: { value: dv } })
