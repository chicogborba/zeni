// Segue: fluxo-do-app.md, bloco 3 "Avaliação" (3.1 a 3.7).
// 3.1 avalia tamanho, suavidade e ritmo; 3.2 nota de 0 a 100; 3.3 cansaço?
// 3.4 mantém ou aumenta a meta (não) | 3.5 sugere pausa ou exercício mais leve (sim)
// 3.6 mostra a nota e um resumo simples com incentivo (etiqueta IA); 3.7 volta à Tela inicial.
// TODO (design system, pendência 7 / fluxo-do-app.md, ponto em aberto 6): a nota de 0 a 100 pode soar como prova.
// O tom da mensagem (animado ou discreto) vem de ajustes.tom, que hoje só muda por "Pedir ajuda ao ZENI".
// TODO: falta o item Tom em Personalizar.
// TODO: exercício com menos de 5 s de movimento não recebe nota nem entra no histórico. Falta decidir.
import { useEffect, useRef, useState } from 'react'
import { AMOSTRAS_MINIMAS, avaliar, palavra } from '../avaliacao.js'
import Botao from '../componentes/Botao.jsx'
import EtiquetaIA from '../componentes/EtiquetaIA.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { EXEMPLO_DE_TOM, tomSalvo } from '../pedidos.js'
import { CHAVES, guardar, ler } from '../storage.js'

const META_INICIAL = 60 // meta provisória do "tamanho do movimento", de 0 a 100

// Seção 8: a nota aparece por contagem rápida de 600 ms ("reduzir movimento": direto)
function useContagem(alvo) {
  const [valor, setValor] = useState(0)
  useEffect(() => {
    if (alvo === null) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setValor(alvo))
      return () => cancelAnimationFrame(id)
    }
    const inicio = performance.now()
    let id
    const passo = (agora) => {
      const t = Math.min(1, (agora - inicio) / 600)
      setValor(Math.round(alvo * t))
      if (t < 1) id = requestAnimationFrame(passo)
    }
    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
  }, [alvo])
  return valor
}

export default function Avaliacao({ resumo }) {
  const { voltarAoInicio } = useNavegacao()
  const curto = !resumo || resumo.amostras.length < AMOSTRAS_MINIMAS

  const [resultado] = useState(() => {
    if (curto) return null
    const meta = ler(CHAVES.ajustes, {}).metaTamanho ?? META_INICIAL
    return avaliar(resumo, meta)
  })
  const salvo = useRef(false)

  // Guarda no aparelho (simula o servidor) e atualiza a meta
  useEffect(() => {
    if (!resultado || salvo.current) return
    salvo.current = true
    guardar(CHAVES.historico, [
      ...ler(CHAVES.historico, []),
      {
        quando: new Date().toISOString(),
        exercicio: resumo.exercicio,
        duracaoSeg: resumo.duracaoSeg,
        pausas: resumo.pausas,
        terminouAntes: resumo.terminouAntes,
        ritmoSeg: resumo.ritmoSeg,
        nota: resultado.nota,
        tamanho: resultado.tamanho,
        suavidade: resultado.suavidade,
        ritmo: resultado.ritmo,
        cansaco: resultado.cansaco,
      },
    ])
    guardar(CHAVES.ajustes, { ...ler(CHAVES.ajustes, {}), metaTamanho: resultado.meta })
  }, [resultado, resumo])

  const nota = useContagem(resultado ? resultado.nota : null)

  const rodape = (
    <Botao variante="principal" onClick={voltarAoInicio}>
      Voltar ao início
    </Botao>
  )

  if (curto) {
    return (
      <PainelInferior titulo="Exercício curto" rodape={rodape}>
        <h2 className="conectar-titulo">Foi um exercício curto</h2>
        <p className="conectar-texto">Ainda não deu para ver o seu movimento. Quando quiser, tente de novo.</p>
      </PainelInferior>
    )
  }

  return (
    <PainelInferior titulo="Como foi" rodape={rodape}>
      <p className="parq-contador">Sua nota</p>
      <p className="conectar-numero" aria-label={`Sua nota: ${resultado.nota} de 100`}>
        {nota}
      </p>
      <p className="conectar-destaque">{EXEMPLO_DE_TOM[tomSalvo()]}</p>
      <EtiquetaIA>
        {`Tamanho do movimento: ${palavra(resultado.tamanho)}. Suavidade: ${palavra(resultado.suavidade)}. Ritmo: ${palavra(resultado.ritmo)}.`}
      </EtiquetaIA>
      {resultado.cansaco ? (
        <EtiquetaIA>Você mostrou cansaço. Que tal descansar? O próximo exercício será mais leve.</EtiquetaIA>
      ) : (
        <EtiquetaIA>
          {resultado.aumentou
            ? 'O app aumentou a sua meta um pouquinho, porque o exercício foi bem.'
            : 'O app manteve a sua meta, para você ir no seu tempo.'}
        </EtiquetaIA>
      )}
    </PainelInferior>
  )
}
