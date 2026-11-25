# Rig atual do personagem (contrato para o modelo novo)

Arquivo: `zeni-site/src/assets/zeni-personagem.glb` (gerado pelo script "zeni rig (numpy)", versão 2.0, malha base Character Base, madtrollstudio, licença a confirmar). Código que o usa: `zeni-site/src/componentes/PersonagemExercicio.jsx`.

O modelo novo (mais suave, com cabelo, rosto e roupa) deve seguir tudo o que está abaixo. O que for "obrigatório" é lido por nome no código; o resto é medida de enquadramento.

## 1. Ossos (hierarquia e nomes exatos)

Um único esqueleto (`skin` "Esqueleto", 13 juntas, `skeleton` = `Hips`). Todas as rotações de repouso são identidade; só há translações. Valores abaixo: translação local, em unidades do modelo (1 unidade = 1 m).

```
Hips            (0, 0, 0)
└─ Spine        (0, 0.25, 0)
   └─ Chest     (0, 0.27, -0.01)
      ├─ Neck   (0, 0.25, 0.02)
      │  └─ Head  (0, 0.07, 0.01)
      ├─ Clavicle.L  (0.03, 0.10, -0.01)
      │  └─ UpperArm.L  (0.19, -0.04, -0.02)
      │     └─ Forearm.L  (0.15, -0.25, 0.01)
      │        └─ Hand.L  (0.12, -0.20, 0.15)
      │           └─ Socket.L  (0.018, -0.063, 0.018)
      └─ Clavicle.R  (-0.03, 0.10, -0.01)
         └─ UpperArm.R  (-0.19, -0.04, -0.02)
            └─ Forearm.R  (-0.15, -0.25, 0.01)
               └─ Hand.R  (-0.12, -0.20, 0.15)
                  └─ Socket.R  (-0.018, -0.063, 0.018)
```

Mais um nó `Corpo` (a malha, com a skin), irmão de `Hips` na cena (`scenes[0].nodes = [Hips, Corpo]`).

- Não há ossos de dedos, de pernas, de cabelo nem de rosto. O modelo é da cintura para cima.
- **Obrigatórios por nome:** `Hips`, `Spine`, `Chest`, `Neck`, `Head`, `Clavicle.R`, `UpperArm.R`, `Forearm.R`, `Hand.R`, `Socket.R` (o exercício é do braço direito) e `Socket.L`, `Clavicle.L`, `UpperArm.L`, `Forearm.L`, `Hand.L` (o braço esquerdo fica em pose fixa).
- O GLTFLoader do three tira o ponto dos nomes (`Socket.R` vira `SocketR`); o código aceita os dois. Se o modelo novo trouxer ossos novos (cabelo, roupa), eles não podem ter esses nomes e **não devem ter tracks nos clipes** (ver seção 2).
- Direita/esquerda são do personagem: o lado direito fica em x negativo (o personagem olha para +z).

### Os `Socket.*`
Nós vazios (sem malha) filhos das mãos, marcando a palma. O ZENI entra como filho de `Socket.R` (seção 6). Se a posição ou a orientação de `Socket.R` mudar no modelo novo, o encaixe do ZENI precisa ser recalculado.

## 2. Clipes de animação

Seis clipes, 30 fps, só tracks de `rotation` (quaternion), interpolação LINEAR (amostragem densa, já suave), em loop. Nenhuma track de translação nem de escala.

| Clipe | Duração | Chaves | Onde a velocidade é zero (viradas) | Ossos que se movem |
| ----- | ------- | ------ | ---------------------------------- | ------------------ |
| `A_girar_o_punho` | 2,4 s | 73 | 0,6 s e 1,8 s (punho neutro em 0 s e 1,2 s) | `Forearm.R` (28°), `Hand.R` (42°) |
| `B_levantar_ate_o_ombro` | 3,2 s | 97 | 0 s (repouso) e 1,6 s (ombro) | `UpperArm.R` (85°), `Forearm.R` (32°) |
| `C_no_ritmo` | 1,0 s | 31 | 0,25 s e 0,75 s | `Forearm.R` (19°) |
| `D_tocar_na_mesa` | 1,2 s | 37 | 0 s (apoio) e 0,6 s | `UpperArm.R` (20°), `Forearm.R` (20°) |
| `E_mesma_forca_ate_o_fim` | 1,0 s | 31 | 0,25 s e 0,75 s | `Forearm.R` (28°), `Hand.R` (42°) |
| `F_lado_a_lado` | 1,6 s | 49 | 0,38 s e 1,18 s | `Forearm.R` (32°) |

(Ângulos = maior desvio da primeira chave.) Todos os clipes fecham o loop (última chave = primeira).

**Tracks em cada clipe (as mesmas 10 nos seis):** `Chest`, `Head`, `Clavicle.L`, `Clavicle.R`, `UpperArm.L`, `UpperArm.R`, `Forearm.L`, `Forearm.R`, `Hand.L`, `Hand.R`.
- `Chest` (0,8°) e `Head` (0,5°) só têm um balanço mínimo. **O código descarta no carregamento as tracks de `Hips`, `Spine`, `Chest`, `Neck` e `Head`** (decisão: coluna, peito, pescoço e cabeça ficam neutros e fixos). Os ossos que ficam sem track permanecem na rotação de repouso do nó (identidade).
- **O braço esquerdo não está no repouso: sua pose fica "assada" como track constante em todos os clipes** (`UpperArm.L` 26,4°, `Forearm.L` 22,0°, `Clavicle.L` e `Hand.L` em 0°). O modelo novo precisa ter o braço esquerdo solto, ao lado do corpo, nessa mesma pose (ou trazer a pose no clipe, como hoje).
- `UpperArm.R` fica constante em 24,1° nos clipes A, C, E e (quase) F; `Hand.R` fica em 0° em B, C, D e F. O braço direito começa em A, C, E com o cotovelo dobrado e o antebraço à frente.
- O código remapeia o tempo dos clipes (ver `CALMA` no componente): velocidade menor, pausas nas viradas e partida gradual. Por isso as **viradas acima são parte do contrato**: as pausas usam esses tempos. Se o clipe novo mudar os tempos, ajustar `CALMA` em `PersonagemExercicio.jsx`.
- C (1,0 s) e D (1,2 s) têm de manter essa duração: o pulso amarelo da tela usa o mesmo período (`ritmoSeg` em `simulacao.js`). E toca a 0,5× (2 s por repetição).
- Pose neutra em A, C e E (clipe em t = 0): punho neutro, ZENI de pé. O ponto neutro do giro fica no meio da faixa (de cerca de −89° a +53° no A, ou seja, 140° no total).

## 3. Materiais

Um só material no arquivo:

| Nome | Cor base (linear, RGBA) | metallic | roughness | emissive | alphaMode | doubleSided |
| ---- | ----------------------- | -------- | --------- | -------- | --------- | ----------- |
| `Suave` | 0,93 / 0,95 / 0,96 / 1 | 0 | 1 | 0 | OPAQUE | **false** |

Sem texturas, sem vertex colors, sem UVs, sem extensões glTF (`extensionsUsed` vazio).

**O código ignora esse material** e cria o seu (`materialDoCorpo`): `MeshStandardMaterial`, cor do token `--brand-porcelana`, roughness 1, metalness 0, **`DoubleSide`**, `transparent: true`, com o esmaecimento da cintura por vértice (atributo `fade`, calculado pelos pesos de pele; ossos `Clavicle*`, `UpperArm*`, `Forearm*`, `Hand*` nunca esmaecem). O ZENI tem material próprio (`brand-bruma`). Se o modelo novo trouxer vários materiais (pele, cabelo, roupa, olhos), o código precisa mudar para mapear material por nome; hoje todo `Mesh` recebe o mesmo material.

## 4. Malha

- 1 malha (`Corpo`), 1 primitiva, `TRIANGLES`, **2284 vértices, 1132 triângulos** (índices de 16 bits).
- Atributos: `POSITION`, `NORMAL`, `JOINTS_0` (ubyte), `WEIGHTS_0` (float). Sem UV.
- Caixa: x −0,529 a 0,529; y −0,020 a 1,020; z −0,136 a 0,205.
- A malha é uma **casca aberta**: braços, antebraços, mãos, pescoço e a borda da cintura não têm tampa nem espessura. Com face só de um lado o fundo aparece por dentro (por isso `DoubleSide`). No pescoço, vê-se o interior da casca. O modelo novo deve vir fechado (ou ao menos com o pescoço e os punhos cobertos pela roupa/cabelo).
- Normais: o código descarta as normais do arquivo e recalcula com `mergeVertices` + `computeVertexNormals` (suaviza a malha low poly). O modelo novo pode trazer normais boas e o código continua funcionando.

## 5. Escala e orientação

- Unidade: 1 = 1 m. Altura da cintura (`Hips` em y = 0) até o topo da cabeça: cerca de 1,02. O código assume essa escala para o ZENI (0,16 de comprimento) e para o enquadramento. (O pedido original citava um personagem de ~1,9 de altura inteiro; da cintura para cima são ~1,0.)
- Eixos: y para cima, o personagem olha para **+z**, o lado direito do personagem está em **−x**. Sem rotação nem escala nos nós; a origem é a cintura, no centro (x = 0, z ≈ 0).
- Pose de repouso: braços para baixo e levemente para fora (as translações de `UpperArm`/`Forearm`/`Hand` têm y negativo), mãos um pouco à frente (z +0,15).
- Enquadramento (`VISTA` no componente): câmera em (−0,9, 0,72, 2,15), olhando para (−0,1, 0,51, 0,2), fov 29. A cabeça tem de caber até y ≈ 1,0.

## 6. Como o ZENI é preso à mão

- **Por osso (nó), com ajuste manual:** o objeto é criado por código (`criarZeni`, `LatheGeometry` com o perfil em mm, escala 0,001, 48 segmentos, centrado) e entra como **filho do nó `Socket.R`** (`socket.add(zeni)`). Ele acompanha a mão pela hierarquia, sem constraint.
- **Encaixe final (espaço local do `Socket.R`):** posição `[0, 0, 0]`; rotação euler XYZ `[0.855, 0.121, 0.265]` rad. Está em `ENCAIXE` no componente.
- **Como foi achado:** no clipe A em t = 0 (punho neutro) o eixo longo do ZENI fica na vertical do mundo. No `Socket.R` atual, a vertical do mundo, escrita no espaço local, é (−0,26; 0,61; 0,75); a rotação leva o eixo Y do `LatheGeometry` até esse vetor (`Quaternion.setFromUnitVectors`).
- **No modelo novo:** se `Socket.R` mudar de orientação, repetir esse cálculo (amostrar o clipe A em t = 0, escrever a vertical do mundo no espaço do socket e recalcular a rotação). A posição provavelmente precisa de ajuste fino para o ZENI ficar dentro do punho (a malha atual não tem dedos que envolvam o ZENI).
- **Mesa (D e F):** o código mede a altura mais baixa da base do ZENI varrendo o clipe (`medirMesa`, 24 amostras) e desenha ali a linha da mesa. Não precisa de ossos nem de marcadores no modelo; basta o `Socket.R` se mover com o clipe.

## 7. O que o código faz com o modelo (resumo do contrato)

1. Carrega com `useGLTF` (sem Draco/Meshopt) e clona com `SkeletonUtils.clone`.
2. Troca o material do corpo pelo material próprio (seção 3) e recalcula as normais.
3. Filtra as tracks de `Hips`, `Spine`, `Chest`, `Neck`, `Head` dos seis clipes.
4. Prende o ZENI em `Socket.R` com o `ENCAIXE`.
5. Toca o clipe do exercício com `AnimationMixer`, com o tempo remapeado (`CALMA`) e `crossFadeTo` de 0,4 s entre exercícios.
6. Sem movimento ("reduzir movimento"): só a pose do clipe em t = 0, parada.
