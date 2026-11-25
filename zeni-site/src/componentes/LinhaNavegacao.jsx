// Linha de navegação dos painéis: texto à esquerda e chevron à direita.
// Substitui os botões com contorno que só levavam a outra tela (decisão de 25/11).
// `chevron={false}` para linhas que executam uma ação em vez de abrir outra tela.
// O alvo de toque segue --target-min (64 px, seção 7). Não é botão de ação: não tem contorno nem fundo.
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export default function LinhaNavegacao({ onClick, chevron = true, children }) {
  return (
    <button type="button" className="linha-nav" onClick={onClick}>
      <span className="linha-nav-texto">{children}</span>
      {chevron && <ChevronRightIcon className="icone linha-nav-chevron" aria-hidden="true" />}
    </button>
  )
}
