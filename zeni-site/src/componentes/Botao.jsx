// Botões do design system, seção 6.1.
// principal: amarelo, 72 px, uma por tela. secundario: escuro, 64 px. vazado: borda, 64 px.
// voltar: escuro, um passo abaixo do principal (--target-voltar, 64 px).
// Desativado: mantém o contorno e escreve o motivo abaixo (nunca cinza claro).
export default function Botao({ variante = 'secundario', onClick, desativado = false, motivo, pressionado, children }) {
  return (
    <div className="botao-grupo">
      <button
        type="button"
        className={`botao botao--${variante}${desativado ? ' botao--desativado' : ''}`}
        aria-disabled={desativado || undefined}
        aria-pressed={pressionado}
        onClick={desativado ? undefined : onClick}
      >
        {children}
      </button>
      {desativado && motivo ? <p className="botao-motivo">{motivo}</p> : null}
    </div>
  )
}
