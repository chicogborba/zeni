// Segue: fluxo-do-app.md, bloco 6 "Personalizar o app" (6.0 e a tabela de itens).
// Itens feitos: Lembretes e Aparência (tamanho do texto). Ficam para depois: Comandos de voz, Tom e Dados de saúde.
// TODO (design system, pendência 12): definir se cada item é um painel em sequência ou se a regra de um nível
//   muda. Provisório: cada item substitui este painel e o "Voltar" do item volta para cá.
// Abre pelo menu do avatar na Home (decisão 1a de 25/11). "Pedir ajuda ao ZENI" (bloco 7) saiu da v1 (decisão 3 de 25/11).
import { useState } from 'react'
import Botao from '../componentes/Botao.jsx'
import LinhaNavegacao from '../componentes/LinhaNavegacao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'
import Aparencia from './Aparencia.jsx'
import Lembretes from './Lembretes.jsx'

export default function Personalizar() {
  const { voltarAoInicio } = useNavegacao()
  const [item, setItem] = useState(null) // null | 'lembretes' | 'aparencia'

  if (item === 'lembretes') return <Lembretes onVoltar={() => setItem(null)} />
  if (item === 'aparencia') return <Aparencia onVoltar={() => setItem(null)} />

  return (
    <PainelInferior
      titulo="Personalizar"
      rodape={
        <Botao variante="voltar" onClick={voltarAoInicio}>
          Voltar
        </Botao>
      }
    >
      <h2 className="conectar-titulo">Personalizar</h2>
      <div className="linhas linhas--sem-divisoria">
        <LinhaNavegacao onClick={() => setItem('lembretes')}>Lembretes</LinhaNavegacao>
        <LinhaNavegacao onClick={() => setItem('aparencia')}>Aparência</LinhaNavegacao>
      </div>
    </PainelInferior>
  )
}
