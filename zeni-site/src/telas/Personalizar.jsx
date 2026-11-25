// Segue: fluxo-do-app.md, bloco 6 "Personalizar o app" (6.0 e a tabela de itens).
// Itens feitos: Lembretes e Aparência (tamanho do texto). Ficam para depois: Comandos de voz, Tom e Dados de saúde.
// TODO (design system, pendência 12): definir se cada item é um painel em sequência ou se a regra de um nível
//   muda. Provisório: cada item substitui este painel e o "Voltar" do item volta para cá.
// Daqui também se segue para "Pedir ajuda ao ZENI" (6.0). O "ZENI já abre ouvindo" fica fora da v1 (decisão 7).
import { useState } from 'react'
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'
import Aparencia from './Aparencia.jsx'
import Lembretes from './Lembretes.jsx'

export default function Personalizar() {
  const { ir, voltarAoInicio } = useNavegacao()
  const [item, setItem] = useState(null) // null | 'lembretes' | 'aparencia'

  if (item === 'lembretes') return <Lembretes onVoltar={() => setItem(null)} />
  if (item === 'aparencia') return <Aparencia onVoltar={() => setItem(null)} />

  return (
    <PainelInferior
      titulo="Personalizar"
      rodape={
        <Botao variante="secundario" onClick={voltarAoInicio}>
          Voltar
        </Botao>
      }
    >
      <h2 className="conectar-titulo">Personalizar</h2>
      <Botao variante="vazado" onClick={() => setItem('lembretes')}>
        Lembretes
      </Botao>
      <Botao variante="vazado" onClick={() => setItem('aparencia')}>
        Aparência
      </Botao>
      <Botao variante="vazado" onClick={() => ir('ajuda')}>
        Pedir ajuda ao ZENI
      </Botao>
    </PainelInferior>
  )
}
