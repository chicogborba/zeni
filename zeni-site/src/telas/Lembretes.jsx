// Segue: fluxo-do-app.md, bloco 6, item "Lembretes": vê a lista, adiciona ou toca em um para editar,
// escolhe os dias e o horário do exercício. O aviso no horário marcado está em src/App.jsx.
// Na v1 só avisa com o app aberto. TODO (fluxo-do-app.md, ponto em aberto 4): confirmar que é isso que a v1 entrega.
import { CheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import AcoesDuplas from '../componentes/AcoesDuplas.jsx'
import Botao from '../componentes/Botao.jsx'
import LinhaNavegacao from '../componentes/LinhaNavegacao.jsx'
import PainelInferior from '../componentes/PainelInferior.jsx'
import { DIAS, descreverDias, guardarLembretes, lerLembretes } from '../lembretes.js'

const PASSO_MIN = 30 // o horário muda de 30 em 30 minutos, sem seletor de rolagem (design system 6.3)
const DESFAZER_MS = 8000

const paraMinutos = (hora) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3))
const paraHora = (min) => {
  const m = ((min % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export default function Lembretes({ onVoltar }) {
  const [lista, setLista] = useState(lerLembretes)
  const [editando, setEditando] = useState(null) // null = lista; senão { id, dias, hora }
  const [apagado, setApagado] = useState(null) // { lembrete, posicao }, para o "Desfazer" de 8 s

  useEffect(() => {
    if (!apagado) return undefined
    const id = setTimeout(() => setApagado(null), DESFAZER_MS)
    return () => clearTimeout(id)
  }, [apagado])

  const salvarLista = (nova) => {
    setLista(nova)
    guardarLembretes(nova)
  }

  // Edição de um lembrete: dias e horário
  if (editando) {
    const alternarDia = (d) =>
      setEditando({ ...editando, dias: editando.dias.includes(d) ? editando.dias.filter((x) => x !== d) : [...editando.dias, d] })
    const mudarHora = (delta) => setEditando({ ...editando, hora: paraHora(paraMinutos(editando.hora) + delta) })
    const existe = lista.some((l) => l.id === editando.id)
    const semDia = editando.dias.length === 0

    return (
      <PainelInferior
        titulo="Lembrete"
        onFechar={() => setEditando(null)}
        rodape={
          <>
            {existe && (
              <Botao
                variante="vazado"
                onClick={() => {
                  setApagado({ lembrete: editando, posicao: lista.findIndex((l) => l.id === editando.id) })
                  salvarLista(lista.filter((l) => l.id !== editando.id))
                  setEditando(null)
                }}
              >
                Apagar
              </Botao>
            )}
            <AcoesDuplas
              voltar={{ rotulo: 'Voltar', onClick: () => setEditando(null) }}
              acao={{
                rotulo: 'Salvar',
                desativado: semDia,
                onClick: () => {
                  salvarLista(existe ? lista.map((l) => (l.id === editando.id ? editando : l)) : [...lista, editando])
                  setEditando(null)
                },
              }}
            />
          </>
        }
      >
        <h2 className="conectar-titulo">Quais dias?</h2>
        <div className="dias">
          {DIAS.map((nome, d) => {
            const ligado = editando.dias.includes(d)
            return (
              <button
                key={nome}
                type="button"
                className={`dia${ligado ? ' dia--ligado' : ''}`}
                aria-pressed={ligado}
                onClick={() => alternarDia(d)}
              >
                {ligado && <CheckIcon className="icone dia-marca" aria-hidden="true" />}
                {nome}
              </button>
            )
          })}
        </div>
        {semDia && <p className="botao-motivo">Escolha pelo menos um dia.</p>}
        <h2 className="conectar-titulo">Que horas?</h2>
        <div className="hora">
          <Botao variante="vazado" onClick={() => mudarHora(-PASSO_MIN)}>
            −
          </Botao>
          <p className="hora-valor" aria-live="polite">
            {editando.hora}
          </p>
          <Botao variante="vazado" onClick={() => mudarHora(PASSO_MIN)}>
            +
          </Botao>
        </div>
      </PainelInferior>
    )
  }

  // Lista de lembretes
  return (
    <PainelInferior
      titulo="Lembretes"
      onFechar={onVoltar}
      rodape={
        <AcoesDuplas
          voltar={{ rotulo: 'Voltar', onClick: onVoltar }}
          acao={{ rotulo: 'Adicionar lembrete', onClick: () => setEditando({ id: Date.now(), dias: [1, 2, 3, 4, 5], hora: '08:00' }) }}
        />
      }
    >
      <h2 className="conectar-titulo">Lembretes</h2>
      {lista.length === 0 && <p className="conectar-texto estado-vazio">Você ainda não tem lembretes.</p>}
      {lista.length > 0 && (
        <div className="linhas">
          {lista.map((l) => (
            <LinhaNavegacao key={l.id} onClick={() => setEditando(l)}>
              {`${l.hora} · ${descreverDias(l.dias)}`}
            </LinhaNavegacao>
          ))}
        </div>
      )}
      {apagado && (
        <Botao
          variante="vazado"
          onClick={() => {
            const nova = [...lerLembretes()]
            nova.splice(apagado.posicao, 0, apagado.lembrete)
            salvarLista(nova)
            setApagado(null)
          }}
        >
          Lembrete apagado. Desfazer
        </Botao>
      )}
    </PainelInferior>
  )
}
