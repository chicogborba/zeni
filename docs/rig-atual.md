# Rig atual do personagem (contrato do modelo)

Arquivo: `zeni-site/src/assets/zeni-personagem.glb`. **É gerado**, não editado à mão: `node scripts/preparar-modelo.mjs` (na pasta `zeni-site`) lê `zeni-site/scripts/fonte/wii-fit-camisa-lisa.glb` e escreve o `.glb`. Código que o usa: `zeni-site/src/componentes/PersonagemExercicio.jsx`.

O modelo de origem ("Wii fit - camisa lisa.glb") é uma malha **estática**: sem ossos, sem animações, em pose de ioga (pernas em afundo, braços abertos, cabeça virada de lado), com 4 texturas e a extensão `pbrSpecularGlossiness`. Tudo abaixo foi acrescentado por código, sem editar o arquivo de origem. **Autoria e licença do modelo de origem: a confirmar antes da entrega.** (O personagem anterior, Character Base de madtrollstudio, está em `scripts/fonte/zeni-personagem-v1.glb` só como referência.)

## 1. O que o script faz com a malha

1. **Solda** os vértices repetidos (a origem tem 33.849 vértices soltos, sem índices).
2. **Corta da cintura para baixo:** sai todo triângulo cujo ponto mais alto fica abaixo de y = 9,5 (origem). Pernas e pés (peças soltas) saem.
3. **Vira a cabeça para a frente:** na origem o rosto olha para +x; gira 66° em torno do eixo do pescoço (o rosto olhava uns 24° para dentro). Cabelo, rosto e olhos giram inteiros; o miolo do pescoço torce devagar com a altura; a mandíbula gira inteira acima dos ombros.
4. **Baixa os braços:** de "T" para pendurados (rotação em torno do ombro, mistura suave no ombro, por braço, a partir do eixo medido de cada braço). Sem isso o braço não chega à pose neutra.
5. **Escala** para metros (× 0,09) e põe a origem na cintura.
6. **Pesos de pele:** tronco por altura; braço por distância ao longo do eixo (ombro → cotovelo → punho → mão), com mistura de 0,55 (unidades de origem) nas dobras.
7. **Normais** suaves, calculadas no script. Sem texturas nem UVs: o material é o do código.
8. **Clipes A–F** por código (seção 3).

## 2. Ossos (hierarquia e nomes exatos)

Um único esqueleto (`skin` "Esqueleto", 13 juntas, `skeleton` = `Hips`). Rotações de repouso: **identidade em todos** (os eixos locais são os do mundo; o braço pendurado aponta para −y). Só há translações. Valores: translação local em metros.

```
Hips            (0, 0, 0)                      origem na cintura
└─ Spine        (0, 0.144, 0)
   └─ Chest     (0, 0.135, 0)
      ├─ Neck   (0.012, 0.117, -0.029)
      │  └─ Head  (0, 0.063, 0)
      ├─ Clavicle.L  (0.050, 0.081, 0)
      │  └─ UpperArm.L  (0.152, -0.053, -0.059)
      │     └─ Forearm.L  (0.022, -0.269, 0)
      │        └─ Hand.L  (0.020, -0.251, 0)
      │           └─ Socket.L  (0.006, -0.072, 0)
      └─ Clavicle.R  (-0.050, 0.081, 0)
         └─ UpperArm.R  (-0.153, -0.053, -0.093)
            └─ Forearm.R  (-0.022, -0.269, 0)
               └─ Hand.R  (-0.020, -0.251, 0)
                  └─ Socket.R  (-0.006, -0.072, 0)
```

Mais um nó `Corpo` (malha + skin), irmão de `Hips` (`scenes[0].nodes = [Hips, Corpo]`).

- **Obrigatórios por nome**, lidos pelo código: `Socket.R` (onde o ZENI entra), os ossos `Clavicle`, `UpperArm`, `Forearm`, `Hand` (o código os reconhece pelo prefixo para o esmaecimento) e `Hips`, `Spine`, `Chest`, `Neck`, `Head` (tracks desses cinco são filtradas).
- O GLTFLoader do three tira o ponto dos nomes (`Socket.R` vira `SocketR`); o código aceita os dois.
- Direita/esquerda são do personagem: o lado direito fica em x negativo (o personagem olha para +z). O exercício é do braço direito.
- Sem ossos de dedos, pernas, cabelo ou rosto. `Clavicle.*` existe mas não recebe peso de pele nem animação.
- Os `Socket.*` são nós vazios, filhos das mãos. Hoje ficam a 0,072 m do punho, ao longo do braço.

## 3. Clipes de animação

Seis clipes, 30 fps, só tracks de `rotation` (quaternion), interpolação LINEAR (amostragem densa), em loop (última chave = primeira). Nenhuma track de translação ou escala. **Gerados por código** em `preparar-modelo.mjs` (tabela `CLIPES`), com seno e cosseno (já suaves, velocidade zero nas viradas).

Tracks (as mesmas 8 em todos): `UpperArm.R`, `Forearm.R`, `Hand.R`, `Clavicle.R` e o braço esquerdo, fixo (`UpperArm.L`, `Forearm.L`, `Hand.L`, `Clavicle.L`). **Não há tracks de `Hips`, `Spine`, `Chest`, `Neck` nem `Head`**: tronco, pescoço e cabeça ficam parados na pose de repouso. (O código ainda filtra essas tracks ao carregar, para valer também se o arquivo for trocado.)

| Clipe | Duração | Viradas (velocidade zero) | O que move (braço direito) |
| ----- | ------- | ------------------------- | -------------------------- |
| `A_girar_o_punho` | 2,4 s | 0,6 s e 1,8 s | giro do antebraço e da mão em torno do próprio eixo, ±70° (palma para cima e para baixo) |
| `B_levantar_ate_o_ombro` | 3,2 s | 0 s e 1,6 s | braço 18°→26° para a frente, cotovelo 72°→118°: da cintura ao ombro |
| `C_no_ritmo` | 1,0 s | 0,25 s e 0,75 s | mão sobe e desce ±16° (desvio do punho) |
| `D_tocar_na_mesa` | 1,2 s | 0 s (apoio) e 0,6 s | cotovelo 40°→66°; a mão compensa para o ZENI ficar de pé; braço fixo a 35° |
| `E_mesma_forca_ate_o_fim` | 1,0 s | 0,25 s e 0,75 s | giro do punho ±45° (toca a 0,5×: 2 s por repetição) |
| `F_lado_a_lado` | 1,6 s | 0,4 s e 1,2 s | braço inteiro gira em torno da vertical, de −12° a +30° (passa pelo centro do corpo); antebraço apoiado na horizontal |

- **Pose neutra** (t = 0 de A, C e E; começo e fim dos outros): braço relaxado ao lado, 18° à frente e 6° para fora; cotovelo 72° (antebraço à frente, na altura da cintura); mão em "aperto de mão" (polegar para cima, palma para dentro); ZENI de pé.
- **Braço esquerdo**, fixo em todos os clipes: 14° à frente, 6° para fora, cotovelo 75°.
- C (1,0 s) e D (1,2 s) têm de manter essa duração: o pulso amarelo da tela usa o mesmo período (`ritmoSeg` em `simulacao.js`).
- O código remapeia o tempo (`CALMA` no componente): velocidade menor, pausas nas viradas de A e B e partida gradual. **As viradas acima são parte do contrato**; se mudarem, ajustar `CALMA`.
- Para mudar um ângulo: editar a função `pose` do clipe em `scripts/preparar-modelo.mjs` e rodar o script de novo. Convenção das rotações: `flex` sobe o osso para a frente, `abd` afasta do corpo, `giro` gira em torno do eixo do osso, `guinada` gira em torno da vertical.

## 4. Materiais

Um material no arquivo (`Suave`, cor 0,93/0,95/0,96, roughness 1, metallic 0, opaco). **O código o ignora** e cria o seu (`materialDoCorpo`): `MeshStandardMaterial`, cor do token `--brand-porcelana`, roughness 1, metalness 0, `DoubleSide`, `transparent: true`, com esmaecimento da cintura por vértice (atributo `fade`): opaco acima de 0,14 m, some em −0,03 m, e `Clavicle*`, `UpperArm*`, `Forearm*`, `Hand*` nunca esmaecem. O ZENI tem material próprio (`--brand-bruma`).

Cabelo, rosto, olhos, pele e roupa têm, portanto, **a mesma cor**: as 4 texturas e as cores do modelo de origem não são usadas (decisão: só cores dos tokens). Se o grupo quiser cabelo ou roupa em cor própria, é preciso mapear partes da malha a materiais (hoje é uma malha só).

## 5. Malha

- 1 malha (`Corpo`), 1 primitiva, 4.590 vértices, 8.946 triângulos (índices de 16 bits), ~305 KB.
- Atributos: `POSITION`, `NORMAL`, `JOINTS_0`, `WEIGHTS_0`. Sem UV nem textura.
- Caixa na pose de repouso (braços pendurados): x −0,28 a 0,275; y −0,42 a 0,69; z −0,24 a 0,15. Na pose neutra o corpo vai de y ≈ −0,1 (cintura, onde esmaece) a 0,69 (topo da cabeça).
- A origem tem a barra da cintura recortada (borda irregular): o esmaecimento a esconde. Sem dedos articulados: a mão é aberta e o ZENI passa por ela.

## 6. Escala e orientação

- 1 unidade = 1 m; personagem de ~1,66 m de altura total (a mão tem ~0,2 m e o ZENI, 0,16 m, cabem). Da cintura ao topo da cabeça: 0,69 m.
- Eixos: y para cima, o personagem olha para **+z**, o lado direito dele fica em **−x**. Sem rotação nem escala nos nós. Origem = cintura.
- Câmera (`VISTA` no componente): posição (−0,85; 0,64; 2,15), olhando (−0,05; 0,34; 0,15), fov 29. Em áreas largas e baixas (tela de instrução) o componente aproxima a câmera até 22%.

## 7. Como o ZENI é preso à mão

- Objeto criado por código (`criarZeni`, `LatheGeometry` com o perfil em mm, escala 0,001); entra como **filho do nó `Socket.R`**.
- **Rotação calculada ao carregar** (`encaixarZeni`): com o clipe A em t = 0, o ZENI é girado no `Socket.R` até o eixo longo ficar na vertical do mundo. Não há ângulos fixos: se o `Socket.R` ou a pose neutra mudar, o encaixe se recalcula.
- **Posição:** `POSICAO_ZENI = [0, 0, 0]` no espaço do `Socket.R` (ajuste fino dentro da mão).
- **Mesa (D e F):** o código mede a altura mais baixa da base do ZENI varrendo o clipe (`medirMesa`) e desenha ali a linha da mesa.

## 8. Contrato para trocar o modelo de novo

1. Mesmos nomes de ossos e de clipes, com os mesmos tempos de virada e durações (seção 3).
2. Repouso com rotações identidade, braço pendurado, e pose neutra em t = 0 dos clipes A, C e E.
3. Sem tracks em `Hips`, `Spine`, `Chest`, `Neck`, `Head`.
4. Escala em metros, origem na cintura, olhando para +z, direita em −x.
5. Fechado ou coberto no pescoço, punhos e cintura, ou o esmaecimento e o `DoubleSide` escondem as bordas.
6. Se o modelo vier já riggado (por exemplo, no Blender), basta substituir `src/assets/zeni-personagem.glb`; o script `preparar-modelo.mjs` deixa de ser necessário.
