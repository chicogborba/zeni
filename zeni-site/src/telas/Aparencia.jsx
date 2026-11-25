// Segue: fluxo-do-app.md, bloco 6, item "Aparência": escolhe o tamanho do texto, a tela muda na hora,
// confirma ou volta ao jeito anterior.
// TODO (design system, pendência 9): falta "as cores da tela". Modo escuro e alto contraste estão fora desta versão.
import { useState } from 'react'
import { TAMANHOS, aplicarTamanho, tamanhoSalvo } from '../aparencia.js'
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { CHAVES, guardar, ler } from '../storage.js'

export default function Aparencia({ onVoltar }) {
  const [anterior] = useState(tamanhoSalvo)
  const [escolhido, setEscolhido] = useState(anterior)

  const escolher = (id) => {
    setEscolhido(id)
    aplicarTamanho(id) // a tela muda na hora, para ver como fica
  }

  const confirmar = () => {
    guardar(CHAVES.ajustes, { ...ler(CHAVES.ajustes, {}), tamanhoTexto: escolhido })
    onVoltar()
  }

  const desfazer = () => {
    aplicarTamanho(anterior) // volta ao jeito anterior
    onVoltar()
  }

  return (
    <PainelInferior
      titulo="Aparência"
      onFechar={desfazer}
      rodape={
        <>
          <Botao variante="principal" onClick={confirmar}>
            Confirmar
          </Botao>
          <Botao variante="secundario" onClick={desfazer}>
            Voltar ao jeito anterior
          </Botao>
        </>
      }
    >
      <h2 className="conectar-titulo">Tamanho do texto</h2>
      {TAMANHOS.map((t) => (
        <Botao
          key={t.id}
          variante={escolhido === t.id ? 'secundario' : 'vazado'}
          pressionado={escolhido === t.id}
          onClick={() => escolher(t.id)}
        >
          {escolhido === t.id ? `${t.nome} (escolhido)` : t.nome}
        </Botao>
      ))}
    </PainelInferior>
  )
}
