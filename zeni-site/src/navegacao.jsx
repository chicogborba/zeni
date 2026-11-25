// Navegação simples por estado, sem biblioteca.
// Regras do design system (6.8): um nível só de painel, e todo caminho volta à Home.
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NavegacaoContext = createContext(null)

const INICIO = { nome: 'home', params: {} }

export function NavegacaoProvider({ children }) {
  const [tela, setTela] = useState(INICIO)

  // Troca a tela atual. Não empilha: um painel nunca abre outro, ele é substituído.
  const ir = useCallback((nome, params = {}) => setTela({ nome, params }), [])
  const voltarAoInicio = useCallback(() => setTela(INICIO), [])

  const valor = useMemo(() => ({ tela, ir, voltarAoInicio }), [tela, ir, voltarAoInicio])
  return <NavegacaoContext.Provider value={valor}>{children}</NavegacaoContext.Provider>
}

export function useNavegacao() {
  const contexto = useContext(NavegacaoContext)
  if (!contexto) throw new Error('useNavegacao precisa estar dentro de NavegacaoProvider')
  return contexto
}
