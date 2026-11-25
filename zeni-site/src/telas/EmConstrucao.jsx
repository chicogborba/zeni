// TEMPORÁRIA: aparece quando um destino da Home ainda não foi construído.
// Cada etapa seguinte troca esta tela pela tela de verdade. Some ao fim da etapa 8.
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { useNavegacao } from '../navegacao.jsx'

export default function EmConstrucao() {
  const { voltarAoInicio } = useNavegacao()
  return (
    <PainelInferior
      titulo="Em construção"
      rodape={
        <Botao variante="voltar" onClick={voltarAoInicio}>
          Voltar
        </Botao>
      }
    >
      <h2 style={{ font: 'var(--type-titulo-2)' }}>Em construção</h2>
      <p style={{ font: 'var(--type-corpo)' }}>Esta tela ainda está sendo feita.</p>
    </PainelInferior>
  )
}
