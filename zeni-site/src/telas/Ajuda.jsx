// Segue: fluxo-do-app.md, bloco 7 "Pedir ajuda ao ZENI" (7.1 a 7.6) e decisão 7 (v1: só por texto).
// 7.2 escrever o que quer mudar -> 7.3 o app entende (se não, pede para repetir) -> 7.4 mostra o que vai mudar
// -> 7.5 Confirmar ou Desfazer -> 7.6 volta à Tela inicial.
// A IA só mexe em aparência, lembretes e tom. Dados de saúde só à mão.
// TODO: a entrada é por Personalizar (fluxo-do-app.md, 6.0), porque a Home não tem mais este destino. Falta confirmar.
import { useState } from 'react'
import Botao from '../componentes/Botao.jsx'
import EtiquetaIA from '../componentes/EtiquetaIA.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { EXEMPLOS, interpretar } from '../pedidos.js'

export default function Ajuda() {
  const { voltarAoInicio } = useNavegacao()
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')
  const [pedido, setPedido] = useState(null) // pedido entendido, esperando Confirmar ou Desfazer
  const [desfazerPrevia, setDesfazerPrevia] = useState(() => () => {})

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    const achado = interpretar(texto)
    if (!achado) {
      setAviso('Não entendi. Pode dizer de outro jeito?') // 7.3: volta a 7.2
      return
    }
    if (achado.saude) {
      setAviso('Os dados de saúde só mudam à mão, em Personalizar.')
      return
    }
    setAviso('')
    setDesfazerPrevia(() => achado.previa()) // 7.4: a mudança aparece na própria tela
    setPedido(achado)
  }

  // 7.5: Desfazer volta ao jeito anterior
  const desfazer = () => {
    desfazerPrevia()
    voltarAoInicio()
  }

  if (pedido) {
    return (
      <PainelInferior
        titulo="O que vai mudar"
        onFechar={desfazer}
        rodape={
          <>
            <Botao
              variante="principal"
              onClick={() => {
                pedido.confirmar()
                voltarAoInicio() // 7.6
              }}
            >
              Confirmar
            </Botao>
            <Botao variante="secundario" onClick={desfazer}>
              Desfazer
            </Botao>
          </>
        }
      >
        <h2 className="conectar-titulo">O que vai mudar</h2>
        <EtiquetaIA>{pedido.resumo}</EtiquetaIA>
      </PainelInferior>
    )
  }

  return (
    <PainelInferior
      titulo="Pedir ajuda ao ZENI"
      rodape={
        <>
          <Botao variante="principal" onClick={enviar}>
            Enviar
          </Botao>
          <Botao variante="secundario" onClick={voltarAoInicio}>
            Voltar
          </Botao>
        </>
      }
    >
      <h2 className="conectar-titulo">O que você quer mudar?</h2>
      <form onSubmit={enviar}>
        <label className="campo-rotulo" htmlFor="pedido">
          Escreva o seu pedido
        </label>
        <input
          id="pedido"
          className="campo"
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
        />
      </form>
      {aviso && <p className="conectar-destaque">{aviso}</p>}
      <p className="parq-contador">Por exemplo: {EXEMPLOS.join(', ')}.</p>
    </PainelInferior>
  )
}
