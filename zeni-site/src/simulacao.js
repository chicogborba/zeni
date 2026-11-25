// Simulação do ZENI (dispositivo) na v1: o sinal é gerado pelo app (CLAUDE.md, escopo da v1).
// Para a demonstração, no console do navegador:
//   zeniSimular.perderSinal()     -> o ZENI "perde o sinal" (o exercício entra em reconexão)
//   zeniSimular.recuperarSinal()  -> o sinal "volta"
//   zeniSimular.preencherHistorico() -> cria 12 exercícios de exemplo nos últimos 30 dias (para ver a evolução)
//   zeniSimular.limparHistorico()    -> apaga o histórico
//   zeniSimular.bateriaFraca()       -> o ZENI avisa que a bateria está acabando (durante o exercício)
//   zeniSimular.muitaDificuldade()   -> o movimento fica bem pequeno e o app pausa o exercício sozinho
//   zeniSimular.lembrarAgora()       -> mostra o aviso de lembrete agora (o horário só muda de 30 em 30 min)
// Bluetooth real fica para depois.
import { CHAVES, apagar, guardar } from './storage.js'

let sinal = true
const ouvintes = new Set()

export const sinalOk = () => sinal

function definirSinal(valor) {
  sinal = valor
  ouvintes.forEach((f) => f(valor))
}

// Bateria fraca: aviso avulso, o exercício continua
const ouvintesBateria = new Set()
export function aoBateriaFraca(f) {
  ouvintesBateria.add(f)
  return () => ouvintesBateria.delete(f)
}

// Muita dificuldade: enquanto ligada, os dados de movimento gerados ficam bem pequenos
let dificuldade = false
export const emDificuldade = () => dificuldade
export const aliviarDificuldade = () => {
  dificuldade = false
}

export function aoMudarSinal(f) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

if (typeof window !== 'undefined') {
  window.zeniSimular = {
    perderSinal: () => definirSinal(false),
    recuperarSinal: () => definirSinal(true),
    bateriaFraca: () => ouvintesBateria.forEach((f) => f()),
    muitaDificuldade: () => {
      dificuldade = true
    },
    preencherHistorico: () => {
      const dia = 24 * 60 * 60 * 1000
      const exemplos = Array.from({ length: 12 }, (_, i) => {
        const nota = Math.round(52 + i * 2.5 + Math.random() * 10)
        return {
          quando: new Date(Date.now() - (11 - i) * 2.4 * dia).toISOString(),
          exercicio: 'subir-descer',
          duracaoSeg: 30,
          pausas: 0,
          terminouAntes: false,
          ritmoSeg: 1.6,
          nota,
          tamanho: nota,
          suavidade: Math.round(nota - 5 + Math.random() * 10),
          ritmo: Math.round(nota - 5 + Math.random() * 10),
          cansaco: false,
        }
      })
      guardar(CHAVES.historico, exemplos)
    },
    limparHistorico: () => apagar(CHAVES.historico),
    lembrarAgora: () => window.dispatchEvent(new Event('zeni:lembrete')),
  }
}
