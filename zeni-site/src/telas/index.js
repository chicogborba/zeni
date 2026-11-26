// Registro das telas. Cada etapa acrescenta as suas aqui.
// Cada tela renderiza o próprio PainelInferior (ou tela cheia, nas telas de espera).
import Avaliacao from './Avaliacao.jsx'
import Carregamento from './Carregamento.jsx'
import Conectar from './Conectar.jsx'
import Evolucao from './Evolucao.jsx'
import Exercicio from './Exercicio.jsx'
import Home from './Home.jsx'
import Parq from './Parq.jsx'
import Personalizar from './Personalizar.jsx'

export const TELAS = {
  home: Home,
  avaliacao: Avaliacao,
  carregamento: Carregamento,
  conectar: Conectar,
  evolucao: Evolucao,
  exercicio: Exercicio,
  parq: Parq,
  personalizar: Personalizar,
}
