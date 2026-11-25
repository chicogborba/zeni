// Decisão da autora (24/11): quando o ZENI não está conectado, a Home mostra no topo um aviso de
// informação com o botão "Conectar". Some ao conectar ou quando a pessoa o empurra para cima.
// Fica por cima da Home (posição fixa), sem mexer no layout dela.
// Alternativas ao gesto: a tecla Esc também o tira de vista, e o botão "Conectar" resolve o motivo do aviso.
import { useRef, useState } from 'react'
import { zeniConectado } from '../fluxo.js'
import { useNavegacao } from '../navegacao.jsx'
import Aviso from './Aviso.jsx'
import Botao from './Botao.jsx'

const DISTANCIA_MINIMA = 40 // px arrastados para cima para tirar o aviso de vista

export default function AvisoConexao() {
  const { ir } = useNavegacao()
  const [dispensado, setDispensado] = useState(false)
  const inicio = useRef(null)

  if (zeniConectado() || dispensado) return null

  return (
    <div
      className="aviso-conexao"
      onPointerDown={(e) => {
        inicio.current = e.clientY
      }}
      onPointerUp={(e) => {
        if (inicio.current !== null && inicio.current - e.clientY > DISTANCIA_MINIMA) setDispensado(true)
        inicio.current = null
      }}
      onPointerCancel={() => {
        inicio.current = null
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setDispensado(true)
      }}
    >
      <Aviso nivel="informacao" titulo="O ZENI não está conectado" />
      <Botao variante="secundario" onClick={() => ir('conectar')}>
        Conectar
      </Botao>
    </div>
  )
}
