// Tela de carregamento aberta pelo logo da Home (26/11): mostra o mesmo carregamento do exercício
// (bulb que enche, com o blur ao redor) e volta sozinha à Home quando termina. Não abre o exercício.
import { useEffect } from 'react'
import TelaCarregamento from '../componentes/TelaCarregamento.jsx'
import { useNavegacao } from '../navegacao.jsx'

const DURACAO_MS = 2500 // o mesmo tempo simulado do preparo do exercício

export default function Carregamento() {
  const { voltarAoInicio } = useNavegacao()
  useEffect(() => {
    const id = setTimeout(voltarAoInicio, DURACAO_MS + 300)
    return () => clearTimeout(id)
  }, [voltarAoInicio])
  return <TelaCarregamento texto="Carregando" duracaoMs={DURACAO_MS} onTentarDeNovo={voltarAoInicio} onVoltar={voltarAoInicio} />
}
