// Segue: fluxo-do-app.md, bloco 1 "Conectar com o ZENI" (1.1 a 1.6) e design-system.md 6.9 (tela de espera).
// O ZENI é simulado: a busca e a conexão são geradas pelo app (CLAUDE.md, escopo da v1).
// 1.2 procurando -> 1.3 conectado -> 1.4 apoiar na mesa -> 1.5 aprendendo a posição -> 1.6 volta à Home.
// TODO (fluxo-do-app.md, ponto em aberto 3): sem passo de permissão de Bluetooth no fluxograma.
import { CheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import AcoesDuplas from '../componentes/AcoesDuplas.jsx'
import Botao from '../componentes/Botao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import TelaEspera from '../componentes/TelaEspera.jsx'
import { useNavegacao } from '../navegacao.jsx'
import { BATERIA_SIMULADA } from '../fluxo.js'
import { CHAVES, guardar } from '../storage.js'

const BUSCA_MS = 3000 // tempo simulado da busca
const SEGUNDOS_NA_MESA = 3 // "Apoiar o ZENI na mesa por 3 segundos"

export default function Conectar() {
  const { voltarAoInicio } = useNavegacao()
  const [estado, setEstado] = useState('procurando') // procurando | conectado | aprendendo | pronto
  const [tentativa, setTentativa] = useState(0)
  const [restam, setRestam] = useState(SEGUNDOS_NA_MESA)

  // 1.2: a busca simulada termina em "conectado"
  useEffect(() => {
    if (estado !== 'procurando') return undefined
    const id = setTimeout(() => setEstado('conectado'), BUSCA_MS)
    return () => clearTimeout(id)
  }, [estado, tentativa])

  // 1.5: contagem dos 3 segundos, depois o ZENI "aprendeu" a posição inicial
  useEffect(() => {
    if (estado !== 'aprendendo') return undefined
    const id = setTimeout(() => {
      if (restam > 1) {
        setRestam(restam - 1)
        return
      }
      guardar(CHAVES.zeni, { conectado: true, bateria: BATERIA_SIMULADA, posicaoInicial: new Date().toISOString() })
      setEstado('pronto')
    }, 1000)
    return () => clearTimeout(id)
  }, [estado, restam])

  if (estado === 'procurando') {
    return (
      <TelaEspera
        key={tentativa}
        texto="Procurando o ZENI"
        onTentarDeNovo={() => setTentativa((t) => t + 1)}
        onVoltar={voltarAoInicio}
      />
    )
  }

  if (estado === 'conectado') {
    return (
      <PainelInferior
        titulo="ZENI conectado"
        rodape={
          <AcoesDuplas
            voltar={{ rotulo: 'Voltar', onClick: voltarAoInicio }}
            acao={{
              rotulo: 'Pronto',
              onClick: () => {
                setRestam(SEGUNDOS_NA_MESA)
                setEstado('aprendendo')
              },
            }}
          />
        }
      >
        <span className="selo" aria-hidden="true">
          <CheckIcon className="icone" />
        </span>
        <h2 className="conectar-titulo">Conectado</h2>
        <p className="conectar-destaque">Apoie o ZENI na mesa por 3 segundos.</p>
      </PainelInferior>
    )
  }

  if (estado === 'aprendendo') {
    return (
      <PainelInferior titulo="Posição inicial">
        <h2 className="conectar-titulo">Fique parado</h2>
        <p className="conectar-texto">O ZENI está aprendendo a sua posição inicial.</p>
        <p className="conectar-numero" aria-live="polite">
          {restam}
        </p>
      </PainelInferior>
    )
  }

  return (
    <PainelInferior
      titulo="Tudo pronto"
      rodape={
        <Botao variante="principal" onClick={voltarAoInicio}>
          Voltar ao início
        </Botao>
      }
    >
      <span className="selo" aria-hidden="true">
        <CheckIcon className="icone" />
      </span>
      <h2 className="conectar-titulo">Tudo pronto</h2>
      <p className="conectar-texto">O ZENI guardou a sua posição inicial.</p>
    </PainelInferior>
  )
}
