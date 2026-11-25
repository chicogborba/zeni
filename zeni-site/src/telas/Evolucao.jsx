// Segue: fluxo-do-app.md, bloco 4 "Acompanhamento" e decisões 4, 14 e 18 de 25/11, e design-system.md 6.5 e 6.13.
// Minha evolução abre direto no dashboard: alternador 7 dias / 30 dias no topo, gráfico no meio e, na base,
// Exportar (esquerda, abre as opções) e Voltar (direita, perto do polegar). Volta à Tela inicial.
// Uma série por vez: a nota de cada exercício (linha de 3 px em cinza-900, área em amarelo-200, rótulos de 16 px).
// Salvar em PDF: impressão do navegador. Enviar link: Web Share API com texto-resumo; sem suporte, copia o texto.
// O link real depende do backend (v2). TODO (design system, pendência 10): layout do PDF em aberto.
import { useState } from 'react'
import Botao from '../componentes/Botao.jsx'
import LinhaNavegacao from '../componentes/LinhaNavegacao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import SeletorPeriodo from '../componentes/SeletorPeriodo.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { CHAVES, ler } from '../storage.js'

const DIA_MS = 24 * 60 * 60 * 1000

// Medidas do desenho (coordenadas do SVG, que escala com a largura do painel)
const L = 342
const A = 200
const ESQ = 52 // espaço para o rótulo do eixo ("100" cabe até no maior tamanho de texto)
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

const PERIODOS = [
  { valor: 7, rotulo: '7 dias' },
  { valor: 30, rotulo: '30 dias' },
]

export default function Evolucao() {
  const { voltarAoInicio } = useNavegacao()
  const [dias, setDias] = useState(7)
  const [exportando, setExportando] = useState(false)
  const [aviso, setAviso] = useState('') // "Copiado" quando o envio cai para a cópia do texto
  const [agora] = useState(() => Date.now())

  const desde = agora - dias * DIA_MS
  const pontos = ler(CHAVES.historico, [])
    .map((h) => ({ quando: new Date(h.quando).getTime(), nota: h.nota }))
    .filter((p) => p.quando >= desde && Number.isFinite(p.nota))
    .sort((a, b) => a.quando - b.quando)
  const media = pontos.length ? Math.round(pontos.reduce((s, p) => s + p.nota, 0) / pontos.length) : null

  const resumo =
    pontos.length === 0
      ? `Minha evolução no ZENI, últimos ${dias} dias: ainda sem exercícios nesse período.`
      : `Minha evolução no ZENI, últimos ${dias} dias: ${pontos.length} ${pontos.length === 1 ? 'exercício' : 'exercícios'}, nota média ${media}.`

  // Salvar em PDF: fecha as opções e abre a impressão do navegador (só o dashboard sai na página)
  const salvarPdf = () => {
    setExportando(false)
    setTimeout(() => window.print(), 100)
  }

  // Enviar link: sem backend na v1, compartilha o texto-resumo. Sem Web Share, copia e mostra "Copiado".
  const enviarLink = async () => {
    setAviso('')
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Minha evolução', text: resumo })
      } catch {
        // a pessoa fechou a janela de compartilhar: nada a fazer
      }
      return
    }
    try {
      await navigator.clipboard.writeText(resumo)
      setAviso('Copiado')
    } catch {
      setAviso('Não consegui copiar. Tente de novo.')
    }
  }

  // Exportar: bottom sheet com duas linhas
  if (exportando) {
    return (
      <PainelInferior
        titulo="Exportar"
        onFechar={() => {
          setExportando(false)
          setAviso('')
        }}
        rodape={
          <Botao
            variante="voltar"
            onClick={() => {
              setExportando(false)
              setAviso('')
            }}
          >
            Voltar
          </Botao>
        }
      >
        <h2 className="conectar-titulo">Exportar</h2>
        <div className="linhas">
          <LinhaNavegacao chevron={false} onClick={salvarPdf}>
            Salvar em PDF
          </LinhaNavegacao>
          <LinhaNavegacao chevron={false} onClick={enviarLink}>
            Enviar link
          </LinhaNavegacao>
        </div>
        {aviso && (
          <p className="conectar-destaque" role="status">
            {aviso}
          </p>
        )}
      </PainelInferior>
    )
  }

  // Dashboard da evolução
  return (
    <PainelInferior
      titulo="Minha evolução"
      rodape={
        <div className="rodape-lado">
          <Botao variante="principal" onClick={() => setExportando(true)}>
            Exportar
          </Botao>
          <Botao variante="voltar" onClick={voltarAoInicio}>
            Voltar
          </Botao>
        </div>
      }
    >
      <h2 className="conectar-titulo so-impressao">Minha evolução</h2>
      <SeletorPeriodo opcoes={PERIODOS} valor={dias} onChange={setDias} />
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
