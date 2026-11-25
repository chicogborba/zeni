// Avisos do design system, seção 6.4. Sem vermelho: ícone, título curto e uma frase.
// informacao (azul claro), atencao (amarelo claro), urgente (escuro, fica até ser tocado).
const ICONES = {
  informacao: (
    <>
      <circle cx="14" cy="14" r="11" />
      <path d="M14 13v7M14 8.5v.5" />
    </>
  ),
  atencao: (
    <>
      <circle cx="14" cy="14" r="11" />
      <path d="M14 8v7M14 19v.5" />
    </>
  ),
  urgente: (
    <>
      <circle cx="14" cy="14" r="11" />
      <path d="M11 10v8M17 10v8" />
    </>
  ),
}

export default function Aviso({ nivel = 'informacao', titulo, children }) {
  return (
    <div className={`aviso aviso--${nivel}`} role={nivel === 'urgente' ? 'alert' : 'status'}>
      <svg
        className="icone aviso-icone"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONES[nivel]}
      </svg>
      <div>
        <p className="aviso-titulo">{titulo}</p>
        {children ? <p className="aviso-texto">{children}</p> : null}
      </div>
    </div>
  )
}
