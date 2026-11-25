// Pedir ajuda ao ZENI (fluxo-do-app.md, bloco 7, decisão 7): interpretação SIMULADA de poucos pedidos por
// palavra-chave. A IA só mexe em aparência, lembretes e tom. Dados de saúde só à mão.
// Cada pedido entendido devolve { resumo, previa, confirmar }:
//   previa()    mostra a mudança na própria tela (7.4) e devolve a função que desfaz;
//   confirmar() guarda a mudança (7.5).
import { TAMANHOS, aplicarTamanho, tamanhoSalvo } from './aparencia.js'
import { descreverDias, guardarLembretes, lerLembretes } from './lembretes.js'
import { CHAVES, guardar, ler } from './storage.js'

export const EXEMPLOS = ['texto maior', 'tom mais discreto', 'lembrete às 8 horas']

const limpar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const salvarAjuste = (chave, valor) => guardar(CHAVES.ajustes, { ...ler(CHAVES.ajustes, {}), [chave]: valor })

export const tomSalvo = () => ler(CHAVES.ajustes, {}).tom ?? 'discreto'

export const EXEMPLO_DE_TOM = {
  animado: 'Que bom! Você foi muito bem hoje!',
  discreto: 'Bom trabalho hoje.',
}

// Devolve um pedido entendido, { saude: true } para dados de saúde, ou null se não entendeu (7.3)
export function interpretar(texto) {
  const t = limpar(texto)

  if (/saude|dados/.test(t)) return { saude: true }

  // Aparência: tamanho do texto
  if (/texto|letra|fonte/.test(t)) {
    const novo = /menor|normal|diminu|pequen/.test(t) ? 'normal' : /maior|grande|aument/.test(t) ? (/muito/.test(t) ? 'maior' : 'grande') : null
    if (novo) {
      const nome = TAMANHOS.find((x) => x.id === novo).nome
      return {
        resumo: `Vou deixar o texto ${nome.toLowerCase()}.`,
        previa: () => {
          const antes = tamanhoSalvo()
          aplicarTamanho(novo)
          return () => aplicarTamanho(antes)
        },
        confirmar: () => salvarAjuste('tamanhoTexto', novo),
      }
    }
  }

  // Tom das mensagens
  if (/tom|animad|alegre|discret|calm/.test(t)) {
    const novo = /animad|alegre/.test(t) ? 'animado' : /discret|calm/.test(t) ? 'discreto' : null
    if (novo) {
      return {
        resumo: `Vou deixar o tom ${novo}. Exemplo: "${EXEMPLO_DE_TOM[novo]}"`,
        previa: () => () => {},
        confirmar: () => salvarAjuste('tom', novo),
      }
    }
  }

  // Lembretes: "lembrete às 8", "lembrar 7:30", "lembrete 18h"
  if (/lembr/.test(t)) {
    const m = t.match(/(\d{1,2})\s*(?:h|:|horas?)?\s*(\d{2})?/)
    const hora = m ? Number(m[1]) : NaN
    const minuto = m && m[2] ? Number(m[2]) : 0
    if (hora >= 0 && hora <= 23 && minuto <= 59) {
      const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
      const dias = [0, 1, 2, 3, 4, 5, 6]
      return {
        resumo: `Vou criar um lembrete: ${horario}, ${descreverDias(dias).toLowerCase()}.`,
        previa: () => () => {},
        confirmar: () => guardarLembretes([...lerLembretes(), { id: Date.now(), dias, hora: horario }]),
      }
    }
  }

  return null
}
