// Instrução do exercício em animação: uma figura humana simples (SVG) segurando o ZENI.
// A instrução precisa ser entendida sem ler texto (decisão de 25/11). O ZENI é a silhueta do arquivo
// src/assets/zeni-silhueta.svg (não se carrega o modelo 3D no site).
// Cada exercício (A a F, catálogo em src/simulacao.js) tem a sua animação. Sem movimento (`parado`, "reduzir
// movimento"), a figura fica na pose do meio do movimento, sem animar.
// Ritmo (C e D): o pulso amarelo na tela marca o tempo. Sem luz, vibração ou som nesta versão.
import silhueta from '../assets/zeni-silhueta.svg'

const OMBRO = [158, 112]
const COTOVELO = [158, 174] // braço pendurado, sem rotação (comprimento do braço: 62)
const PUNHO = [158, 230] // antebraço de 56

const SPLINE = '0.45 0 0.55 1;0.45 0 0.55 1'
const rodar = (angulos, [cx, cy]) => angulos.map((a) => `${a} ${cx} ${cy}`).join(';')

// Anima um grupo SVG com valores a;b;a. `suave` usa curva de desaceleração; sem ela, velocidade constante.
function Anim({ tipo, valores, dur, suave = true, parado }) {
  if (parado) return null
  return (
    <animateTransform
      attributeName="transform"
      type={tipo}
      values={valores}
      dur={`${dur}s`}
      repeatCount="indefinite"
      calcMode={suave ? 'spline' : 'linear'}
      keyTimes="0;0.5;1"
      keySplines={suave ? SPLINE : undefined}
    />
  )
}

// O ZENI na mão, de pé. O ponto (0,0) é a mão.
function ZeniNaMao({ children }) {
  return (
    <g>
      <image href={silhueta} x="-15" y="-40" width="30" height="76" />
      <ellipse className="fig-mao" cx="0" cy="14" rx="11" ry="12" />
      {children}
    </g>
  )
}

function Seta({ d, cabecas }) {
  return (
    <g className="fig-seta">
      <path d={d} />
      {cabecas.map((c, i) => (
        <path key={i} d={c} className="fig-seta-ponta" />
      ))}
    </g>
  )
}

function Corpo({ estatico = true }) {
  return (
    <g>
      <rect className="fig-corpo" x="78" y="96" width="84" height="176" rx="34" />
      <circle className="fig-corpo" cx="120" cy="54" r="28" />
      {estatico && <line className="fig-braco fig-braco--parado" x1="86" y1="116" x2="68" y2="196" />}
    </g>
  )
}

function Pulso({ ritmoSeg, parado }) {
  return (
    <circle
      className={`fig-pulso${parado ? '' : ' fig-pulso--anima'}`}
      style={{ '--fig-ritmo': `${ritmoSeg}s` }}
      cx="252"
      cy="44"
      r="26"
    />
  )
}

// A: cotovelo dobrado, ZENI de pé; o antebraço gira junto e a palma vira para cima e para baixo.
// Ao lado da figura, uma vista de cima do ZENI: um círculo com um ponto (o polegar) que percorre um arco de
// cerca de 140 graus, indo e voltando, no ritmo do giro do punho. Sem seta (decisão de 25/11).
// E: o mesmo movimento, com repetição constante, sem variar a velocidade, e 15 pontos que acendem um a um.
const DIAL = [250, 178]
const DIAL_R = 38
const ARCO = 70 // metade de 140 graus

function VistaDeCima({ parado, constante, periodo }) {
  const [cx, cy] = DIAL
  const ponto = (graus, raio) => {
    const r = ((graus - 90) * Math.PI) / 180 // 0 graus = em cima
    return [cx + raio * Math.cos(r), cy + raio * Math.sin(r)]
  }
  const [x1, y1] = ponto(-ARCO, DIAL_R + 10)
  const [x2, y2] = ponto(ARCO, DIAL_R + 10)
  return (
    <g>
      <path className="fig-trilha" d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${DIAL_R + 10} ${DIAL_R + 10} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`} />
      <circle className="fig-dial" cx={cx} cy={cy} r={DIAL_R} />
      <g>
        <Anim tipo="rotate" valores={rodar([ARCO, -ARCO, ARCO], DIAL)} dur={periodo} suave={!constante} parado={parado} />
        <circle className="fig-polegar" cx={cx} cy={cy - DIAL_R + 11} r="8" />
      </g>
    </g>
  )
}

function GirarPunho({ parado, constante, periodo }) {
  const ang = [-30, 210]
  return (
    <>
      <Corpo />
      <g transform={`rotate(${ang[0]} ${OMBRO.join(' ')})`}>
        <line className="fig-braco" x1={OMBRO[0]} y1={OMBRO[1]} x2={COTOVELO[0]} y2={COTOVELO[1]} />
        <g transform={`rotate(${ang[1]} ${COTOVELO.join(' ')})`}>
          <line className="fig-braco" x1={COTOVELO[0]} y1={COTOVELO[1]} x2={PUNHO[0]} y2={PUNHO[1]} />
          {/* o antebraço gira junto: a faixa clara muda de lado enquanto a palma vira */}
          <g>
            <Anim tipo="translate" valores="5 0;-5 0;5 0" dur={periodo} suave={!constante} parado={parado} />
            <line className="fig-faixa" x1={COTOVELO[0]} y1={COTOVELO[1] + 8} x2={PUNHO[0]} y2={PUNHO[1] - 10} />
          </g>
          <g transform={`translate(${PUNHO.join(' ')}) rotate(${-(ang[0] + ang[1])})`}>
            <ZeniNaMao>
              <g>
                <Anim tipo="scale" valores="1 1;-1 1;1 1" dur={periodo} suave={!constante} parado={parado} />
                <circle className="fig-polegar" cx="11" cy="8" r="5" />
              </g>
            </ZeniNaMao>
          </g>
        </g>
      </g>
      <VistaDeCima parado={parado} constante={constante} periodo={periodo} />
      {constante && <Repeticoes parado={parado} periodo={periodo} />}
    </>
  )
}

function Repeticoes({ parado, periodo }) {
  const total = 15
  return (
    <g>
      {Array.from({ length: total }, (_, i) => (
        <circle key={i} className="fig-ponto" cx={36 + i * 16.5} cy="270" r="5" opacity={parado ? 1 : 0.25}>
          {!parado && (
            <animate
              attributeName="opacity"
              values="0.25;0.25;1;1"
              keyTimes={`0;${i / total};${i / total + 0.0001};1`}
              calcMode="discrete"
              dur={`${total * periodo}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </g>
  )
}

// B: do quadril até a altura do ombro e volta devagar (braço de lado)
function LevantarAteOmbro({ parado }) {
  const baixo = -12
  const alto = -88
  const meio = parado ? alto : baixo
  return (
    <>
      <Corpo />
      <path className="fig-trilha" d="M 182 227 A 118 118 0 0 0 276 112" />
      <g transform={`rotate(${meio} ${OMBRO.join(' ')})`}>
        <Anim tipo="rotate" valores={rodar([baixo, alto, baixo], OMBRO)} dur={4.5} parado={parado} />
        <line className="fig-braco" x1={OMBRO[0]} y1={OMBRO[1]} x2={COTOVELO[0]} y2={COTOVELO[1]} />
        <line className="fig-braco" x1={COTOVELO[0]} y1={COTOVELO[1]} x2={PUNHO[0]} y2={PUNHO[1]} />
        <g transform={`translate(${PUNHO.join(' ')})`}>
          <g transform={`rotate(${-meio})`}>
            <Anim tipo="rotate" valores={rodar([-baixo, -alto, -baixo], [0, 0])} dur={4.5} parado={parado} />
            <ZeniNaMao />
          </g>
        </g>
      </g>
    </>
  )
}

// C: pequenas flexões do punho no tempo do pulso amarelo
function NoRitmo({ parado, ritmoSeg }) {
  const ang = [-30, 210]
  return (
    <>
      <Corpo />
      <g transform={`rotate(${ang[0]} ${OMBRO.join(' ')})`}>
        <line className="fig-braco" x1={OMBRO[0]} y1={OMBRO[1]} x2={COTOVELO[0]} y2={COTOVELO[1]} />
        <g transform={`rotate(${ang[1]} ${COTOVELO.join(' ')})`}>
          <line className="fig-braco" x1={COTOVELO[0]} y1={COTOVELO[1]} x2={PUNHO[0]} y2={PUNHO[1]} />
          <g transform={`translate(${PUNHO.join(' ')}) rotate(${-(ang[0] + ang[1])})`}>
            <g>
              <Anim tipo="rotate" valores={rodar([-16, 16, -16], [0, 18])} dur={ritmoSeg} parado={parado} />
              <ZeniNaMao />
            </g>
          </g>
        </g>
      </g>
      <Pulso ritmoSeg={ritmoSeg} parado={parado} />
    </>
  )
}

// D: o ZENI sobe um pouco e volta a tocar a mesa, no tempo do pulso
function TocarNaMesa({ parado, ritmoSeg }) {
  const u = -20
  const f = -70 // antebraço na horizontal, apontando para a direita
  return (
    <>
      <Corpo />
      <g transform={`rotate(${u} ${OMBRO.join(' ')})`}>
        <line className="fig-braco" x1={OMBRO[0]} y1={OMBRO[1]} x2={COTOVELO[0]} y2={COTOVELO[1]} />
        <g transform={`rotate(${f} ${COTOVELO.join(' ')})`}>
          <line className="fig-braco" x1={COTOVELO[0]} y1={COTOVELO[1]} x2={PUNHO[0]} y2={PUNHO[1]} />
          <g transform={`translate(${PUNHO.join(' ')}) rotate(${-(u + f)})`}>
            <g>
              <Anim tipo="translate" valores="0 0;0 -26;0 0" dur={ritmoSeg} parado={parado} />
              <ZeniNaMao />
            </g>
          </g>
        </g>
      </g>
      <rect className="fig-mesa" x="40" y="203" width="260" height="12" rx="4" />
      <Pulso ritmoSeg={ritmoSeg} parado={parado} />
    </>
  )
}

// F: visto de cima. O antebraço apoiado na mesa vai de um lado para o outro, sem parar no meio
function LadoALado({ parado }) {
  const cot = [200, 196]
  return (
    <>
      <rect className="fig-mesa-topo" x="40" y="30" width="230" height="196" rx="20" />
      <rect className="fig-corpo" x="98" y="228" width="104" height="40" rx="20" />
      <circle className="fig-corpo" cx="150" cy="276" r="24" />
      <line className="fig-braco fig-braco--parado" x1="110" y1="244" x2="100" y2="200" />
      <line className="fig-braco" x1="190" y1="244" x2={cot[0]} y2={cot[1]} />
      <g>
        <Anim tipo="rotate" valores={rodar([-38, 38, -38], cot)} dur={2.6} parado={parado} />
        <line className="fig-braco" x1={cot[0]} y1={cot[1]} x2={cot[0]} y2={cot[1] - 62} />
        <g transform={`translate(${cot[0]} ${cot[1] - 62})`}>
          <image href={silhueta} x="-13" y="-48" width="26" height="66" />
          <ellipse className="fig-mao" cx="0" cy="6" rx="12" ry="12" />
        </g>
      </g>
      <Seta
        d="M 96 52 L 190 52"
        cabecas={['M 88 52 L 100 44 L 100 60 Z', 'M 198 52 L 186 44 L 186 60 Z']}
      />
    </>
  )
}

const FIGURAS = {
  A: (p) => <GirarPunho {...p} periodo={3.2} />,
  B: (p) => <LevantarAteOmbro {...p} />,
  C: (p) => <NoRitmo {...p} />,
  D: (p) => <TocarNaMesa {...p} />,
  E: (p) => <GirarPunho {...p} constante periodo={2} />,
  F: (p) => <LadoALado {...p} />,
}

export default function FiguraExercicio({ exercicio, ritmoSeg = 1.6, parado = false }) {
  const Figura = FIGURAS[exercicio.id]
  return (
    <svg className="figura" viewBox="0 0 300 290" role="img" aria-label={`${exercicio.nome}: ${exercicio.legenda}`}>
      <Figura ritmoSeg={ritmoSeg} parado={parado} />
    </svg>
  )
}
