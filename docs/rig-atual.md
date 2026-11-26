# Rig atual do personagem (contrato do modelo)

Arquivo: `zeni-site/src/assets/zeni-personagem.glb`. Hoje ele vem do **Blender** (`zeni-site/scripts/fonte/zeni-personagem-blender.glb`, exportado por você a partir do rig gerado por código) e passa por quatro passos, que `scripts/montar-personagem.sh` roda em ordem (na pasta `zeni-site`): `alinhar-ossos.mjs`, `ajustar-clipes.mjs`, `adicionar-dedos.mjs` e `aplicar-ajustes.sh` (seção 12). O primeiro acerta os ossos do braço à malha (a malha do Blender tem os braços inclinados ~11° para dentro e os ossos estavam no lugar antigo; sem esse passo o ZENI sai da mão e o giro do punho gira fora do braço). O segundo reescreve as poses de A e D (seção 3). O terceiro cria os ossos dos dedos e a pegada do ZENI (seção 9). O ponto de partida é `node scripts/preparar-modelo.mjs`, que gera o rig e os clipes a partir de `scripts/fonte/wii-fit-camisa-lisa.glb` (saída em `scripts/zeni-personagem-gerado.glb`). Código que usa o arquivo: `zeni-site/src/componentes/PersonagemExercicio.jsx`.

**Durações dos clipes:** o arquivo do Blender tem clipes ~21% mais curtos (A 1,9 s, B 2,53 s, C 0,8 s, D 0,93 s, E 0,8 s, F 1,27 s). O componente ajusta o tempo de cada clipe às durações abaixo ao carregar (`DURACAO_CLIPE_S`), então a tabela da seção 3 continua valendo para o app.

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
| `A_girar_o_punho` | 2,4 s | 0,6 s e 1,8 s | **só o antebraço gira** em torno do próprio eixo (±55°, metade no antebraço e metade na mão); ombro, cotovelo (~100° interno) e posição da mão parados |
| `B_levantar_ate_o_ombro` | 3,2 s | 0 s e 1,6 s | braço 18°→26° para a frente, cotovelo 72°→118°: da cintura ao ombro |
| `C_no_ritmo` | 1,0 s | 0,25 s e 0,75 s | mão sobe e desce ±16° (desvio do punho) |
| `D_tocar_na_mesa` | 1,2 s | 0 s (apoio) e 0,6 s | **elevação grande**: cotovelo de ~155° (quase esticado, mão na mesa) a ~50° (mão perto do queixo) e volta; braço fixo a 44° à frente; o punho compensa para o ZENI ficar de pé na mesa e se inclinar um pouco no alto; sem giro do antebraço |
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

## 9. Dedos e pegada do ZENI (criados por `scripts/adicionar-dedos.mjs`)

O modelo do Blender tem a mão aberta e só o osso `Hand`. O script acrescenta, por mão, 4 ossos filhos de `Hand.X`: `Fingers.X` (os quatro dedos juntos, na linha dos nós), `FingersTip.X` (pontas), `Thumb.X` e `ThumbTip.X`. São 21 juntas no total.

- **Pesos:** os vértices da mão são divididos por posição: abaixo da linha dos nós, dedos; à frente (z), polegar; a palma continua no `Hand`.
- **Pegada:** cada clipe traz uma track constante de rotação (em torno do eixo z da mão) nesses ossos. Direita, segurando o ZENI: dedos 40° + 80° (relativos ao osso pai), polegar 25° + 40°. Esquerda, relaxada: 20°/25° e 8°/10°.
- **Socket:** `Socket.R` fica no centro da pegada (0,044 m para dentro do nó dos dedos, que é o raio do ZENI mais a meia espessura do dedo), do lado de dentro da palma. `POSICAO_ZENI` no componente é `[0, 0, 0]`.
- **Esmaecimento:** o material não esmaece vértices cujos ossos comecem por `Clavicle`, `UpperArm`, `Forearm`, `Hand`, `Fingers` ou `Thumb`. Ossos novos na mão precisam entrar nessa lista (`OSSOS_DO_BRACO`).
- **Contrato:** se o modelo vier do Blender já com dedos, o script `adicionar-dedos.mjs` deixa de ser necessário; o `Socket.R` deve ficar dentro da mão, e o eixo longo do ZENI é o eixo z da mão (cruza a palma).
- Limite: a pegada é a mesma em todos os exercícios (os dedos não se mexem durante o movimento).

## 10. Poses de A e D (scripts/ajustar-clipes.mjs)

A e D foram redesenhados para serem bem diferentes: A é rotação parada (o ZENI gira na mão, no mesmo lugar); D é elevação grande (movimento vertical). Os ângulos de cotovelo do script são o ângulo interno (180° = esticado). Os valores ficam no topo do script (`A` e `D`). Durações e loop não mudam. B, C, E e F não foram alterados.

## 11. Clipes novos G, H e I (scripts/ajustar-clipes.mjs)

Três clipes além dos seis, mesma estrutura (mesmos ossos, 30 fps, 2,4 s de ciclo, primeira chave igual à última). **Ainda não estão ligados ao catálogo** (`simulacao.js`) nem ao `CLIPES` do componente: o app os ignora até o grupo decidir o catálogo.

| Clipe | O que faz |
|---|---|
| `G_virar_a_mao_esticada` | braço esticado para o lado, na altura do ombro, cotovelo ~165°, parado; só o antebraço gira (±55°) |
| `H_circulo_com_o_pulso` | cotovelo parado a ~100°; o punho faz um círculo contínuo (flexão ±28° e desvio ±20° defasados de 90°, mais ±15° de giro); sem pausa nas pontas |
| `I_alcancar_a_frente` | da mão perto do corpo (cotovelo ~90°) até o braço esticado na horizontal à frente (~165°) e volta; o oposto do D |

Ângulos e duração no topo do bloco "clipes novos" do script (`G`, `H`, `I`, `DUR_NOVOS`).

## 12. Ajustes de forma: queixo, ombros e sovaco (scripts/aplicar-ajustes.sh)

`adicionar-dedos.mjs` grava o modelo sem ajustes em `scripts/fonte/zeni-personagem-montado.glb`. `aplicar-ajustes.sh` abre essa base no Blender (sem janela) com `scripts/abrir-no-blender.py`, aplica os ajustes de forma e troca **só as posições e normais dos vértices movidos** em `src/assets/zeni-personagem.glb`. Ossos, pesos, clipes e nós ficam idênticos (por isso não se usa o File > Export do Blender, que muda a orientação dos ossos e reamostra os clipes).

- **Queixo** (`QUEIXO*`): o giro de 66° da cabeça (seção 1, passo 3) pegava a mandíbula só em parte e o canto dela ficava puxado para a direita; o ajuste completa o giro na mandíbula, sem tocar nuca, cabelo e olhos.
- **Ombros** (`OMBROS_DESCER`, `OMBROS_PESCOCO`, `OMBROS_PONTA`, `OMBROS_ESTREITAR`): descem os ombros (~3,5 cm) e mais a ponta do ombro (~2 cm), e a base do pescoço pela metade; a ponta do ombro e o alto do braço vêm ~4 cm para dentro. Queixo, orelhas e cabelo ficam, o pescoço alonga.
- **Sovaco** (`SOVACO_DESCER` negativo sobe, `SOVACO_TRONCO`): sobe ~1 cm, não afasta o braço e alarga a lateral do tronco embaixo dele (~5 cm no centro), fechando o vão entre braço e tronco.
- **Sovaco** (`SOVACO_*`) e **braços** (`BRACOS_JUNTAR`, hoje 0: girar só a malha quebra as mãos nos clipes).
- Para mudar: editar os valores no topo de `abrir-no-blender.py` e rodar `sh scripts/aplicar-ajustes.sh` na pasta `zeni-site`. Se o modelo for remontado, `montar-personagem.sh` já roda este passo no fim.
