// Modal centralizado (exceção de 25/11: a nota). Película que não fecha ao tocar: a pessoa escolhe pelo botão.
import { useEffect, useRef } from 'react'

export default function ModalCentral({ titulo, onFechar, children }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') onFechar?.()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  return (
    <div className="modal-camada">
      <div className="modal-pelicula" aria-hidden="true" />
      <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="modal">
        {children}
      </section>
    </div>
  )
}
