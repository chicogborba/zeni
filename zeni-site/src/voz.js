// Voz na v1: um único comando, "pausar", só durante o exercício (fluxo-do-app.md, decisão 6).
// O botão Pausar continua sempre na tela como alternativa. Usa a Web Speech API; sem suporte, nada acontece.
// TODO (fluxo-do-app.md, ponto em aberto 3): o microfone não tem passo de permissão no fluxograma.
import { useEffect, useRef } from 'react'

const Reconhecimento = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const vozDisponivel = Boolean(Reconhecimento)

const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function useComandoPausar(ativo, aoPausar) {
  const aoPausarRef = useRef(aoPausar)
  useEffect(() => {
    aoPausarRef.current = aoPausar
  })

  useEffect(() => {
    if (!ativo || !Reconhecimento) return undefined
    let rodando = true
    const rec = new Reconhecimento()
    rec.lang = 'pt-BR'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (semAcento(e.results[i][0].transcript).includes('pausar')) {
          aoPausarRef.current()
          return
        }
      }
    }
    rec.onend = () => {
      if (!rodando) return
      try {
        rec.start()
      } catch {
        // já estava ouvindo
      }
    }
    rec.onerror = () => {} // sem microfone ou sem permissão: o botão Pausar segue valendo
    try {
      rec.start()
    } catch {
      // não foi possível ouvir agora
    }
    return () => {
      rodando = false
      rec.abort()
    }
  }, [ativo])
}
