// Segue: fluxo-do-app.md, bloco 3 "Avaliação" (3.1 a 3.7) e decisões 2 e 6 de 25/11.
// A nota só aparece depois do terceiro exercício da série, em modal centralizado: número grande, o microtexto
// "sua nota" e uma descrição curta de tamanho do movimento, suavidade e ritmo. Um botão leva direto a Minha evolução.
// A nota fica gravada na evolução (histórico no aparelho). 3.4/3.5: mantém ou aumenta a meta; cansaço sugere descanso.
// TODO (design system, pendência 7 / fluxo-do-app.md, ponto em aberto 6): a nota de 0 a 100 pode soar como prova.
// O tom da mensagem (animado ou discreto) vem de ajustes.tom. TODO: falta o item Tom em Personalizar.
import { useEffect, useRef, useState } from 'react'
import { AMOSTRAS_MINIMAS, avaliarSerie, palavra } from '../avaliacao.js'
import Botao from '../componentes/Botao.jsx'
import EtiquetaIA from '../componentes/EtiquetaIA.jsx'
import ModalCentral from '../componentes/ModalCentral.jsx'
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

const SEM_EXERCICIOS = []

export default function Avaliacao({ resumo }) {
  const { ir, voltarAoInicio } = useNavegacao()
  const exercicios = resumo?.exercicios ?? SEM_EXERCICIOS
  const curto = exercicios.length === 0 || exercicios.some((e) => e.amostras.length < AMOSTRAS_MINIMAS)

  const [resultado] = useState(() => {
    if (curto) return null
    const meta = ler(CHAVES.ajustes, {}).metaTamanho ?? META_INICIAL
    return avaliarSerie(exercicios, meta)
  })
  const salvo = useRef(false)

  // Guarda a nota da série no aparelho (simula o servidor), na evolução, e atualiza a meta
  useEffect(() => {
    if (!resultado || salvo.current) return
    salvo.current = true
    guardar(CHAVES.historico, [
      ...ler(CHAVES.historico, []),
      {
        quando: new Date().toISOString(),
        serie: exercicios.map((e) => e.exercicio),
        exercicio: exercicios.map((e) => e.exercicio).join(''),
        duracaoSeg: exercicios.reduce((s, e) => s + e.duracaoSeg, 0),
        pausas: exercicios.reduce((s, e) => s + e.pausas, 0),
        ritmoSeg: resumo.ritmoSeg,
        nota: resultado.nota,
        tamanho: resultado.tamanho,
        suavidade: resultado.suavidade,
        ritmo: resultado.ritmo,
        cansaco: resultado.cansaco,
      },
    ])
    guardar(CHAVES.ajustes, { ...ler(CHAVES.ajustes, {}), metaTamanho: resultado.meta })
  }, [resultado, resumo, exercicios])

  const nota = useContagem(resultado ? resultado.nota : null)

  if (curto) {
    return (
      <ModalCentral titulo="Exercício curto" onFechar={voltarAoInicio}>
        <h2 className="conectar-titulo">Foi um exercício curto</h2>
        <p className="conectar-texto">Ainda não deu para ver o seu movimento. Quando quiser, tente de novo.</p>
        <Botao variante="principal" onClick={voltarAoInicio}>
          Voltar ao início
        </Botao>
      </ModalCentral>
    )
  }

  return (
    <ModalCentral titulo="Sua nota" onFechar={voltarAoInicio}>
      <p className="modal-numero" aria-label={`Sua nota: ${resultado.nota} de 100`}>
        {nota}
      </p>
      <p className="modal-micro">sua nota</p>
      <p className="modal-texto">
        {`Tamanho do movimento: ${palavra(resultado.tamanho)}. Suavidade: ${palavra(resultado.suavidade)}. Ritmo: ${palavra(resultado.ritmo)}.`}
      </p>
      <p className="conectar-destaque">{EXEMPLO_DE_TOM[tomSalvo()]}</p>
      <EtiquetaIA>
        {resultado.cansaco
          ? 'Você mostrou cansaço. Que tal descansar um pouco?'
          : resultado.aumentou
            ? 'O app aumentou a sua meta um pouquinho, porque o exercício foi bem.'
            : 'O app manteve a sua meta, para você ir no seu tempo.'}
      </EtiquetaIA>
      <Botao variante="principal" onClick={() => ir('evolucao')}>
        Ver minha evolução
      </Botao>
    </ModalCentral>
  )
}
