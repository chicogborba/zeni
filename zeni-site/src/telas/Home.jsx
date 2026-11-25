// Segue: fluxo-do-app.md, seção "Tela inicial (Home)", H.3, com a decisão da autora da Home:
// em cima, uma faixa com os dados de saúde; embaixo, evolução (esquerda) e exercício (direita);
// Personalizar como ícone no canto.
import { ChartBarIcon, Cog6ToothIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import AvisoConexao from '../componentes/AvisoConexao.jsx'
import { telaDoExercicio } from '../fluxo.js'
import { useNavegacao } from '../navegacao.jsx'
import { CHAVES, ler } from '../storage.js'

// PROVISÓRIO: a ordem e o formato dos destinos são decisão do grupo
// (fluxo-do-app.md, "O fluxograma não define a ordem nem o formato"; design system, pendência 11).
// Para mudar, basta reordenar este array ou trocar o `gradiente`.
// `tela` pode ser uma função: o exercício passa antes pela triagem e pela conexão (src/fluxo.js).
// `canto: true` = vira só um ícone no canto superior direito, fora da grade.
// A ordem do array é a ordem na tela, da esquerda para a direita. Só o exercício usa o amarelo.
const DESTINOS = [
  { id: 'evolucao', titulo: 'Minha evolução', apoio: '7 ou 30 dias', tela: 'evolucao', gradiente: 'cinza', Icone: ChartBarIcon },
  { id: 'exercicio', titulo: 'Começar o exercício', apoio: 'Veja o de hoje', tela: telaDoExercicio, gradiente: 'amarelo', Icone: PlayCircleIcon },
  { id: 'personalizar', titulo: 'Personalizar', apoio: 'Do seu jeito', tela: 'personalizar', canto: true },
]

// TODO: dados de saúde da pessoa. Os documentos não dizem quais dados mostrar aqui nem de onde vêm.
// Provisório: dois indicadores que o exercício avalia (fluxo-do-app.md, 3.1). Mostram o último exercício,
// ou "—" enquanto não houver histórico.
const DADOS = [
  { id: 'suavidade', rotulo: 'Suavidade' },
  { id: 'ritmo', rotulo: 'Ritmo' },
]

export default function Home() {
  const { ir } = useNavegacao()
  const ultimo = ler(CHAVES.historico, []).at(-1)
  const canto = DESTINOS.find((d) => d.canto)
  const grade = DESTINOS.filter((d) => !d.canto)
  return (
    <main className="tela tela--home">
      <AvisoConexao />
      {/* TODO (design system, 6.9): a abertura diz "Olá, {nome}", mas o fluxo não coleta nome. Sem nome por enquanto. */}
      <header className="home-topo">
        <h1 className="home-titulo">Olá</h1>
        {/* Decisão da autora da Home: só ícone. O alvo de toque segue os 64 px do design system (seção 7). */}
        <button type="button" className="home-icone" aria-label={canto.titulo} onClick={() => ir(canto.tela)}>
          <Cog6ToothIcon strokeWidth={1.5} aria-hidden="true" />
        </button>
      </header>
      <section className="home-dados" aria-label="Seus dados de saúde">
        {DADOS.map((d) => (
          <div key={d.id} className="dado">
            <p className="dado-numero">{ultimo?.[d.id] ?? '—'}</p>
            <p className="dado-rotulo">{d.rotulo}</p>
          </div>
        ))}
      </section>
      <div className="home-grade">
        {grade.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`cartao cartao--${d.gradiente}`}
            onClick={() => ir(typeof d.tela === 'function' ? d.tela() : d.tela)}
          >
            <d.Icone className="cartao-icone" strokeWidth={1.5} aria-hidden="true" />
            <span className="cartao-titulo">{d.titulo}</span>
            <span className="cartao-apoio">{d.apoio}</span>
          </button>
        ))}
      </div>
    </main>
  )
}
