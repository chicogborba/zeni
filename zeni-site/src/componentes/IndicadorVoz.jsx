// Mostra que o microfone está ouvindo (texto e ícone, não só cor). Some quando não está ouvindo ou não há voz.
import { MicrophoneIcon } from '@heroicons/react/24/outline'

export default function IndicadorVoz({ ouvindo }) {
  if (!ouvindo) return null
  return (
    <p className="voz-indicador" role="status">
      <MicrophoneIcon className="icone voz-indicador-icone" aria-hidden="true" />
      Ouvindo
    </p>
  )
}
