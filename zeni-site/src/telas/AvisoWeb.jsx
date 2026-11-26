// Aviso para quem abre o site no computador (26/11): não existe versão web. Só esta tela, sem navegação.
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import logo from '../assets/zeni-logo.svg'

export default function AvisoWeb() {
  return (
    <main className="aviso-web">
      <section className="aviso-web-cartao">
        <span className="aviso-web-logo" role="img" aria-label="ZENI" style={{ '--logo': `url(${logo})` }} />
        <DevicePhoneMobileIcon className="icone aviso-web-icone" aria-hidden="true" />
        <h1 className="conectar-titulo">O ZENI não está disponível no computador</h1>
        <p className="conectar-texto">Para usar o ZENI, abra este mesmo endereço no navegador do seu celular.</p>
      </section>
    </main>
  )
}
