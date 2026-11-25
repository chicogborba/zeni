// Camada de dados no aparelho. Simula o servidor na v1 (CLAUDE.md, escopo da v1).
// Quando houver backend, só este arquivo muda.

const PREFIXO = 'zeni:v1:'

// Chaves usadas pelo app. Cada etapa acrescenta as suas aqui.
export const CHAVES = {
  respostasParq: 'respostas-parq', // [{ pergunta, resposta, quando }]
  consentimento: 'consentimento',
  zeni: 'zeni', // estado da conexão simulada e posição inicial
  historico: 'historico', // exercícios feitos
  ajustes: 'ajustes', // aparência, lembretes, tom
}

export function ler(chave, padrao = null) {
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chave)
    return bruto === null ? padrao : JSON.parse(bruto)
  } catch {
    return padrao
  }
}

export function guardar(chave, valor) {
  try {
    window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export function apagar(chave) {
  try {
    window.localStorage.removeItem(PREFIXO + chave)
  } catch {
    // sem armazenamento disponível: nada a apagar
  }
}
