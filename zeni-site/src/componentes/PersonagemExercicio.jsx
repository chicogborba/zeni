// "Como fazer" em 3D: um personagem da cintura para cima (src/assets/zeni-personagem.glb) com esqueleto e 6 animações em
// loop, uma por exercício (A a F, catálogo em src/simulacao.js). O exercício é feito com o braço direito; o nó Socket.R
// marca a palma da mão direita, e o ZENI entra como filho dele. A instrução precisa ser entendida sem ler texto.
// O ZENI é um LatheGeometry feito do perfil do modelo 3D (medidas em mm, escala 0,001). Não se carrega o STL.
// Aparência: material fosco (roughness 1), normais suavizadas, luz hemisférica + direcional fraca, sem sombras duras,
// fundo transparente, a cintura esmaecida por máscara em CSS. As cores vêm dos tokens (tokens.css).
// Sem movimento (`parado`, "reduzir movimento"): só a pose inicial, parada, e nada de loop de renderização.
// Aba oculta: a renderização pausa.
// Crédito do modelo base: Character Base, madtrollstudio (licença a confirmar). Ver docs/design-system.md.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clone as clonarComEsqueleto } from 'three/examples/jsm/utils/SkeletonUtils.js'
import modelo from '../assets/zeni-personagem.glb?url'

const CLIPES = {
  A: 'A_girar_o_punho',
  B: 'B_levantar_ate_o_ombro',
  C: 'C_no_ritmo',
  D: 'D_tocar_na_mesa',
  E: 'E_mesma_forca_ate_o_fim',
  F: 'F_lado_a_lado',
}
const COM_MESA = ['D', 'F'] // exercícios com a mesa desenhada
const FADE_S = 0.4 // troca de animação com crossFadeTo

// Perfil do ZENI: [z em mm da base ao topo, raio em mm]. Escala 0,001: 160 mm = 0,16 unidades.
const PERFIL_MM = [
  [0, 29.2], [10, 30.0], [20, 30.1], [30, 28.5], [40, 27.0], [50, 25.2], [60, 23.8], [70, 22.9], [80, 22.7],
  [90, 22.9], [100, 23.8], [110, 25.2], [120, 27.0], [130, 28.5], [140, 29.6], [150, 30.0], [160, 29.2],
]
const ESCALA = 0.001

// Encaixe do ZENI no Socket.R (espaço local do nó). Em A, C e E, com o punho neutro (t = 0 dos clipes), o eixo longo
// fica na vertical do mundo. Valores achados olhando o resultado, ver o relatório da fase.
const ENCAIXE = {
  posicao: [0, 0, 0],
  rotacao: [0.855, 0.121, 0.265], // euler XYZ, em radianos
}

// Câmera levemente de três quartos, enquadrando da cintura para cima
const VISTA = { posicao: [-0.9, 0.72, 2.15], alvo: [-0.1, 0.51, 0.2] }

const token = (nome) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim()

function criarZeni(cor) {
  const pontos = [new THREE.Vector2(0, 0), ...PERFIL_MM.map(([z, r]) => new THREE.Vector2(r * ESCALA, z * ESCALA)), new THREE.Vector2(0, 0.16)]
  let geo = new THREE.LatheGeometry(pontos, 48)
  geo.translate(0, -0.08, 0) // centro do ZENI na origem do encaixe
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo) // vértices unidos, para as normais ficarem suaves
  geo.computeVertexNormals()
  const material = new THREE.MeshStandardMaterial({ color: cor, roughness: 1, metalness: 0 })
  return new THREE.Mesh(geo, material)
}

// A altura mais baixa que a base do ZENI alcança em um clipe: onde a mesa fica (D e F).
function medirMesa(raiz, zeni, clip, socket) {
  const mixer = new THREE.AnimationMixer(raiz)
  mixer.clipAction(clip).play()
  const caixa = new THREE.Box3()
  const p = new THREE.Vector3()
  let achado = { y: Infinity, x: 0, z: 0 }
  for (let i = 0; i <= 24; i++) {
    mixer.setTime((clip.duration * i) / 24)
    raiz.updateMatrixWorld(true)
    caixa.setFromObject(zeni, true)
    if (caixa.min.y < achado.y) {
      socket.getWorldPosition(p)
      achado = { y: caixa.min.y, x: p.x, z: p.z }
    }
  }
  mixer.stopAllAction()
  mixer.uncacheClip(clip)
  mixer.uncacheRoot(raiz)
  return achado
}

function Personagem({ exercicio, parado, vista }) {
  const gltf = useGLTF(modelo, false, false)
  const invalidate = useThree((s) => s.invalidate)

  const { raiz, zeni, socket, corpos } = useMemo(() => {
    const raiz = clonarComEsqueleto(gltf.scene)
    const porcelana = token('--brand-porcelana')
    const corpos = []
    raiz.traverse((o) => {
      if (!o.isMesh) return
      const original = o.geometry
      const g = original.clone()
      g.deleteAttribute('normal')
      const suave = mergeVertices(g) // low poly sem facetas
      suave.computeVertexNormals()
      o.geometry = suave
      o.material = new THREE.MeshStandardMaterial({ color: porcelana, roughness: 1, metalness: 0 })
      corpos.push(o)
    })
    const socket = raiz.getObjectByName('SocketR') ?? raiz.getObjectByName('Socket.R') // o GLTFLoader tira o ponto do nome
    const zeni = criarZeni(token('--brand-bruma'))
    zeni.position.set(...ENCAIXE.posicao)
    zeni.rotation.set(...ENCAIXE.rotacao)
    socket.add(zeni)
    return { raiz, zeni, socket, corpos }
  }, [gltf])

  const mixer = useMemo(() => new THREE.AnimationMixer(raiz), [raiz])
  const atual = useRef(null)

  // Onde fica a mesa em D e F, medido no clipe
  const mesas = useMemo(() => {
    const m = {}
    for (const id of COM_MESA) m[id] = medirMesa(raiz, zeni, gltf.animations.find((c) => c.name === CLIPES[id]), socket)
    return m
  }, [raiz, zeni, socket, gltf])

  // Cada exercício toca o seu clipe, com crossFadeTo de 0,4 s ao trocar
  useEffect(() => {
    const clip = gltf.animations.find((c) => c.name === CLIPES[exercicio.id])
    const proxima = mixer.clipAction(clip)
    proxima.setLoop(THREE.LoopRepeat, Infinity)
    // E: mesma velocidade do começo ao fim, no ritmo do catálogo (ex.: 2 s por repetição)
    proxima.timeScale = exercicio.repeticoes && exercicio.ritmoSeg ? clip.duration / exercicio.ritmoSeg : 1
    proxima.reset().setEffectiveWeight(1).play()
    if (parado) {
      mixer.stopAllAction()
      proxima.reset().play()
      mixer.setTime(0) // pose inicial, parada
      proxima.paused = true
      atual.current = proxima
      invalidate()
      return
    }
    const anterior = atual.current
    if (anterior && anterior !== proxima) anterior.crossFadeTo(proxima, FADE_S, false)
    atual.current = proxima
    invalidate()
  }, [exercicio.id, exercicio.repeticoes, exercicio.ritmoSeg, gltf, mixer, parado, invalidate])

  useFrame((_, dt) => {
    if (!parado) mixer.update(Math.min(dt, 0.1))
  })

  useEffect(
    () => () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(raiz)
      zeni.geometry.dispose()
      zeni.material.dispose()
      for (const c of corpos) {
        c.geometry.dispose()
        c.material.dispose()
      }
    },
    [mixer, raiz, zeni, corpos],
  )

  // a linha corre na horizontal da tela (direção "direita" da câmera no chão), não na do mundo
  const fx = vista.alvo[0] - vista.posicao[0]
  const fz = vista.alvo[2] - vista.posicao[2]
  const angulo = -Math.atan2(fx, -fz)
  const mesa = COM_MESA.includes(exercicio.id) ? mesas[exercicio.id] : null
  const corMesa = useMemo(() => token('--cinza-300'), [])
  return (
    <>
      <primitive object={raiz} />
      {mesa && (
        // linha de mesa suave, na altura onde a base do ZENI toca no ponto mais baixo do movimento
        <mesh position={[mesa.x, mesa.y - 0.005, mesa.z]} rotation={[0, angulo, 0]}>
          <boxGeometry args={[1.4, 0.01, 0.01]} />
          <meshStandardMaterial color={corMesa} roughness={1} metalness={0} />
        </mesh>
      )}
    </>
  )
}

function Luzes() {
  const ceu = useMemo(() => token('--white'), [])
  const chao = useMemo(() => token('--cinza-100'), [])
  return (
    <>
      <hemisphereLight args={[ceu, chao, 2.3]} />
      <directionalLight position={[-1.2, 2, 2.2]} intensity={0.7} />
    </>
  )
}

export default function PersonagemExercicio({ exercicio, parado, pulso = false, vista = VISTA }) {
  const [visivel, setVisivel] = useState(() => !document.hidden)
  useEffect(() => {
    const f = () => setVisivel(!document.hidden)
    document.addEventListener('visibilitychange', f)
    return () => document.removeEventListener('visibilitychange', f)
  }, [])

  return (
    <div className="personagem" role="img" aria-label={`${exercicio.nome}: ${exercicio.legenda}`}>
      {pulso && (
        <div className="personagem-pulso andamento-bulb andamento-bulb--pulsa" style={{ '--guia-ritmo': `${exercicio.ritmoSeg}s`, '--amplitude': 0.5 }} aria-hidden="true" />
      )}
      <div className="personagem-quadro">
      <Canvas
        dpr={[1, 2]} // devicePixelRatio limitado a 2
        frameloop={parado ? 'demand' : visivel ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: vista.posicao, fov: 29, near: 0.1, far: 20 }}
        onCreated={({ camera }) => camera.lookAt(...vista.alvo)}
      >
        <Luzes />
        <Suspense fallback={null}>
          <Personagem exercicio={exercicio} parado={parado} vista={vista} />
        </Suspense>
      </Canvas>
      </div>
    </div>
  )
}
