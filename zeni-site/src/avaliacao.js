// Avaliação simulada por regras simples (fluxo-do-app.md, 3.1 a 3.5). Sem IA de verdade na v1.
// Entrada: o resumo que o exercício entrega (amostras do "tamanho do movimento", de 0 a 100, a cada 250 ms).

export const AMOSTRAS_MINIMAS = 20 // menos de 5 s de movimento: curto demais para uma nota

const media = (v) => v.reduce((a, b) => a + b, 0) / (v.length || 1)
const limitar = (n) => Math.max(0, Math.min(100, Math.round(n)))

export function avaliar(resumo, metaAtual) {
  const { amostras, pausas, ritmoSeg } = resumo

  // 3.1: tamanho, suavidade e ritmo
  const tamanho = limitar(media(amostras))

  // suavidade: quanto menos a medida "pula" de uma amostra para a outra, mais suave
  const saltos = amostras.slice(1).map((v, i) => Math.abs(v - amostras[i]))
  const suavidade = limitar(100 - media(saltos) * 4)

  // ritmo: período estimado pelos cruzamentos da média, comparado com o ritmo guiado
  const m = media(amostras)
  let cruzamentos = 0
  for (let i = 1; i < amostras.length; i++) {
    if ((amostras[i - 1] - m) * (amostras[i] - m) < 0) cruzamentos += 1
  }
  const periodo = cruzamentos > 0 ? (amostras.length * 0.25 * 2) / cruzamentos : ritmoSeg * 2
  const ritmo = limitar(100 - (Math.abs(periodo - ritmoSeg) / ritmoSeg) * 100)

  // 3.2: nota de 0 a 100
  const nota = limitar(tamanho * 0.4 + suavidade * 0.3 + ritmo * 0.3)

  // 3.3: mostrou cansaço? O movimento diminuiu na segunda metade, ou houve várias pausas.
  const metade = Math.floor(amostras.length / 2)
  const primeira = media(amostras.slice(0, metade))
  const segunda = media(amostras.slice(metade))
  const cansaco = segunda < primeira * 0.85 || pausas >= 2

  // 3.4: mantém ou aumenta a meta aos poucos (só sem cansaço e com nota boa)
  const aumentou = !cansaco && nota >= 70
  const meta = aumentou ? Math.min(100, metaAtual + 5) : metaAtual

  return { tamanho, suavidade, ritmo, nota, cansaco, aumentou, meta }
}

// Palavras calmas, sem cobrança (design system, seção 10)
export const palavra = (valor) => (valor >= 70 ? 'bom' : valor >= 40 ? 'regular' : 'pequeno')

// Nota da série (3 exercícios): média de tamanho do movimento, suavidade e ritmo; nota com os mesmos pesos.
// Cansaço: dois ou mais exercícios mostraram cansaço.
export function avaliarSerie(exercicios, metaAtual) {
  const partes = exercicios.map((e) => avaliar(e, metaAtual))
  const m = (campo) => limitar(media(partes.map((p) => p[campo])))
  const tamanho = m('tamanho')
  const suavidade = m('suavidade')
  const ritmo = m('ritmo')
  const nota = limitar(tamanho * 0.4 + suavidade * 0.3 + ritmo * 0.3)
  const cansaco = partes.filter((p) => p.cansaco).length >= 2
  const aumentou = !cansaco && nota >= 70
  const meta = aumentou ? Math.min(100, metaAtual + 5) : metaAtual
  return { tamanho, suavidade, ritmo, nota, cansaco, aumentou, meta }
}
