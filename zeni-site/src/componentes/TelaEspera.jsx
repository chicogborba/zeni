// Tela de espera do design system, seção 6.9: só texto e gradiente, sem logotipo nem barra de progresso.
// Passando de 15 s, o texto muda para uma frase calma e aparecem "Tentar de novo" e "Voltar".
// TODO (design system, pendência 15): o limite de 15 s difere dos 10 s por tentativa da reconexão; alinhar.
import { useEffect, useState } from 'react'
import Botao from './Botao.jsx'

const LIMITE_MS = 15000

export default function TelaEspera({ texto, onTentarDeNovo, onVoltar }) {
  const [demorou, setDemorou] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDemorou(true), LIMITE_MS)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="espera" role="status">
      <div className="espera-conteudo">
        <h1 className="espera-texto">{demorou ? 'Está demorando mais que o normal' : texto}</h1>
      </div>
      {demorou && (
        <div className="espera-botoes">
          <Botao variante="principal" onClick={onTentarDeNovo}>
            Tentar de novo
          </Botao>
          <Botao variante="secundario" onClick={onVoltar}>
            Voltar
          </Botao>
        </div>
      )}
    </div>
  )
}
