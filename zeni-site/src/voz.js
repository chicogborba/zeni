// Voz na v1 (decisão 5 de 25/11): quatro comandos, só durante o exercício: "pausar", "continuar", "terminar" e
// "repetir". Os botões continuam sempre na tela como alternativa. Usa a Web Speech API. Sem suporte, sem microfone ou
// sem permissão, nada acontece (fallback silencioso): os botões seguem valendo. `ouvindo` diz quando o microfone está
// ligado, para a tela mostrar um indicador.
// TODO (fluxo-do-app.md, decisão 20): falta a tela curta de explicação antes do primeiro pedido de microfone.
import { useEffect, useRef, useState } from 'react'

// Lido na hora de usar (não só ao carregar o arquivo), para os testes poderem simular o reconhecimento
const obterReconhecimento = () => (typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null)

export const vozDisponivel = () => Boolean(obterReconhecimento())

const PALAVRAS = ['pausar', 'continuar', 'terminar', 'repetir']
const INTERVALO_MS = 1500 // depois de um comando, ignora repetições do que acabou de ser ouvido

const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// `comandos`: { pausar, continuar, terminar, repetir }, cada um uma função ou undefined (comando que não vale agora).
export function useComandosDeVoz(ativo, comandos) {
  const comandosRef = useRef(comandos)
  const [ouvindo, setOuvindo] = useState(false)
  useEffect(() => {
    comandosRef.current = comandos
  })

  useEffect(() => {
    const Reconhecimento = obterReconhecimento()
    if (!ativo || !Reconhecimento) return undefined
    let rodando = true
    let ultimo = 0
    const rec = new Reconhecimento()
    rec.lang = 'pt-BR'
    rec.continuous = true
    rec.interimResults = true
    rec.onstart = () => setOuvindo(true)
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const texto = semAcento(e.results[i][0].transcript)
        const dito = PALAVRAS.find((p) => comandosRef.current[p] && new RegExp(`\\b${p}\\b`).test(texto))
        if (dito && Date.now() - ultimo > INTERVALO_MS) {
          ultimo = Date.now()
          comandosRef.current[dito]()
          rec.abort() // limpa o que foi ouvido; o onend religa o microfone
          return
        }
      }
    }
    rec.onend = () => {
      setOuvindo(false)
      if (!rodando) return
      try {
        rec.start()
      } catch {
        // já estava ouvindo
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') rodando = false // sem permissão: fica em silêncio
    }
    try {
      rec.start()
    } catch {
      // não foi possível ouvir agora
    }
    return () => {
      rodando = false
      rec.abort()
      setOuvindo(false)
    }
  }, [ativo])

  return { ouvindo: ativo && ouvindo }
}
