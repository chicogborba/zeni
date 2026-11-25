// Painel inferior do design system, seção 6.8.
// 88% da altura (altura total no exercício), película que fecha ao tocar, sem "X" nem alça.
// Rodapé fixo: botão principal (72) com o secundário (64) logo abaixo.
import { useEffect, useRef } from 'react'
import { useNavegacao } from '../navegacao.jsx'

export default function PainelInferior({ titulo, alturaTotal = false, onFechar, rodape, children }) {
  const { voltarAoInicio } = useNavegacao()
  const fechar = onFechar ?? voltarAoInicio
  const painelRef = useRef(null)

  useEffect(() => {
    painelRef.current?.focus()
  }, [])

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') fechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fechar])

  return (
    <div className="painel-camada">
      {/* Tocar na película também fecha o painel. No exercício em altura total não há película. */}
      {!alturaTotal && <div className="painel-pelicula" onClick={fechar} aria-hidden="true" />}
      <section
        ref={painelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`painel${alturaTotal ? ' painel--total' : ''}`}
      >
        <div className="painel-conteudo">{children}</div>
        {rodape ? <div className="painel-rodape">{rodape}</div> : null}
      </section>
    </div>
  )
}
