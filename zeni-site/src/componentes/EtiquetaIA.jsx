// Marca de IA do design system, seção 6.6: etiqueta "IA" em azul-100 com texto azul-800.
// Sempre acompanhada de uma frase que explica o que o app fez.
export default function EtiquetaIA({ children }) {
  return (
    <div className="ia">
      <span className="ia-etiqueta">IA</span>
      <p className="ia-frase">{children}</p>
    </div>
  )
}
