// Segue: fluxo-do-app.md, bloco 2 "Exercícios" (2.1 a 2.9), decisões 2, 5 e 6, e design-system.md 6.9, 6.10 e 6.11.
// O ZENI e a IA são simulados por regras simples (CLAUDE.md, escopo da v1). Sem música (decisão 1).
// Estados: preparando -> sugestao (2.1) -> posicao (2.2) -> andamento (2.4 a 2.7)
//          -> pausado (2.8a) | reconectando -> perguntando -> fim (2.9) -> Avaliação (etapa 5).
// Casos de erro (tabela do fluxo): perda de sinal (reconexão, acima), bateria fraca (aviso discreto no topo,
// o exercício continua) e muita dificuldade (pausa sozinho, mesma tela de Pausado, com o aviso urgente).
// TODO (fluxo-do-app.md, ponto em aberto 1): se a pessoa escolher "Voltar ao início" após a falha de
//   reconexão, o exercício parcial hoje é descartado (nada é guardado). Falta decidir.
// TODO: os exercícios abaixo (nomes, instruções e duração) são provisórios; os documentos não os definem.
import { useEffect, useRef, useState } from 'react'
import Aviso from '../componentes/Aviso.jsx'
import Botao from '../componentes/Botao.jsx'
import EtiquetaIA from '../componentes/EtiquetaIA.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import TelaEspera from '../componentes/TelaEspera.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { aliviarDificuldade, aoBateriaFraca, aoMudarSinal, emDificuldade } from '../simulacao.js'
import { CHAVES, ler } from '../storage.js'
import { useComandoPausar } from '../voz.js'

const DURACAO_S = 30 // duração provisória do exercício
const RITMO_PADRAO_S = 1.6 // segundos por movimento, sem histórico (2.1a)
const TENTATIVA_MS = 10000 // 10 s por tentativa de reconexão (decisão 2; ajustável com o hardware real)
const TENTATIVAS = 2
const DESFAZER_MS = 8000 // "Desfazer" por 8 segundos (design system, seção 7)
const BATERIA_MS = 10000 // quanto tempo o aviso discreto de bateria fica no topo
const JANELA_DIFICULDADE = 8 // últimas 8 amostras (2 s)
const LIMITE_DIFICULDADE = 25 // média abaixo disto = movimento muito pequeno

const EXERCICIOS = [
  { id: 'subir-descer', nome: 'Subir e descer devagar', como: 'Levante o ZENI um pouco e abaixe, sem pressa.' },
  { id: 'circulos', nome: 'Círculos pequenos', como: 'Desenhe círculos pequenos no ar, no ritmo do guia.' },
  { id: 'lado-a-lado', nome: 'Balançar de lado a lado', como: 'Leve o ZENI para um lado e para o outro, com calma.' },
]

// 2.1 e 2.1a: regras simples no lugar da IA. Sem histórico, começa pelo mais leve.
function sugerir(historico) {
  const ultimo = historico.at(-1)
  if (!ultimo) return { exercicio: EXERCICIOS[0], motivo: 'É o seu primeiro exercício. O app escolheu um começo tranquilo.' }
  if (ultimo.cansaco) return { exercicio: EXERCICIOS[0], motivo: 'O último exercício cansou você. O app escolheu um mais leve.' }
  return {
    exercicio: EXERCICIOS[historico.length % EXERCICIOS.length],
    motivo: 'O app escolheu este a partir do seu ritmo habitual.',
  }
}

function ritmoHabitual(historico) {
  const recentes = historico.slice(-5).map((h) => h.ritmoSeg).filter(Number.isFinite)
  return recentes.length ? recentes.reduce((a, b) => a + b, 0) / recentes.length : RITMO_PADRAO_S
}

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Exercicio() {
  const { ir, voltarAoInicio } = useNavegacao()
  const [historico] = useState(() => ler(CHAVES.historico, []))
  const [sugestao] = useState(() => sugerir(historico))
  const [ritmoSeg] = useState(() => ritmoHabitual(historico))

  const [estado, setEstado] = useState('preparando')
  const [tentativaBusca, setTentativaBusca] = useState(0)
  const [restam, setRestam] = useState(DURACAO_S)
  const [tamanho, setTamanho] = useState(0) // 0 a 100: o "tamanho do movimento" simulado
  const [tentativa, setTentativa] = useState(1)
  const [desfazer, setDesfazer] = useState(false)
  const [motivoPausa, setMotivoPausa] = useState('pessoa') // 'pessoa' | 'dificuldade'
  const [bateria, setBateria] = useState(false)
  const restamRef = useRef(DURACAO_S)
  const desdeAmostra = useRef(0) // a detecção de dificuldade só olha amostras depois da última pausa automática
  const dados = useRef({ amostras: [], pausas: 0, terminouAntes: false })

  const pausar = () => {
    dados.current.pausas += 1
    setMotivoPausa('pessoa')
    setEstado('pausado')
  }
  useComandoPausar(estado === 'andamento', pausar)

  // Preparando: espera simulada
  useEffect(() => {
    if (estado !== 'preparando') return undefined
    const id = setTimeout(() => setEstado('sugestao'), 2500)
    return () => clearTimeout(id)
  }, [estado, tentativaBusca])

  // 2.4 a 2.7: o ciclo do exercício. Dados de movimento gerados pelo app.
  useEffect(() => {
    if (estado !== 'andamento') return undefined
    const t0 = Date.now()
    const dado = setInterval(() => {
      const t = (Date.now() - t0) / 1000
      const valor = emDificuldade()
        ? 8 + Math.random() * 10 // movimento muito pequeno (simulado)
        : 55 + 25 * Math.sin((2 * Math.PI * t) / ritmoSeg) + Math.random() * 8
      const limitado = Math.max(0, Math.min(100, valor))
      setTamanho(limitado)
      const amostras = dados.current.amostras
      amostras.push(Math.round(limitado))

      // 2.5: o app percebe muita dificuldade e pausa sozinho (estado Pausado, 2.8a)
      const recentes = amostras.slice(Math.max(desdeAmostra.current, amostras.length - JANELA_DIFICULDADE))
      if (recentes.length === JANELA_DIFICULDADE && recentes.reduce((a, b) => a + b, 0) / JANELA_DIFICULDADE < LIMITE_DIFICULDADE) {
        desdeAmostra.current = amostras.length
        aliviarDificuldade()
        dados.current.pausas += 1
        setMotivoPausa('dificuldade')
        setEstado('pausado')
      }
    }, 250)
    const relogio = setInterval(() => {
      restamRef.current -= 1
      setRestam(restamRef.current)
      if (restamRef.current <= 0) setEstado('fim') // 2.7: o exercício acabou
    }, 1000)
    return () => {
      clearInterval(dado)
      clearInterval(relogio)
    }
  }, [estado, ritmoSeg])

  // 2.4: o sinal do ZENI cai e volta (simulado, ver src/simulacao.js)
  useEffect(
    () =>
      aoMudarSinal((ok) => {
        if (!ok) setEstado((e) => (e === 'andamento' ? 'reconectando' : e))
        else {
          setEstado((e) => (e === 'reconectando' ? 'andamento' : e))
          setTentativa(1)
        }
      }),
    [],
  )

  // Bateria fraca (2.4): aviso discreto no topo; o exercício continua
  useEffect(() => aoBateriaFraca(() => setBateria(true)), [])
  useEffect(() => {
    if (!bateria) return undefined
    const id = setTimeout(() => setBateria(false), BATERIA_MS)
    return () => clearTimeout(id)
  }, [bateria])

  // Reconexão: duas tentativas de 10 s, depois pergunta (decisão 2)
  useEffect(() => {
    if (estado !== 'reconectando') return undefined
    const id = setTimeout(() => {
      if (tentativa < TENTATIVAS) setTentativa(tentativa + 1)
      else setEstado('perguntando')
    }, TENTATIVA_MS)
    return () => clearTimeout(id)
  }, [estado, tentativa])

  // "Desfazer" do Terminar: some sozinho depois de 8 s
  useEffect(() => {
    if (!desfazer) return undefined
    const id = setTimeout(() => setDesfazer(false), DESFAZER_MS)
    return () => clearTimeout(id)
  }, [desfazer])

  const terminar = () => {
    dados.current.terminouAntes = true
    setDesfazer(true)
    setEstado('fim')
  }

  const verComoFoi = () =>
    ir('avaliacao', {
      resumo: {
        duracaoSeg: DURACAO_S - restam,
        amostras: dados.current.amostras,
        pausas: dados.current.pausas,
        terminouAntes: dados.current.terminouAntes,
        ritmoSeg,
        exercicio: sugestao.exercicio.id,
      },
    })

  if (estado === 'preparando') {
    return (
      <TelaEspera
        key={tentativaBusca}
        texto="Preparando o seu exercício de hoje"
        onTentarDeNovo={() => setTentativaBusca((t) => t + 1)}
        onVoltar={voltarAoInicio}
      />
    )
  }

  // 2.1: exercício do dia sugerido pelo app
  if (estado === 'sugestao') {
    return (
      <PainelInferior
        titulo="Exercício de hoje"
        rodape={
          <>
            <Botao variante="principal" onClick={() => setEstado('posicao')}>
              Ver como fazer
            </Botao>
            <Botao variante="secundario" onClick={voltarAoInicio}>
              Voltar
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">Exercício de hoje</h2>
        <p className="parq-pergunta">{sugestao.exercicio.nome}</p>
        <EtiquetaIA>{sugestao.motivo}</EtiquetaIA>
      </PainelInferior>
    )
  }

  // 2.2 e 2.3: como segurar e se posicionar, e Começar
  if (estado === 'posicao') {
    return (
      <PainelInferior
        titulo="Como fazer"
        rodape={
          <>
            <Botao variante="principal" onClick={() => setEstado('andamento')}>
              Começar
            </Botao>
            <Botao variante="secundario" onClick={() => setEstado('sugestao')}>
              Voltar
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">Como fazer</h2>
        <p className="conectar-destaque">Sente-se com as costas apoiadas.</p>
        <p className="conectar-destaque">Segure o ZENI com a mão que for mais confortável.</p>
        <p className="conectar-destaque">{sugestao.exercicio.como}</p>
      </PainelInferior>
    )
  }

  // 6.11: reconectando, sem botões
  if (estado === 'reconectando') {
    return (
      <PainelInferior titulo="Reconectando" alturaTotal onFechar={() => {}}>
        <Aviso nivel="informacao" titulo="Reconectando ao ZENI…">
          Vai levar só um instante.
        </Aviso>
      </PainelInferior>
    )
  }

  // 6.11: duas tentativas falharam; sem limite de tempo
  if (estado === 'perguntando') {
    return (
      <PainelInferior
        titulo="Perdi o sinal do ZENI"
        alturaTotal
        onFechar={() => {}}
        rodape={
          <>
            <Botao
              variante="principal"
              onClick={() => {
                setTentativa(1)
                setEstado('reconectando')
              }}
            >
              Tentar de novo
            </Botao>
            <Botao variante="secundario" onClick={voltarAoInicio}>
              Voltar ao início
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">Perdi o sinal do ZENI. Quer tentar de novo?</h2>
      </PainelInferior>
    )
  }

  // 2.8a / 6.10: pausado, sem tempo limite
  if (estado === 'pausado') {
    return (
      <PainelInferior
        titulo="Exercício pausado"
        alturaTotal
        onFechar={() => {}}
        rodape={
          <>
            <Botao variante="principal" onClick={() => setEstado('andamento')}>
              Continuar
            </Botao>
            <Botao variante="secundario" onClick={terminar}>
              Terminar
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">Exercício pausado</h2>
        {motivoPausa === 'dificuldade' ? (
          <Aviso nivel="urgente" titulo="O exercício foi pausado.">
            Vamos descansar um pouco.
          </Aviso>
        ) : (
          <p className="conectar-texto">Respire um pouco. Continue quando quiser.</p>
        )}
      </PainelInferior>
    )
  }

  // 2.9: fim do exercício. Se a pessoa tocou em Terminar, pode desfazer por 8 s.
  if (estado === 'fim') {
    return (
      <PainelInferior
        titulo="Fim do exercício"
        alturaTotal
        onFechar={() => {}}
        rodape={
          <>
            <Botao variante="principal" onClick={verComoFoi}>
              Ver como foi
            </Botao>
            {desfazer && (
              <Botao
                variante="vazado"
                onClick={() => {
                  dados.current.terminouAntes = false
                  setDesfazer(false)
                  setEstado('pausado')
                }}
              >
                Desfazer
              </Botao>
            )}
          </>
        }
      >
        <h2 className="conectar-titulo">Fim do exercício</h2>
        <p className="conectar-texto">Bom trabalho hoje.</p>
      </PainelInferior>
    )
  }

  // 2.4 a 2.6: em andamento. O botão Pausar fica sempre na tela, na mesma posição.
  return (
    <PainelInferior
      titulo="Exercício em andamento"
      alturaTotal
      onFechar={pausar}
      rodape={
        <Botao variante="secundario" onClick={pausar}>
          Pausar
        </Botao>
      }
    >
      {bateria && (
        <Aviso nivel="atencao" titulo="A bateria do ZENI está acabando.">
          Você pode continuar.
        </Aviso>
      )}
      <p className="conectar-numero" aria-label={`Faltam ${restam} segundos`}>
        {mmss(restam)}
      </p>
      <div className="guia" aria-hidden="true">
        <span className="guia-circulo" style={{ '--guia-ritmo': `${ritmoSeg}s` }} />
      </div>
      <div>
        <p className="conectar-destaque">Tamanho do movimento</p>
        <div className="medidor" role="img" aria-label="Tamanho do movimento">
          <span className="medidor-barra" style={{ width: `${tamanho}%` }} />
        </div>
      </div>
    </PainelInferior>
  )
}
