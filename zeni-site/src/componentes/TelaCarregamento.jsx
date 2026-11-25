// Tela de carregamento do exercício do dia (decisão de 25/11): um bulb arredondado ao centro, com gradiente
// que se preenche enquanto o exercício carrega. Sem barra de progresso. Passando de 15 s, o texto muda para uma
// frase calma e aparecem "Tentar de novo" e "Voltar" (design system 6.9).
import { useEffect, useState } from 'react'
import Botao from './Botao.jsx'

const LIMITE_MS = 15000

export default function TelaCarregamento({ texto, duracaoMs, onTentarDeNovo, onVoltar }) {
  const [demorou, setDemorou] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDemorou(true), LIMITE_MS)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="carga" role="status">
      <div className="carga-bulb" style={{ '--carga-duracao': `${duracaoMs}ms` }} aria-hidden="true" />
      <p className="carga-texto">{demorou ? 'Está demorando mais que o normal' : texto}</p>
      {demorou && (
        <div className="carga-botoes">
          <Botao variante="principal" onClick={onTentarDeNovo}>
            Tentar de novo
          </Botao>
          <Botao variante="voltar" onClick={onVoltar}>
            Voltar
          </Botao>
        </div>
      )}
    </div>
  )
}
