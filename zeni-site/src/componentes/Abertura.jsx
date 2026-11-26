// Tela de entrada (26/11): ao abrir o app, gradiente linear de cinza (em cima) a azul escuro (embaixo).
// O logo sobe devagar a partir de baixo, se aproxima de quem olha (cresce) e some em fade-out lento.
// Cerca de 200 ms depois, a tela sai e a Home aparece. Só aparece ao abrir o app, não a cada volta à Home.
import { useEffect, useState } from 'react'
import logo from '../assets/zeni-logo.svg'

const PAUSA_MS = 200 // entre o fim do logo e a entrada da Home

export default function Abertura({ onFim }) {
  const [saindo, setSaindo] = useState(false)

  // Fim da animação do logo: espera 200 ms, a tela some (fade curto) e a Home fica livre
  const aoTerminarLogo = () => {
    setTimeout(() => setSaindo(true), PAUSA_MS)
  }
  useEffect(() => {
    if (!saindo) return undefined
    const id = setTimeout(onFim, 300)
    return () => clearTimeout(id)
  }, [saindo, onFim])

  return (
    <div className={`abertura${saindo ? ' abertura--saindo' : ''}`} role="status" aria-label="ZENI">
      <span className="abertura-logo" style={{ '--logo': `url(${logo})` }} onAnimationEnd={aoTerminarLogo} aria-hidden="true" />
    </div>
  )
}
