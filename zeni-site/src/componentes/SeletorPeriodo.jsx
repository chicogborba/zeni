// Alternador de período (7 dias / 30 dias), no topo de Minha evolução.
// Dois botões de escolha do mesmo tamanho (64 px, seção 7). O escolhido muda de fundo e diz "escolhido" por
// aria-pressed: não depende só da cor.
export default function SeletorPeriodo({ opcoes, valor, onChange }) {
  return (
    <div className="seletor" role="group" aria-label="Período">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={`seletor-opcao${valor === o.valor ? ' seletor-opcao--ativa' : ''}`}
          aria-pressed={valor === o.valor}
          onClick={() => onChange(o.valor)}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  )
}
