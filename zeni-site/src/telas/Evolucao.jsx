// Segue: fluxo-do-app.md, bloco 4 "Acompanhamento" e decisões 4, 14 e 18 de 25/11, e design-system.md 6.5 e 6.13.
// Minha evolução abre direto no dashboard: alternador 7 dias / 30 dias no topo, gráfico no meio e, na base,
// Exportar (esquerda, abre as opções) e Voltar (direita, perto do polegar). Volta à Tela inicial.
// Uma série por vez: a nota de cada exercício (linha de 3 px em cinza-900, área em amarelo-200, rótulos de 16 px).
// Eixo X: dias, com hoje na origem (à esquerda) e o passado para a direita; os exercícios do mesmo dia se espalham na faixa do dia.
// Eixo Y: 0, 50 e 100. Embaixo do gráfico, uma frase calma de tendência (4 exercícios ou mais).
// Salvar em PDF: impressão do navegador. Enviar link: Web Share API com texto-resumo; sem suporte, copia o texto.
// O link real depende do backend (v2). TODO (design system, pendência 10): layout do PDF em aberto.
import { useState } from 'react'
import AcoesDuplas from '../componentes/AcoesDuplas.jsx'
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

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const inicioDoDia = (t) => {
  const d = new Date(t)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
// Quantos dias atrás foi esse momento (0 = hoje, 1 = ontem...). Math.round segura a troca de horário de verão.
const diasAtras = (quando, hojeInicio) => Math.round((hojeInicio - inicioDoDia(quando)) / DIA_MS)
const dataDoDia = (d, hojeInicio) => new Date(hojeInicio.getFullYear(), hojeInicio.getMonth(), hojeInicio.getDate() - d)
const doisDigitos = (n) => String(n).padStart(2, '0')

// Eixo X em dias: "hoje" na origem (esquerda) e o passado para a direita. Cada dia tem uma faixa; os exercícios do mesmo dia
// se distribuem dentro da faixa, do mais recente (esquerda) ao mais antigo, e não ficam empilhados no mesmo ponto.
function Grafico({ pontos, dias, hojeInicio }) {
  const largura = L - ESQ - 8
  const faixa = largura / dias
  const y = (nota) => BASE - (nota / 100) * (BASE - TOPO)

  const porDia = new Map()
  for (const p of pontos) porDia.set(p.dia, [...(porDia.get(p.dia) ?? []), p])
  const xy = []
  for (const [d, lista] of porDia) {
    lista.sort((a, b) => b.quando - a.quando) // o mais recente à esquerda
    lista.forEach((p, k) => xy.push([ESQ + d * faixa + ((k + 0.5) / lista.length) * faixa, y(p.nota)]))
  }
  xy.sort((a, b) => a[0] - b[0])
  const linha = xy.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
  const area = xy.length > 1 ? `${linha} L${xy.at(-1)[0].toFixed(1)} ${BASE} L${xy[0][0].toFixed(1)} ${BASE} Z` : null

  // Rótulos do eixo X: 7 dias = "hoje" e o dia da semana de cada faixa; 30 dias = "hoje" e algumas datas
  const rotulos =
    dias === 7
      ? Array.from({ length: 7 }, (_, d) => ({ d, texto: d === 0 ? 'hoje' : SEMANA[dataDoDia(d, hojeInicio).getDay()], ancora: 'middle' }))
      : [0, 10, 20, 29].map((d) => {
          const data = dataDoDia(d, hojeInicio)
          return { d, texto: d === 0 ? 'hoje' : `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`, ancora: d === 0 ? 'start' : d === 29 ? 'end' : 'middle' }
        })

  return (
    <svg
      className="grafico"
      viewBox={`0 0 ${L} ${A}`}
      role="img"
      aria-label={`Gráfico da nota dos exercícios nos últimos ${dias} dias, de hoje para trás`}
    >
      <line className="grafico-eixo" x1={ESQ} y1={BASE} x2={L - 8} y2={BASE} />
      <line className="grafico-eixo" x1={ESQ} y1={TOPO} x2={ESQ} y2={BASE} />
      <text className="grafico-rotulo" x={ESQ - 6} y={TOPO + 5} textAnchor="end">100</text>
      <text className="grafico-rotulo" x={ESQ - 6} y={(TOPO + BASE) / 2 + 5} textAnchor="end">50</text>
      <text className="grafico-rotulo" x={ESQ - 6} y={BASE} textAnchor="end">0</text>
      {rotulos.map(({ d, texto, ancora }) => (
        <text
          key={d}
          className="grafico-rotulo"
          x={ancora === 'start' ? ESQ : ancora === 'end' ? L - 8 : ESQ + (d + 0.5) * faixa}
          y={A - 4}
          textAnchor={ancora}
        >
          {texto}
        </text>
      ))}
      {area && <path className="grafico-area" d={area} />}
      <path className="grafico-linha" d={linha} />
      {xy.map(([px, py], i) => (
        <circle key={i} className="grafico-ponto" cx={px} cy={py} r="4" />
      ))}
    </svg>
  )
}

// Frase calma sobre o caminho da nota: compara a metade mais recente com a mais antiga. Só com 4 exercícios ou mais.
function tendencia(pontos) {
  if (pontos.length < 4) return null
  const ordem = [...pontos].sort((a, b) => a.quando - b.quando)
  const meio = Math.floor(ordem.length / 2)
  const media = (v) => v.reduce((s, p) => s + p.nota, 0) / v.length
  const diferenca = media(ordem.slice(-meio)) - media(ordem.slice(0, meio))
  if (diferenca >= 3) return 'Nos últimos exercícios, a sua nota subiu.'
  if (diferenca <= -3) return 'Nos últimos exercícios, a sua nota ficou um pouco mais baixa. É normal variar.'
  return 'A sua nota está estável.'
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

  const hojeInicio = inicioDoDia(agora)
  const pontos = ler(CHAVES.historico, [])
    .map((h) => ({ quando: new Date(h.quando).getTime(), nota: h.nota }))
    .map((p) => ({ ...p, dia: diasAtras(p.quando, hojeInicio) }))
    .filter((p) => p.dia >= 0 && p.dia < dias && Number.isFinite(p.nota)) // hoje e os dias anteriores do período
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
        <AcoesDuplas voltar={{ rotulo: 'Voltar', onClick: voltarAoInicio }} acao={{ rotulo: 'Exportar', onClick: () => setExportando(true) }} />
      }
    >
      <h2 className="conectar-titulo so-impressao">Minha evolução</h2>
      <SeletorPeriodo opcoes={PERIODOS} valor={dias} onChange={setDias} />
      {pontos.length === 0 ? (
        <p className="conectar-texto">Ainda não há exercícios nesse período. Faça um exercício para ver a sua evolução.</p>
      ) : (
        <>
          <p className="rotulo-caps">Nota de cada exercício</p>
          <Grafico pontos={pontos} dias={dias} hojeInicio={hojeInicio} />
          <div className="grafico-pe">
            <p className="rotulo-caps">
              {pontos.length} {pontos.length === 1 ? 'exercício' : 'exercícios'}
            </p>
            <p className="nota-media">
              <span className="rotulo-caps">Nota média</span>
              <span className="nota-media-valor">{media}</span>
            </p>
          </div>
          {tendencia(pontos) && <p className="conectar-texto">{tendencia(pontos)}</p>}
        </>
      )}
    </PainelInferior>
  )
}
