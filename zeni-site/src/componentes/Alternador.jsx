// Alternador (liga/desliga). A linha inteira é o alvo de toque (64 px, design system seção 7).
// O estado aparece em texto ("Ligado"/"Desligado"), não só pela cor.
export default function Alternador({ rotulo, ligado, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      className={`alternador${ligado ? ' alternador--ligado' : ''}`}
      onClick={() => onChange(!ligado)}
    >
      <span className="alternador-texto">
        <span className="alternador-rotulo">{rotulo}</span>
        <span className="alternador-estado">{ligado ? 'Ligado' : 'Desligado'}</span>
      </span>
      <span className="alternador-trilho" aria-hidden="true">
        <span className="alternador-bolinha" />
      </span>
    </button>
  )
}
