import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/componentes.css'
import { aplicarTamanho, tamanhoSalvo } from './aparencia.js'
import App from './App.jsx'

aplicarTamanho(tamanhoSalvo()) // tamanho do texto escolhido em Personalizar

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
