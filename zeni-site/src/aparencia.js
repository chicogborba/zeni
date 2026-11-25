// Aparência (fluxo-do-app.md, bloco 6): tamanho do texto, guardado em ajustes e aplicado na hora.
// TODO (design system, pendência 9): "cores da tela" (modo escuro, alto contraste) está fora desta versão.
import { CHAVES, ler } from './storage.js'

export const TAMANHOS = [
  { id: 'normal', nome: 'Normal', escala: 1 },
  { id: 'grande', nome: 'Grande', escala: 1.25 },
  { id: 'maior', nome: 'Muito grande', escala: 1.5 },
]

export function aplicarTamanho(id) {
  const escala = TAMANHOS.find((t) => t.id === id)?.escala ?? 1
  document.documentElement.style.setProperty('--escala-texto', String(escala))
}

export const tamanhoSalvo = () => ler(CHAVES.ajustes, {}).tamanhoTexto ?? 'normal'
