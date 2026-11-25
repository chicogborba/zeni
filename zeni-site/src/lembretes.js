// Lembretes (fluxo-do-app.md, bloco 6): dias da semana e horário do exercício, guardados em ajustes.
// Na v1 só avisam com o app aberto (CLAUDE.md; fluxo-do-app.md, ponto em aberto 4 e "Versão 2").
import { CHAVES, guardar, ler } from './storage.js'

export const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const lerLembretes = () => ler(CHAVES.ajustes, {}).lembretes ?? []

export function guardarLembretes(lista) {
  guardar(CHAVES.ajustes, { ...ler(CHAVES.ajustes, {}), lembretes: lista })
}

export const descreverDias = (dias) =>
  dias.length === 7 ? 'Todos os dias' : [...dias].sort().map((d) => DIAS[d]).join(', ')

// Verdadeiro se algum lembrete é para este exato minuto
export function lembreteDeAgora(lista, agora = new Date()) {
  const hora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
  return lista.find((l) => l.hora === hora && l.dias.includes(agora.getDay())) ?? null
}
