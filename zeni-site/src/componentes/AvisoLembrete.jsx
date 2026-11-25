// "O app avisa no horário marcado" (fluxo-do-app.md, bloco 6, Lembretes). Só com o app aberto na v1.
// Fica no topo até a pessoa responder: nenhuma tela some sem aviso (design system, seção 7).
import Aviso from './Aviso.jsx'
import Botao from './Botao.jsx'

export default function AvisoLembrete({ onComecar, onDispensar }) {
  return (
    <div className="aviso-conexao aviso-lembrete">
      <Aviso nivel="informacao" titulo="Hora do exercício">
        Vamos começar?
      </Aviso>
      <Botao variante="principal" onClick={onComecar}>
        Começar
      </Botao>
      <Botao variante="vazado" onClick={onDispensar}>
        Agora não
      </Botao>
    </div>
  )
}
