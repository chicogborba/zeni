import { useEffect, useRef, useState } from 'react'
import Abertura from './componentes/Abertura.jsx'
import AvisoLembrete from './componentes/AvisoLembrete.jsx'
import { telaDoExercicio } from './fluxo.js'
import { lembreteDeAgora, lerLembretes } from './lembretes.js'
import { NavegacaoProvider, useNavegacao } from './navegacao.jsx'
import EmConstrucao from './telas/EmConstrucao.jsx'
import { TELAS } from './telas/index.js'

function Telas() {
  const { tela, ir } = useNavegacao()
  const Home = TELAS.home
  const Atual = TELAS[tela.nome] ?? EmConstrucao
  const painelAberto = tela.nome !== 'home'
  const [abrindo, setAbrindo] = useState(true) // tela de entrada: ao abrir o app e ao tocar no logo da Home (26/11)
  useEffect(() => {
    const rever = () => setAbrindo(true)
    window.addEventListener('zeni:abertura', rever)
    return () => window.removeEventListener('zeni:abertura', rever)
  }, [])

  // Lembretes: a cada 15 s vê se algum é para este minuto (só com o app aberto na v1)
  const [lembrete, setLembrete] = useState(null)
  const ultimo = useRef('')
  useEffect(() => {
    const id = setInterval(() => {
      const agora = new Date()
      const achado = lembreteDeAgora(lerLembretes(), agora)
      const chave = achado ? `${agora.toDateString()} ${achado.hora}` : ''
      if (achado && chave !== ultimo.current) {
        ultimo.current = chave
        setLembrete(achado)
      }
    }, 15000)
    const agoraMesmo = () => setLembrete({ hora: 'agora' }) // para a demonstração (src/simulacao.js)
    window.addEventListener('zeni:lembrete', agoraMesmo)
    return () => {
      clearInterval(id)
      window.removeEventListener('zeni:lembrete', agoraMesmo)
    }
  }, [])

  return (
    <div className="app">
      {abrindo && <Abertura onFim={() => setAbrindo(false)} />}
      {/* A Home fica por baixo do painel; enquanto ele está aberto, não recebe toque nem foco. */}
      <div inert={painelAberto}>
        <Home />
      </div>
      {painelAberto && <Atual {...tela.params} />}
      {lembrete && tela.nome !== 'exercicio' && (
        <AvisoLembrete
          onComecar={() => {
            setLembrete(null)
            ir(telaDoExercicio())
          }}
          onDispensar={() => setLembrete(null)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <NavegacaoProvider>
      <Telas />
    </NavegacaoProvider>
  )
}
