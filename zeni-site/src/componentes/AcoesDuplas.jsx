// Padrão de ação dupla em bottom sheets (design system, seção 6.1, decisão de 26/11):
// "Voltar" sempre à esquerda e a outra ação à direita, os dois com 64 px de altura (--target-min).
// Os dois têm a mesma largura. O da direita é sempre igual ou maior que o da esquerda: só fica maior quando o
// rótulo dele exige (decisão de 26/11). Sem ação primária (`primaria: null`), os dois ficam sempre iguais.
// `primaria`: 'acao' (padrão) | 'voltar' | null.
// Se "Voltar" for a ação primária, ele segue a regra de ação primária e não a de posição fixa à esquerda:
// vai para a direita, e a outra ação fica à esquerda.
export default function AcoesDuplas({ voltar, acao, primaria = 'acao' }) {
  const itemVoltar = { ...voltar, id: 'voltar', variante: 'voltar' }
  const itemAcao = { ...acao, id: 'acao', variante: 'principal' }
  const voltarEhPrimaria = primaria === 'voltar'
  const [esquerda, direita] = voltarEhPrimaria ? [itemAcao, itemVoltar] : [itemVoltar, itemAcao]
  const primariaId = primaria === 'voltar' ? 'voltar' : primaria === 'acao' ? 'acao' : null

  const botao = (b) => (
    <button
      key={b.id}
      type="button"
      className={`botao botao--${b.variante} botao--36${b.desativado ? ' botao--desativado' : ''}`}
      aria-disabled={b.desativado || undefined}
      onClick={b.desativado ? undefined : b.onClick}
    >
      {b.rotulo}
    </button>
  )
  return (
    <div className={`acoes-duplas${primariaId ? ' acoes-duplas--direita-cresce' : ''}`}>
      {botao(esquerda)}
      {botao(direita)}
    </div>
  )
}
