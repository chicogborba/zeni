// Avatar com menu suspenso (decisões 1a e 13 de 25/11).
// Alvo de 64 px (seção 7), a inicial da pessoa como conteúdo e aria-label "Abrir menu".
// Exceção à regra "ícone nunca é alvo de toque sozinho": a inicial identifica o botão.
// TODO: o fluxo não coleta o nome da pessoa (ponto aberto no fluxo-do-app.md). Sem nome guardado em
// `ajustes.nome`, o avatar mostra um ícone de pessoa no lugar da inicial.
import { UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useId, useRef, useState } from 'react'
import { CHAVES, ler } from '../storage.js'

const inicialDaPessoa = () => {
  const nome = ler(CHAVES.ajustes, {})?.nome
  return typeof nome === 'string' && nome.trim() ? nome.trim()[0].toUpperCase() : null
}

export default function MenuAvatar({ itens }) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef(null)
  const botao = useRef(null)
  const idMenu = useId()
  const inicial = inicialDaPessoa()

  // Fecha ao tocar fora ou com Esc (o foco volta ao avatar)
  useEffect(() => {
    if (!aberto) return undefined
    const fora = (e) => {
      if (!raiz.current?.contains(e.target)) setAberto(false)
    }
    const tecla = (e) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  return (
    <div className="menu-avatar" ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="avatar"
        aria-label="Abrir menu"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={aberto ? idMenu : undefined}
        onClick={() => setAberto((a) => !a)}
      >
        {inicial ?? <UserIcon className="icone avatar-icone" aria-hidden="true" />}
      </button>
      {aberto && (
        <div className="menu" id={idMenu} role="menu">
          {itens.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="menu-item"
              onClick={() => {
                setAberto(false)
                item.onEscolher()
              }}
            >
              {item.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
