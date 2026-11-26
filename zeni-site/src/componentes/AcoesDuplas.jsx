// Padrão de ação dupla em bottom sheets (design system, seção 6.1, decisão de 26/11):
// "Voltar" sempre à esquerda e a outra ação à direita, os dois com 64 px de altura (--target-min).
// Por padrão os dois dividem a largura igualmente. Quando um deles é a ação primária, ele fica com largura
// automática (abraça o texto) e o outro ocupa o resto. `primaria`: 'acao' (padrão) | 'voltar' | null (igual).
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
      className={`botao botao--${b.variante} botao--36${b.id === primariaId ? ' botao--hug' : ''}${b.desativado ? ' botao--desativado' : ''}`}
      aria-disabled={b.desativado || undefined}
      onClick={b.desativado ? undefined : b.onClick}
    >
      {b.rotulo}
    </button>
  )
  return (
    <div className="acoes-duplas">
      {botao(esquerda)}
      {botao(direita)}
    </div>
  )
}
