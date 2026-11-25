// Segue: fluxo-do-app.md, bloco 4 "Acompanhamento" (4.1 a 4.4) e design-system.md 6.5 (gráficos).
// 4.1 escolher 7 ou 30 dias -> 4.2 ver o gráfico -> 4.3 salvar em PDF ou enviar link -> 4.4 volta à Tela inicial.
// Uma série por vez: a nota de cada exercício (linha de 3 px em cinza-900, área em amarelo-200, rótulos de 16 px).
// TODO (fluxo-do-app.md, ponto em aberto 5 / design system, pendência 10): "Enviar link" não existe na v1 (sem
//   backend; falta definir para quem vai e a privacidade) e o layout do PDF está em aberto. O PDF hoje é a
//   impressão da própria tela, pelo navegador ("Salvar como PDF").
import { useState } from 'react'
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { CHAVES, ler } from '../storage.js'

const DIA_MS = 24 * 60 * 60 * 1000

// Medidas do desenho (coordenadas do SVG, que escala com a largura do painel)
const L = 342
const A = 200
const ESQ = 32 // espaço para o rótulo do eixo
const TOPO = 12
const BASE = A - 28 // espaço embaixo para os rótulos de data

function Grafico({ pontos, dias, agora }) {
  const x = (quando) => ESQ + ((quando - (agora - dias * DIA_MS)) / (dias * DIA_MS)) * (L - ESQ - 8)
  const y = (nota) => BASE - (nota / 100) * (BASE - TOPO)
  const xy = pontos.map((p) => [x(p.quando), y(p.nota)])
  const linha = xy.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
  const area = xy.length > 1 ? `${linha} L${xy.at(-1)[0].toFixed(1)} ${BASE} L${xy[0][0].toFixed(1)} ${BASE} Z` : null

  return (
    <svg
      className="grafico"
      viewBox={`0 0 ${L} ${A}`}
      role="img"
      aria-label={`Gráfico da nota dos exercícios nos últimos ${dias} dias`}
    >
      <line className="grafico-eixo" x1={ESQ} y1={BASE} x2={L - 8} y2={BASE} />
      <line className="grafico-eixo" x1={ESQ} y1={TOPO} x2={ESQ} y2={BASE} />
      <text className="grafico-rotulo" x={ESQ - 6} y={TOPO + 5} textAnchor="end">100</text>
      <text className="grafico-rotulo" x={ESQ - 6} y={BASE} textAnchor="end">0</text>
      <text className="grafico-rotulo" x={ESQ} y={A - 4} textAnchor="start">{`há ${dias} dias`}</text>
      <text className="grafico-rotulo" x={L - 8} y={A - 4} textAnchor="end">hoje</text>
      {area && <path className="grafico-area" d={area} />}
      <path className="grafico-linha" d={linha} />
      {xy.map(([px, py], i) => (
        <circle key={i} className="grafico-ponto" cx={px} cy={py} r="4" />
      ))}
    </svg>
  )
}

export default function Evolucao() {
  const { voltarAoInicio } = useNavegacao()
  const [dias, setDias] = useState(null) // null = escolhendo o período
  const [agora] = useState(() => Date.now())

  // 4.1: escolher 7 ou 30 dias
  if (dias === null) {
    return (
      <PainelInferior
        titulo="Minha evolução"
        rodape={
          <>
            <Botao variante="principal" onClick={() => setDias(7)}>
              7 dias
            </Botao>
            <Botao variante="principal" onClick={() => setDias(30)}>
              30 dias
            </Botao>
            <Botao variante="voltar" onClick={voltarAoInicio}>
              Voltar
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">Minha evolução</h2>
        <p className="conectar-texto">Quantos dias você quer ver?</p>
      </PainelInferior>
    )
  }

  const desde = agora - dias * DIA_MS
  const pontos = ler(CHAVES.historico, [])
    .map((h) => ({ quando: new Date(h.quando).getTime(), nota: h.nota }))
    .filter((p) => p.quando >= desde && Number.isFinite(p.nota))
    .sort((a, b) => a.quando - b.quando)
  const media = pontos.length ? Math.round(pontos.reduce((s, p) => s + p.nota, 0) / pontos.length) : null

  // 4.2 e 4.3: gráfico, e salvar em PDF ou enviar link
  return (
    <PainelInferior
      titulo={`Evolução em ${dias} dias`}
      rodape={
        <>
          <Botao variante="principal" onClick={() => window.print()}>
            Salvar em PDF
          </Botao>
          <Botao variante="vazado" desativado motivo="O envio por link ainda não está disponível.">
            Enviar link
          </Botao>
          <Botao variante="voltar" onClick={() => setDias(null)}>
            Voltar
          </Botao>
        </>
      }
    >
      <h2 className="conectar-titulo">Últimos {dias} dias</h2>
      {pontos.length === 0 ? (
        <p className="conectar-texto">Ainda não há exercícios nesse período. Faça um exercício para ver a sua evolução.</p>
      ) : (
        <>
          <Grafico pontos={pontos} dias={dias} agora={agora} />
          <p className="conectar-destaque">Nota de cada exercício</p>
          <p className="conectar-texto">
            {pontos.length} {pontos.length === 1 ? 'exercício' : 'exercícios'}. Nota média: {media}.
          </p>
        </>
      )}
    </PainelInferior>
  )
}
