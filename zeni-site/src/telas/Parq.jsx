// Segue: fluxo-do-app.md, "Decisões do grupo" (3) e docs/triagem-parq.md; design-system.md 6.12.
// Uma pergunta por tela. Sim e Não têm a mesma aparência. Nenhuma resposta bloqueia, avisa ou muda cor.
// Cada resposta guarda: número da pergunta, resposta e data/hora, no aparelho (simula o servidor).
// TODO (fluxo-do-app.md, ponto em aberto 2 / triagem-parq.md, pendências 1, 2 e 3):
//   1. perguntas no texto original, até haver revisão de linguagem por profissional da área;
//   2. o texto de consentimento abaixo é PROVISÓRIO, falta o texto aprovado (LGPD);
//   3. falta decidir a frase fixa para todos ao final (ex.: o ZENI não substitui orientação profissional).
import { useState } from 'react'
import AcoesDuplas from '../componentes/AcoesDuplas.jsx'
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { telaDoExercicio } from '../fluxo.js'
import { useNavegacao } from '../navegacao.jsx'
import { CHAVES, guardar } from '../storage.js'

const PERGUNTAS = [
  'Algum médico já disse que você possui algum problema de coração e que só deveria realizar atividade física se supervisionado por profissionais de saúde?',
  'Você sente dores no peito quando pratica atividade física?',
  'No último mês, você sentiu dores no peito (em atividade física ou em repouso)?',
  'Você apresenta algum desequilíbrio devido à tontura e/ou perda de consciência?',
  'Você possui algum problema ósseo ou articular que poderia piorar com a atividade física?',
  'Atualmente, algum médico está prescrevendo medicamento para pressão arterial ou problema de coração?',
  'Você sabe de qualquer outra razão pela qual não deva praticar atividade física?',
]

export default function Parq() {
  const { ir, voltarAoInicio } = useNavegacao()
  const [passo, setPasso] = useState(0) // 0 = consentimento, 1 a 7 = perguntas
  const [respostas, setRespostas] = useState([])

  if (passo === 0) {
    return (
      <PainelInferior
        titulo="Antes de começar"
        rodape={
          <AcoesDuplas
            voltar={{ rotulo: 'Voltar', onClick: voltarAoInicio }}
            acao={{
              rotulo: 'Concordo',
              onClick: () => {
                guardar(CHAVES.consentimento, { aceito: true, quando: new Date().toISOString() })
                setPasso(1)
              },
            }}
          />
        }
      >
        <h2 className="conectar-titulo">Antes de começar</h2>
        <p className="conectar-texto">São 7 perguntas rápidas sobre a sua saúde.</p>
        <p className="conectar-texto">O ZENI guarda as suas respostas só neste aparelho.</p>
      </PainelInferior>
    )
  }

  const responder = (resposta) => {
    const nova = [
      ...respostas.slice(0, passo - 1),
      { pergunta: passo, resposta, quando: new Date().toISOString() },
    ]
    setRespostas(nova)
    if (passo < PERGUNTAS.length) {
      setPasso(passo + 1)
      return
    }
    guardar(CHAVES.respostasParq, nova)
    ir(telaDoExercicio()) // segue para o próximo passo do primeiro uso
  }

  return (
    <PainelInferior
      titulo={`Pergunta ${passo} de ${PERGUNTAS.length}`}
      rodape={
        <>
          <Botao variante="principal" onClick={() => responder('sim')}>
            Sim
          </Botao>
          <Botao variante="principal" onClick={() => responder('nao')}>
            Não
          </Botao>
          <Botao variante="voltar" onClick={() => setPasso(passo - 1)}>
            Voltar
          </Botao>
        </>
      }
    >
      <p className="parq-contador">
        Pergunta {passo} de {PERGUNTAS.length}
      </p>
      <h2 className="parq-pergunta">{PERGUNTAS[passo - 1]}</h2>
    </PainelInferior>
  )
}
