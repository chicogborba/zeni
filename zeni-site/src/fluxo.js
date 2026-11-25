// Decide para onde o botão "Começar o exercício" leva, conforme o que já foi feito neste aparelho.
// TODO (fluxo-do-app.md, ponto em aberto 3 "Primeiro uso e permissões"): a ordem PAR-Q e depois conectar o ZENI
// é provisória. O fluxograma não define o primeiro uso, nem os passos de permissão de microfone e Bluetooth.
import { CHAVES, ler } from './storage.js'

export const triagemFeita = () => (ler(CHAVES.respostasParq, [])?.length ?? 0) >= 7
export const zeniConectado = () => ler(CHAVES.zeni, null)?.conectado === true

export function telaDoExercicio() {
  if (!triagemFeita()) return 'parq' // obrigatória antes do primeiro exercício (decisão 3)
  if (!zeniConectado()) return 'conectar'
  return 'exercicio'
}
