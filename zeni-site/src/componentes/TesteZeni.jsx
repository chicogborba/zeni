// Teste ao vivo do ZENI real: a pessoa mexe o ZENI e o desenho mexe junto. É assim que se confere, sem termos
// técnicos, que a conexão, o sensor de movimento e a bateria estão certos.
// Usado em Conectar (depois da posição inicial e em "Conexão com o ZENI" quando já está conectado).
import { Battery0Icon, Battery50Icon, Battery100Icon, CheckIcon, SignalIcon } from '@heroicons/react/24/outline'
import silhueta from '../assets/zeni-silhueta.svg'
import { FLAG } from '../zeni-dispositivo.js'
import { useMovimentoAoVivo, useZeni } from '../usarZeni.js'

function Linha({ ok, Icone, children }) {
  return (
    <li className={`teste-linha${ok ? ' teste-linha--ok' : ''}`}>
      <span className="teste-linha-icone" aria-hidden="true">
        {ok ? <CheckIcon className="icone" /> : <Icone className="icone" />}
      </span>
      <span>{children}</span>
    </li>
  )
}

export function IconeBateria({ nivel, className }) {
  const Icone = nivel <= 25 ? Battery0Icon : nivel <= 60 ? Battery50Icon : Battery100Icon
  return <Icone className={className} aria-hidden="true" />
}

export default function TesteZeni() {
  const zeni = useZeni()
  const vivo = useMovimentoAoVivo({ janelas: true })
  const sentindo = zeni.conectado && vivo.recebendo && (zeni.flags & FLAG.sensorOk) !== 0
  const bateria = zeni.bateria
  // O desenho segue a inclinação do ZENI (limitada, para não virar de ponta-cabeça na tela)
  const lim = (v, m) => Math.max(-m, Math.min(m, v))
  const giro = `perspective(600px) rotateX(${lim(vivo.pitch, 70)}deg) rotateZ(${lim(-vivo.roll, 170)}deg)`

  return (
    <div className="teste">
      <div className="teste-mostrador" aria-hidden="true">
        <div className="teste-brilho" style={{ '--movimento': vivo.tamanho / 100 }} />
        <img className="teste-zeni" src={silhueta} alt="" style={{ transform: giro }} />
      </div>
      <p className="conectar-destaque">Mexa o ZENI: o desenho mexe junto.</p>
      <div className="teste-barra" role="meter" aria-label="Movimento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(vivo.tamanho)}>
        <span className="teste-barra-rotulo">Movimento</span>
        <span className="teste-barra-trilho">
          <span className="teste-barra-cheio" style={{ transform: `scaleX(${vivo.tamanho / 100})` }} />
        </span>
      </div>
      <ul className="teste-lista">
        <Linha ok={zeni.conectado} Icone={SignalIcon}>
          {zeni.conectado ? 'Conectado' : 'Procurando o ZENI…'}
        </Linha>
        <Linha ok={sentindo} Icone={SignalIcon}>
          {sentindo ? 'Sentindo o movimento' : 'Ainda não sinto o movimento'}
        </Linha>
        <li className="teste-linha teste-linha--ok">
          <span className="teste-linha-icone" aria-hidden="true">
            {bateria === null ? <Battery100Icon className="icone" /> : <IconeBateria nivel={bateria} className="icone" />}
          </span>
          <span>{bateria === null ? 'Bateria: sem medida neste ZENI' : `Bateria: ${bateria}%`}</span>
        </li>
      </ul>
    </div>
  )
}
