# ZENI: Identidade Visual e Design System

Interface mobile (app e site) do ZENI, dispositivo de cuidado motor usado por pessoas com Parkinson e tremores. Este documento define cor, tipografia, espaço, componentes e regras de acessibilidade. As cores e os nomes vêm do arquivo "tec embutida" no Figma.

> **Atualização de 25/11.** As "Decisões do grupo (25/11)" em `docs/fluxo-do-app.md` valem mais que as regras deste documento. Três exceções às regras de menu, uma decisão por tela e bottom sheet: menu suspenso no avatar, exercício do dia em tela cheia e nota em modal centralizado. Bottom sheets se ajustam à altura do conteúdo. As seções 1 (princípio 2), 2.5, 6, 6.1, 6.2, 6.7, 6.8, 6.10, 6.11, 9 e 11 foram marcadas onde mudam. As seções 6.13 a 6.17 são novas.

---

## 1. Princípios

1. **Espaço em branco é conteúdo.** O vazio mostra o que importa e reduz a chance de erro de toque. Em dúvida, remova um elemento antes de reduzir o espaço.
2. **Uma decisão por tela.** Cada tela tem uma ação principal, grande e óbvia. Ações secundárias ficam abaixo e com menos cor, mas nunca menores que 64 px de altura. Não existem botões pequenos, abas nem barras de navegação. Menu só um: o suspenso do avatar (exceção de 25/11).
3. **Linguagem do usuário.** Nenhum termo técnico aparece na interface (ver glossário na seção 10).
4. **Feito para mão com tremor.** Alvos de toque grandes, sem gestos de precisão, sem tempo limite para decidir.
5. **Calma, não alarme.** Avisos informam e orientam. Não usam vermelho, piscadas ou mensagens de erro secas.

---

## 2. Cor

### 2.1 Cores de marca

| Grupo | Token | Hex | Papel |
|---|---|---|---|
| Amarelo | brand-amarelo-300 | `#F7ED7E` | Cor principal de ação (base da escala) |
| Blue | brand-blue-600 | `#0080B2` | Azul de marca: ícones grandes, barras de progresso, elementos gráficos |
| Bruma | brand-bruma | `#98B5BE` | Ilustração, mockups e superfícies decorativas |
| Seixo | brand-seixo | `#C4C4C4` | Divisores e placeholders |
| Porcelana | brand-porcelana | `#F5FAFE` | Fundo de cartões e áreas secundárias |

O branco puro (`#FFFFFF`) entra como fundo das telas, não como cor de marca.

**Sobre os nomes.** Bruma (névoa fina de manhã, azul acinzentado e suave) e Seixo (pedra lisa, feita para caber na mão) substituem "cimento-azul" e "cimento". Seixo conversa com a pega ergonômica do ZENI e com a porcelana: os três nomes falam de materiais lisos e limpos, não de uma cor.

### 2.2 Escalas

O número segue a regra do Figma: quanto maior, mais escuro.

**brand-amarelo**

| Token | Hex |
|---|---|
| brand-amarelo-50 | `#FEFDF1` |
| brand-amarelo-100 | `#FDFADD` |
| brand-amarelo-200 | `#FAF4AD` |
| brand-amarelo-300 | `#F7ED7E` |
| brand-amarelo-400 | `#F4E64D` |
| brand-amarelo-500 | `#F1E01D` |

**brand-blue**

| Token | Hex |
|---|---|
| brand-blue-50 | `#F0FBFF` |
| brand-blue-100 | `#E3F7FF` |
| brand-blue-200 | `#B3E9FF` |
| brand-blue-600 | `#0080B2` |
| brand-blue-700 | `#005B80` |
| brand-blue-800 | `#00374D` |

A escala azul não tem os passos 300, 400 e 500. Há um salto do azul claro (200) para o azul de marca (600). Criar os intermediários só quando um componente pedir (por exemplo, uma barra de progresso em dois tons).

**cinzas** (neutros, fora da marca; texto, bordas e fundos de apoio)

| Token | Hex |
|---|---|
| cinza-50 | `#F1F3F4` |
| cinza-100 | `#E6EAEA` |
| cinza-200 | `#CAD2D4` |
| cinza-300 | `#ADBABD` |
| cinza-400 | `#91A2A6` |
| cinza-500 | `#758B8F` |
| cinza-600 | `#5E7073` |
| cinza-700 | `#475557` |
| cinza-800 | `#30393B` |
| cinza-900 | `#1A1F20` |

No Figma, os quadrados dos cinzas têm contorno só para os tons claros aparecerem sobre o fundo. O contorno não faz parte do token.

### 2.3 Contraste (WCAG 2.2)

Razões calculadas com a fórmula de luminância relativa do WCAG. Mínimos: 4,5:1 para texto comum, 3:1 para texto grande (a partir de 24 px) e para bordas e ícones de componentes.

| Texto ou ícone | Fundo | Razão | Uso permitido |
|---|---|---|---|
| cinza-900 | white | 16.66 | Texto de qualquer tamanho |
| cinza-900 | brand-porcelana | 15.85 | Texto sobre cartão |
| cinza-900 | brand-blue-100 | 15.08 | Texto em aviso informativo |
| cinza-900 | brand-amarelo-100 | 15.78 | Texto de qualquer tamanho |
| cinza-900 | brand-amarelo-200 | 14.76 | Texto em aviso de atenção |
| cinza-900 | brand-amarelo-300 | 13.78 | Texto do botão principal |
| cinza-900 | brand-amarelo-400 | 12.91 | Texto do botão principal em toque |
| cinza-900 | brand-amarelo-500 | 12.23 | Texto sobre o amarelo mais forte |
| cinza-900 | brand-bruma | 7.68 | Texto sobre ilustração |
| cinza-900 | brand-seixo | 9.55 | Texto sobre placeholder |
| cinza-700 | white | 7.76 | Texto secundário |
| cinza-700 | brand-porcelana | 7.39 | Texto secundário sobre cartão |
| cinza-700 | brand-amarelo-100 | 7.36 | Texto secundário sobre amarelo claro |
| cinza-600 | white | 5.20 | Texto secundário de 18 px ou mais |
| cinza-600 | brand-porcelana | 4.95 | Texto secundário de 18 px ou mais |
| cinza-500 | white | 3.59 | Só texto grande, ícones e bordas de campo |
| cinza-500 | brand-porcelana | 3.42 | Só texto grande, ícones e bordas de campo |
| cinza-400 | white | 2.65 | Não usar como texto nem borda de campo |
| cinza-200 | white | 1.54 | Só decoração |
| brand-seixo | white | 1.74 | Só divisor decorativo |
| brand-bruma | white | 2.17 | Só decoração |
| brand-blue-600 | white | 4.44 | Só gráficos e texto grande (abaixo de 4,5) |
| brand-blue-600 | brand-porcelana | 4.23 | Só gráficos e texto grande (abaixo de 4,5) |
| brand-blue-700 | white | 7.48 | Links e texto azul |
| brand-blue-700 | brand-porcelana | 7.12 | Links sobre cartão |
| brand-blue-700 | brand-blue-100 | 6.77 | Ícone em aviso informativo |
| brand-blue-800 | brand-blue-100 | 11.50 | Texto da marca de IA |
| brand-blue-800 | white | 12.70 | Texto azul escuro |
| white | brand-blue-600 | 4.44 | Só texto grande sobre azul |
| white | brand-blue-700 | 7.48 | Texto sobre azul escuro |
| white | cinza-900 | 16.66 | Texto do botão secundário |
| white | cinza-700 | 7.76 | Texto em fundo escuro |
| brand-amarelo-300 | cinza-900 | 13.78 | Ícone e destaque em fundo escuro |
| brand-amarelo-300 | cinza-700 | 6.42 | Destaque em fundo escuro |
| brand-porcelana | cinza-900 | 15.85 | Texto claro em fundo escuro |
| brand-amarelo-300 | white | 1.21 | Nunca usar amarelo como texto sobre claro |
| brand-amarelo-500 | white | 1.36 | Nunca usar amarelo como texto sobre claro |
| cinza-900 | brand-amarelo-50 | 16.29 | Gradiente amarelo: início |
| cinza-900 | brand-blue-50 | 15.82 | Gradiente azul: início |
| cinza-900 | brand-blue-200 | 12.70 | Gradiente azul: ponto mais escuro |
| cinza-900 | cinza-50 | 14.96 | Gradiente cinza: início |
| cinza-900 | cinza-200 | 10.85 | Gradiente cinza: ponto mais escuro |
| cinza-700 | brand-bruma | 3.58 | Não usar sobre gradiente: apoio também é cinza-900 |

Regras que saem da tabela:

- O amarelo é um **fundo**, nunca texto nem ícone sobre fundo claro (1,21:1).
- O azul de marca `brand-blue-600` fica **abaixo de 4,5:1** sobre branco (4,44). Serve para elementos gráficos e texto grande. **Links e texto azul usam `brand-blue-700`** (7,48:1).
- `brand-bruma`, `brand-seixo`, `cinza-200` e `cinza-400` falham como texto e como borda de campo. São só decoração.
- Texto secundário pequeno usa `cinza-700` (ou `cinza-600` em 18 px ou mais). Bordas de campos usam `cinza-500` ou mais escuro.
- Nenhuma informação é passada só por cor. Todo estado tem ícone e texto.

### 2.4 Tokens semânticos

| Token | Valor | Uso |
|---|---|---|
| `bg-page` | white | Fundo das telas |
| `bg-subtle` | brand-porcelana | Cartões e áreas agrupadas |
| `bg-highlight` | brand-blue-100 | Avisos informativos e marca de IA |
| `bg-accent` | brand-amarelo-300 | Botão principal |
| `bg-accent-pressed` | brand-amarelo-400 | Botão principal em toque |
| `bg-inverse` | cinza-900 | Botão secundário e avisos urgentes |
| `text-primary` | cinza-900 | Texto principal |
| `text-secondary` | cinza-700 | Texto de apoio |
| `text-link` | brand-blue-700 | Links (só no site, fora do fluxo do app) |
| `text-on-accent` | cinza-900 | Texto sobre amarelo |
| `text-on-inverse` | white | Texto sobre cinza-900 |
| `icon-on-inverse` | brand-amarelo-300 | Ícone sobre cinza-900 |
| `border-strong` | cinza-500 | Campos e botões vazados |
| `border-subtle` | brand-seixo | Divisores decorativos |
| `focus-ring` | cinza-900, 3 px, com 2 px de branco por fora | Foco de teclado e leitor de tela |

### 2.5 Gradientes

Todo fundo de cor do app é um gradiente, para dar leveza e sensação de movimento. Os gradientes usam só passos claros da própria paleta.

| Token | Direção e pontos | Uso |
|---|---|---|
| `grad-amarelo` | 180°: amarelo-50 (0%), amarelo-300 (55%), amarelo-500 (100%) | Telas de espera (tela cheia) |
| `grad-amarelo-card` | 160°: amarelo-100 (0%), amarelo-400 (100%) | Cartão largo da home (ação principal) |
| `grad-azul-card` | 160°: blue-50 (0%), blue-200 (100%) | Cartões da home |
| `grad-bruma-card` | 160°: porcelana (0%), bruma (100%) | Cartões da home |
| `grad-cinza-card` | 160°: cinza-50 (0%), cinza-200 (100%) | Cartões da home |
| `grad-bulb-pulso` | Radial, `ellipse closest-side`: amarelo-300 (centro) até transparente | Bulb que pulsa durante o exercício (25/11) |
| `grad-bulb` | Radial, `ellipse closest-side`: porcelana (centro) até transparente (bordas). Era amarelo-200 (antes amarelo-100); o amarelo saiu em 26/11 | Fundo da home (25/11) |

Regras:

- **Texto sobre gradiente é sempre `cinza-900`**, inclusive o texto de apoio. `cinza-700` sobre bruma dá só 3,58:1 e reprova. A razão do pior ponto de cada gradiente está na tabela da seção 2.3.
- Nenhum ponto de gradiente pode ser mais escuro que `amarelo-500`, `blue-200`, `bruma` ou `cinza-200`. Sem `blue-600` em diante, porque o texto escuro perde contraste.
- O amarelo marca a ação principal: só um cartão da home o usa, mais o botão principal e as telas de espera. Dois cartões vizinhos nunca usam o mesmo gradiente.
- Gradiente fica atrás de texto grande e curto. Texto longo continua em fundo `white` dentro dos painéis (seção 6.8).

---

## 3. Tipografia

### 3.1 Famílias

| Uso | Família | Pesos |
|---|---|---|
| Títulos, botões, nome da marca | **Chillax** (Indian Type Foundry, via Fontshare) | Medium 500, Semibold 600 |
| Textos, números, rótulos | **JetBrains Mono** (JetBrains, licença OFL) | Regular 400, Medium 500, Bold 700 (25/11, só no número do dashboard da Home) |

Fallbacks:

```css
--font-heading: "Chillax", "Helvetica Neue", Arial, sans-serif;
--font-body: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

Carregamento (para o protótipo; no produto, hospedar os arquivos localmente):

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### 3.2 Escala (mobile)

| Estilo | Família | Tamanho / entrelinha | Peso | Uso |
|---|---|---|---|---|
| Display | Chillax | 40 / 44 | 600 | Tela de boas-vindas, nota do exercício |
| Título 1 | Chillax | 32 / 38 | 600 | Título de tela |
| Título 2 | Chillax | 26 / 32 | 600 | Seção |
| Título 3 | Chillax | 22 / 28 | 500 | Cartão |
| Botão | Chillax | 22 / 28 | 500 | Rótulo de botão |
| Corpo | JetBrains Mono | 18 / 28 | 400 | Texto padrão |
| Corpo em destaque | JetBrains Mono | 18 / 28 | 500 | Instruções do exercício |
| Apoio | JetBrains Mono | 16 / 24 | 400 | Legendas e datas (tamanho mínimo da interface) |
| Número grande | JetBrains Mono | 56 / 60 | 500 | Cronômetro, nota |
| Número do dashboard | JetBrains Mono | 64 / 68 | 700 | Suavidade e ritmo na Home (25/11) |

### 3.3 Regras de uso

- Nenhum texto abaixo de 16 px. O corpo padrão é 18 px.
- Respeitar o tamanho de fonte do sistema (Dynamic Type no iOS, escala de fonte no Android). A interface precisa continuar utilizável a 200%.
- Alinhamento à esquerda, nunca justificado. Sem caixa alta contínua. Ligaduras do JetBrains Mono desativadas (`font-variant-ligatures: none`).
- **Atenção ao corpo em monoespaçada.** O JetBrains Mono ocupa cerca de 0,6 em por caractere. A 18 px, uma tela de 390 px com margens de 24 px comporta cerca de 31 caracteres por linha. Por isso: frases curtas, um assunto por parágrafo, nada de textos longos na interface. Relatórios para o fisioterapeuta, quando forem textuais, podem seguir regras tipográficas próprias (ver Pendências).
- O ponto forte da mono é o número: dígitos de largura fixa evitam que cronômetro e nota "dancem". Usar `font-variant-numeric: tabular-nums`.

---

## 4. Espaço e layout

Base de 8 px.

| Token | Valor | Uso |
|---|---|---|
| `space-1` | 4 | Ajuste fino entre ícone e texto |
| `space-2` | 8 | Dentro de elementos |
| `space-3` | 12 | Dentro de cartões compactos |
| `space-4` | 16 | **Distância mínima entre alvos de toque** |
| `space-6` | 24 | **Margem lateral da tela**, padding de cartão |
| `space-8` | 32 | Entre grupos de conteúdo |
| `space-12` | 48 | Entre seções |
| `space-16` | 64 | Respiro acima de um título de tela |
| `space-24` | 96 | Topo de telas de boas-vindas |

Regras de espaço em branco:

- Mínimo de 48 px entre duas seções e 24 px de margem lateral, sem exceção.
- Pelo menos um terço da altura de cada tela interna deve estar vazio. A home é a exceção: o respiro vem do espaçamento de 24 px entre cartões e da margem de 24 px, não do vazio da tela.
- Fundo branco como padrão. Cartões de conteúdo dentro dos painéis em `brand-porcelana`, sem sombra e sem borda. Cartões de atalho da home usam gradiente (seção 6.2).
- A ação principal fica ancorada na parte de baixo, na zona do polegar, com 24 px de margem inferior mais a área segura do aparelho.
- Colunas: 4 em telefone (margens 24, espaçamento 16). Conteúdo limitado a 560 px de largura no site em telas maiores, centralizado.

---

## 5. Forma e profundidade

| Token | Valor | Uso |
|---|---|---|
| `radius-md` | 16 | Botões, campos, cartões |
| `radius-lg` | 24 | Painéis inferiores e janelas de aviso |
| `radius-xl` | 32 | Cartões de atalho da home |
| `radius-full` | 999 | Etiquetas e indicadores |
| `stroke` | 2 px | Bordas de campos e ícones |

Sem sombras. A hierarquia vem de cor de fundo, gradiente e espaço. A sensação de profundidade dos cartões da home vem do raio grande e do gradiente em diagonal, não de rotação nem de sombra. Painéis inferiores usam `bg-page` sobre uma película `cinza-900` a 40% de opacidade.

---

## 6. Componentes

Estrutura do app: uma **home** com cartões grandes, e as outras telas abrem como **painel inferior** a partir da home. Não há aba, barra de navegação nem botão pequeno. Todo toque cai num cartão ou num botão de 64 px ou mais.

**Exceções de 25/11:** (a) menu suspenso ao tocar no avatar, com Personalizar e Conexão com o ZENI; (b) o exercício do dia em tela cheia; (c) a nota em modal centralizado. A nova home está na seção 6.2.

### 6.1 Botões

| Tipo | Fundo | Texto | Altura | Uso |
|---|---|---|---|---|
| Principal | brand-amarelo-300 | cinza-900 | 72 | Uma por tela (Começar, Conectar o ZENI) |
| Secundário | cinza-900 | white | 64 | Segunda ação (Pausar, Voltar). Regra de 25/11: o Voltar tem um passo (8 px) a menos que o primário, token `--target-voltar` (72 − 8 = 64) |
| Vazado | transparente, borda 2 px cinza-500 | cinza-900 | 64 | Ação de baixa importância |

- Todo botão ocupa a largura da tela menos as margens. Não existe botão de texto nem link tocável no app: se algo precisa ser tocado, vira botão.
- Botões empilhados têm 16 px entre si.
- Estado de toque: o fundo vai para o passo seguinte da escala (amarelo-300 para amarelo-400) e o botão reduz para 98% por 120 ms.
- Estado desativado: não usar cinza claro. Manter o contorno e escrever o motivo abaixo ("Conecte o ZENI para começar").
- **Pausar** aparece em todas as telas de exercício, na mesma posição, 64 px de altura mínima.

### 6.2 Home

Decisão de 25/11: a grade de um cartão largo e quatro quadrados deixa de valer. Referência de tela: 390 × 844. De cima para baixo:

| Elemento | Regra |
| -------- | ----- |
| Avatar | Topo, alvo de no mínimo 64 × 64, com a inicial da pessoa (Título 3). `aria-label` "Abrir menu". Abre o menu suspenso com Personalizar e Conexão com o ZENI. Exceção à regra de ícone sozinho (6.7). Sem nome guardado, mostra um ícone de pessoa no lugar da inicial (provisório) |
| Pílula do ZENI | Topo, ao lado do avatar. Raio `radius-full`, texto em Apoio (16 px). Não é tocável. Com conexão, mostra o nível de bateria. Sem conexão, mostra só "ZENI desconectado", sem nível de bateria, em `cinza-700` (o cinza mais claro com 4,5:1 em texto de 16 px) |
| Dashboard | Dois indicadores, **suavidade** e **ritmo**. Só leitura. Só cinzas, sem azul (ver a seção "Dashboard" abaixo). Sem histórico: o número fica como "–", com o rótulo ("suavidade", "ritmo") abaixo. Sem texto explicativo |
| Botões | Dois, lado a lado: **Minha evolução** (esquerda, secundário, cinza) e **Começar o exercício** (direita, principal, amarelo, com mais destaque). Largura de cada um: (390 − 2 × 24 − 16) ÷ 2 = 163. Altura mínima 72. Texto em até duas linhas, sem cortar e sem hifenizar |
| Fundo | `grad-bulb` (seção 2.5): elipse radial grande, centralizada na horizontal, ocupando a área livre entre o topo e o dashboard. Vai de `brand-porcelana` (quase-branco) no centro até transparente nas bordas (`ellipse closest-side`), clara o bastante para aparecer sem competir com o dashboard, sem contorno, sobre o fundo da tela. Sem animação na home |

Distância entre os dois botões: 16 px (`space-4`). Margem lateral de 24 px e 24 px de margem inferior mais a área segura. O estado de toque dos botões segue a seção 6.1.

O aviso "O ZENI não está conectado" continua no topo, quando for o caso.

Cartão de conteúdo (dentro dos painéis): fundo `brand-porcelana`, raio 16, padding 24, sem borda, título (Título 3) e no máximo duas linhas de apoio.

### 6.3 Campos e seleção

Altura mínima 64, borda 2 px `cinza-500`, foco com `focus-ring`. Preferir botões de escolha a campos de digitação. Não usar controles deslizantes de precisão, seletores de data por rolagem nem caixas de seleção pequenas.

### 6.4 Avisos

Todos têm ícone, título curto e uma frase de orientação. Sem vermelho.

| Nível | Aparência | Exemplo |
|---|---|---|
| Informação | Fundo `brand-blue-100`, texto cinza-900, ícone brand-blue-700 | "Reconectando ao ZENI…" |
| Atenção | Fundo `brand-amarelo-200`, texto cinza-900 | "A bateria do ZENI está acabando." |
| Urgente | Fundo `cinza-900`, texto white, ícone brand-amarelo-300 | "O exercício foi pausado. Vamos descansar um pouco." |

Avisos de atenção ficam no topo, discretos, e somem sozinhos só quando não exigem decisão. Avisos urgentes ficam até serem tocados.

### 6.5 Nota e evolução

- A nota usa o estilo "Número grande" e vem sempre com uma frase de incentivo. A escala 0 a 100 é uma decisão pendente (ver Pendências).
- Gráficos: uma série por vez, linha de 3 px em `cinza-900`, área em `brand-amarelo-200`, rótulos em 16 px. Uma segunda série, quando houver, usa `brand-blue-600` tracejada. Sem grades densas nem legenda com mais de duas entradas.

**Tela "Minha evolução" (25/11).** Abre direto no dashboard, sem pergunta de período. De cima para baixo: alternador **7 dias / 30 dias** (dois botões de escolha do mesmo tamanho, 64 px, 16 px entre eles; o escolhido fica em `cinza-900` com texto branco), o gráfico e o resumo. Na base, lado a lado e alinhados pela base: **Exportar** à esquerda (principal, 72) e **Voltar** à direita (`--target-voltar`, 64), perto do polegar. Exportar abre o painel da seção 6.13. A coluna do eixo do gráfico tem folga para o "100" no maior tamanho de texto.

### 6.6 Marca de IA

Pequena etiqueta ("IA") em `brand-blue-100` com texto `brand-blue-800` (11,50:1), raio total, altura 28 px. É o mesmo azul do bloco "O app pensa" do fluxograma. Aparece só onde o app adapta ou escreve algo para a pessoa: exercício do dia sugerido, ajuste da meta, resumo do exercício. Sempre acompanhada de uma frase que explica o que o app fez ("O app ajustou a sua meta porque o exercício mostrou cansaço").

### 6.7 Ícones

Traço de 1,75 px (token `--stroke-icone`, o do ícone do cartão Minha evolução), igual em todos os tamanhos de ícone. Área de 28 px, cantos arredondados, `cinza-900`. Sempre com texto ao lado nas ações principais. Ícone nunca é alvo de toque sozinho. Única exceção (25/11): o avatar da home, que mostra a inicial da pessoa e identifica o botão.

### 6.8 Painel inferior

Toda tela que não é a home abre como painel inferior, tocando num cartão ou no menu do avatar. Só existe um nível: o painel nunca abre outro painel, e "Voltar" sempre leva à home. **Exceções de 25/11:** o exercício do dia (tela cheia) e a nota (modal centralizado). Em "Minha evolução" (somente nessa tela), Exportar fica à esquerda, na altura do primário (72), e Voltar à direita, um passo menor (64), lado a lado e alinhados pela base.

| Elemento | Regra |
|---|---|
| Altura | Se ajusta à altura do conteúdo (25/11; antes: 88% da tela). O exercício em andamento usa altura total |
| Forma | Fundo `white`, cantos superiores `radius-lg` (24) |
| Película | Sobre a home, `cinza-900` a 40%. Tocar na película também fecha o painel |
| Entrada e saída | Sobe e desce em 250 ms. Com "reduzir movimento", troca direta |
| Alça e botão "X" | Não usar. Arrastar para fechar pode existir, mas nunca como único caminho |
| Rodapé fixo | Botão principal (72) com o secundário "Voltar" (64) logo abaixo, 16 px entre eles, 24 px de margem inferior mais a área segura |
| Conteúdo | A altura é a do conteúdo, sem espaço vazio. Só rola se passar de 100% da tela menos 48 px (texto no maior tamanho). Itens de navegação são linhas, não botões com contorno (abaixo) |

**Linhas de navegação (25/11).** Onde o painel só leva a outra tela (Personalizar: Lembretes e Aparência; lista de Lembretes), usar linhas em vez de botões com contorno: texto à esquerda (estilo Botão, `cinza-900`), chevron à direita (`cinza-700`, 28 px), altura mínima de 64 px e divisor de 1 px em `brand-seixo` entre linhas. Hierarquia do painel: título (Título 1), linhas, e o Voltar no rodapé. Botões com contorno ficam para ações (Apagar, Desfazer) e para escolhas (tamanho do texto).

**Aparência.** O Confirmar fica desativado, com o motivo escrito abaixo, enquanto o tamanho escolhido for o atual.

**Lembretes.** Sem lista, o painel mostra "Você ainda não tem lembretes." e, logo abaixo, o botão "Adicionar lembrete". O botão fica no topo do painel também quando há lembretes.

### 6.9 Telas de espera

Três telas minimalistas, só com texto e gradiente: **abertura**, **procurando o ZENI** e **preparando o exercício**. Sem logotipo, sem barra de progresso, sem botão.

| Elemento | Regra |
|---|---|
| Fundo | `grad-amarelo`, tela cheia |
| Texto | Título 1 (Chillax 32 / 38), `cinza-900`, alinhado à esquerda na margem de 24 |
| Posição | Topo do bloco de texto a cerca de 30% da altura da tela, no trecho claro do gradiente. Máximo de 3 linhas |
| Movimento | Pontos de cor do gradiente se deslocam devagar (seção 8) |

Textos:

| Tela | Texto |
|---|---|
| Abertura | "Olá, {nome}" |
| Sincronização | "Procurando o ZENI" |
| Exercícios | "Preparando o seu exercício de hoje" |

Se a espera passar de 15 segundos, o texto muda para uma frase calma ("Está demorando mais que o normal") e aparecem dois botões: principal "Tentar de novo" e secundário "Voltar". É a única situação em que uma tela de espera tem botão.

### 6.10 Pausado

Tela do exercício em altura total (seção 6.8). Mostra "Exercício pausado" (Título 1) e uma frase calma de apoio (Corpo), sem tempo limite. Três botões: **Continuar** (principal, 72), que retoma o exercício, **Repetir** (vazado, 64), que mostra de novo a animação de como fazer (tela "Repetir": nome, figura e legenda, com Continuar e Terminar), e **Terminar** (secundário, 64), que encerra. Se a série de 3 ainda não acabou, Terminar leva à home, sem nota, e o exercício em andamento é descartado (provisório, 25/11). A avaliação só vem ao fim da série. Na voz, "repetir" mostra de novo a animação do exercício atual, com o exercício em pausa até "Continuar". Terminar segue a regra de "Desfazer" por 8 segundos (seção 7).

A pausa automática por dificuldade usa a mesma tela. A frase de apoio é o aviso urgente da seção 6.4 ("O exercício foi pausado. Vamos descansar um pouco.").

### 6.11 Reconexão durante o exercício

Quando o sinal do ZENI cai, o exercício fica em pausa e aparece o aviso de informação "Reconectando ao ZENI…" (seção 6.4), sem botões. O app tenta duas vezes, com 10 segundos cada (valor ajustável). Se as duas falharem, a tela pergunta "Perdi o sinal do ZENI. Quer tentar de novo?", com **Tentar de novo** (principal) e **Voltar ao início** (secundário). Essa pergunta não tem limite de tempo. Voltar ao início segue a regra de Terminar no meio da série: home, sem nota, exercício em andamento descartado (provisório, 25/11).

### 6.12 Perguntas de triagem (PAR-Q)

Uma pergunta por tela. A pergunta usa Título 3 e o contador ("Pergunta 3 de 7") usa Apoio. Dois botões de escolha do mesmo tamanho (72), **Sim** e **Não**, empilhados com 16 px entre eles. Tocar numa resposta avança para a próxima pergunta. **Voltar** (secundário, 64) volta à pergunta anterior e permite corrigir.

- Sim e Não têm a mesma aparência. Nenhuma resposta usa cor de alerta, ícone de aviso ou mensagem de risco.
- Nenhuma resposta bloqueia o fluxo.
- As perguntas e o uso das respostas estão em `docs/triagem-parq.md`.

#### Menu do avatar (25/11)

Aparece logo abaixo do avatar, ao tocar nele. Fundo `white`, `radius-lg`, sem sombra e sem borda. Dois itens de 64 px de altura mínima, 16 px entre eles: "Personalizar" e "Conexão com o ZENI". Fecha ao escolher um item, ao tocar fora ou com Esc. O avatar tem `aria-haspopup="menu"` e `aria-expanded`.

#### Dashboard da Home (25/11)

Fundos só na escala de cinzas (cinza-50 a cinza-900), sem bruma. Exceção de 26/11: os números grandes usam `blue-700`. (O cartão "minha evolução" da home, que fica fora do dashboard, usa os azuis mais claros: blue-50, blue-100 e blue-200.) O amarelo fica só no botão "Começar o exercício" e no gradiente em bulb de fundo. O público tem baixa visão, então o contraste mínimo vale mais que um cinza mais claro.

| Elemento | Regra |
|---|---|
| Div que contém os cards | gradiente 160° de `cinza-200` a `cinza-100` (era `grad-cinza-card`, alterado em 26/11), `radius-2xl`, padding 16, glow interno `--brilho-interno` |
| Cards de suavidade e ritmo | Mesmo gradiente do painel (160°, cinza-50 a cinza-200), separados dele pelo glow interno branco (`--brilho-interno`, 30 px). Era cinza-100 a cinza-300 (alterado em 26/11). `radius-2xl`, o mesmo da div |
| Número | "Número do dashboard" (61 / 68, bold), `blue-700` (alterado em 26/11; era `cinza-900`), centralizado no centro do card |
| Rótulo | Apoio (16 px, o mínimo), minúsculas, `cinza-800`, logo abaixo do número. `cinza-700` dá só 3,89:1 em cinza-300 e reprova; `cinza-800` dá 5,94:1 |
| Estado vazio | "–" em `cinza-700` (3,89:1 em cinza-300, passa os 3:1 de texto grande). `cinza-600` dá 2,61:1 no ponto mais escuro e reprova |
| Ícones dos botões da home | `cinza-800`, o mesmo dos rótulos |
| Entrada | Os números contam de 0 até o valor (`--dur-count`); os textos entram com fade e leve subida. Com "reduzir movimento", aparecem direto |

### 6.13 Exportar

Em "Minha evolução", tocar em Exportar abre um bottom sheet (seção 6.8) com duas linhas, cada uma um botão de 64 px ou mais, 16 px entre elas:

| Linha | O que faz |
|---|---|
| Salvar em PDF | Gera o resumo da evolução do período escolhido (7 ou 30 dias) e abre a impressão do navegador |
| Enviar link | Sem backend na v1, usa a Web Share API com um texto-resumo. Se o navegador não suportar, copia o texto e mostra "Copiado". O link real depende do backend (v2) |

### 6.14 Consentimento e microfone

- **Consentimento do PAR-Q** (provisório, a revisar com profissional de saúde e LGPD). Tela antes das perguntas, com o texto "O ZENI guarda suas respostas só neste aparelho, para ajustar os exercícios. O ZENI não substitui a orientação de um profissional de saúde." e o botão principal "Concordo e continuar".
- **Microfone.** Pedido só ao começar o primeiro exercício, depois de uma tela curta de explicação: "O ZENI escuta só durante o exercício, para ouvir a palavra pausar". Se a pessoa negar, os botões continuam funcionando e a voz fica desligada.
- **Bluetooth.** Sem permissão na v1, porque a conexão é simulada. Fica para a v2.

### 6.15 Exercício em tela cheia (25/11)

O exercício do dia é uma série de 3, em tela cheia (altura total, seção 6.8). Cada exercício tem duas telas:

**Instrução.** De cima para baixo: o contador ("Exercício 1 de 3", Apoio), o nome do exercício (Título 2), o personagem em animação (3D, ocupa o meio da tela, no mínimo 260 px de altura; no maior tamanho de texto a tela rola) e a legenda (Corpo em destaque, uma frase curta). Rodapé: **Começar** (principal, 72) e **Voltar** (`--target-voltar`). A figura é um personagem 3D da cintura para cima (`zeni-personagem.glb`, `three` com `@react-three/fiber` e `drei`), em material fosco `brand-porcelana`, segurando o ZENI em `brand-bruma` (feito por `LatheGeometry` a partir do perfil do modelo 3D, escala 0,001). Normais suavizadas, luz hemisférica mais uma direcional fraca, sem sombras duras, fundo transparente e a cintura esmaecida no próprio material (por vértice; braços e mãos nunca esmaecem), com o material em `DoubleSide` porque a malha é uma casca aberta. A câmera fica levemente de três quartos. Troca de animação com `crossFadeTo` de 0,4 s; `devicePixelRatio` limitado a 2; a renderização pausa com a aba oculta. Em C e D o pulso amarelo (`grad-bulb-pulso`) usa o mesmo período do clipe (1,0 s e 1,2 s); em D e F há uma linha de mesa em `cinza-300`. **Movimento calmo:** os clipes são reproduzidos mais devagar (A 0,7×, B 0,8×, F 0,75×; C e D seguem o pulso; E a 2 s por repetição), com pausa curta nos pontos de virada (A: 0,6 s em cada extremo; B: 0,5 s no repouso e 0,8 s no ombro; F não para), e partida gradual em 1,5 s. Coluna, peito, pescoço e cabeça ficam neutros e fixos (as tracks desses ossos são filtradas ao carregar); só o braço direito se move. Contrato do modelo: `docs/rig-atual.md`. Com "reduzir movimento", só a pose inicial, parada. Crédito do modelo base: Character Base, madtrollstudio (licença a confirmar). Animações: ver a tabela da decisão 23 em `docs/fluxo-do-app.md`.

**Em andamento.** Sem barra de progresso e sem círculo. Ao fundo, um bulb em gradiente amarelo (`grad-bulb-pulso`) pulsa suavemente no tempo do ritmo, e o tamanho do movimento muda a amplitude dele. No centro, a mesma figura da instrução. O contador de tempo fica no canto superior direito, 2 pt menor que o Apoio (16 px) e em `cinza-700`. O botão **Pausar** continua sempre na tela, na mesma posição.

**Voz (25/11).** Durante o exercício a voz reconhece "pausar", "continuar", "terminar" e "repetir" (ver a decisão 26 em `docs/fluxo-do-app.md`). Quando o microfone está ouvindo, aparece no canto superior esquerdo o indicador "Ouvindo": ícone de microfone e texto, em `brand-amarelo-200` com `cinza-900`, `radius-full`. Os botões ficam sempre na tela. Sem suporte ou sem permissão, o indicador não aparece e nada mais muda.

### 6.16 Tela de carregamento do exercício (25/11)

Fundo `white`. Ao centro, um bulb arredondado (cerca de 60% da largura, até 240 px) em `cinza-100`, que se preenche de baixo para cima com um gradiente amarelo (`amarelo-400` embaixo, `amarelo-300` no meio, `amarelo-100` em cima) durante o tempo de carregamento. Abaixo, o texto "Preparando o seu exercício de hoje" (Título 3). Sem barra de progresso e sem botão. Passando de 15 segundos, o texto muda para uma frase calma e aparecem "Tentar de novo" e "Voltar", como nas outras telas de espera (seção 6.9). Com "reduzir movimento", o bulb já aparece preenchido.

### 6.17 Nota em modal (25/11)

Modal centralizado (exceção da seção 6.8): fundo `white`, `radius-lg`, padding 32 / 24, sobre a película `cinza-900` a 40%, que não fecha ao tocar. De cima para baixo: o número grande (96 px, bold) centralizado, o microtexto "sua nota" (Apoio, minúsculas, `cinza-700`), uma descrição curta de tamanho do movimento, suavidade e ritmo, a frase de incentivo, a etiqueta de IA com a mensagem sobre a meta ou o cansaço, e o botão principal **Ver minha evolução**, que leva direto a Minha evolução. A nota só aparece depois do terceiro exercício e fica gravada na evolução.

---

## 7. Acessibilidade motora e cognitiva

Estas regras valem mais do que o gosto visual.

| Regra | Valor |
|---|---|
| Alvo de toque mínimo | 64 × 64 px (botão principal 72, cartões da home 144 ou mais). A norma pede 24 (WCAG 2.2 AA) ou 44 (AAA), então 64 é decisão do projeto, para tremor |
| Distância entre alvos | 16 px ou mais entre botões, 24 px entre cartões da home |
| Gestos | Todo gesto de arrastar, pinça ou segurar tem alternativa por toque simples |
| Toque acidental | Ações que apagam ou encerram têm "Desfazer" por 8 segundos, em vez de janela de confirmação |
| Tempo | Nenhuma tela some ou expira sem aviso e sem opção de prolongar |
| Movimento | Respeitar "reduzir movimento" do sistema. Transições de 150 a 250 ms, curva de saída suave |
| Pulsos visuais | O guia de ritmo na tela não pisca mais de 3 vezes por segundo e não usa alto contraste de flash (WCAG 2.3.1) |
| Voz e leitor de tela | Todo elemento tem rótulo. Ordem de leitura igual à ordem visual |
| Vibração do ZENI | Complementa o aviso visual, nunca é o único aviso |

---

## 8. Movimento e retorno

| Situação | Retorno no app |
|---|---|
| Conexão feita | Ícone muda para cinza-900 sobre brand-amarelo-300, 200 ms, mais mensagem de texto |
| Ritmo guiado | Círculo `brand-amarelo-300` que cresce e encolhe no tempo do ritmo, sem passar de 3 pulsos por segundo. Na v1 é o único guia de ritmo: luz, vibração e música do dispositivo ficam na v2 |
| Fim do exercício | Nota aparece por contagem rápida de 600 ms |
| Troca de tela | Deslize curto de 200 ms. Com "reduzir movimento", troca direta |
| Painel inferior | Sobe e desce em 250 ms |
| Telas de espera | O gradiente se desloca devagar por até 5 segundos e para no último quadro, para cumprir a regra de movimento automático (WCAG 2.2.2). O texto continua na tela. Com "reduzir movimento", já começa parado |
| Cartões da home | Gradiente sempre estático |

---

## 9. Tokens (CSS)

```css
:root {
  /* Cinzas (neutros) */
  --cinza-50: #F1F3F4;
  --cinza-100: #E6EAEA;
  --cinza-200: #CAD2D4;
  --cinza-300: #ADBABD;
  --cinza-400: #91A2A6;
  --cinza-500: #758B8F;
  --cinza-600: #5E7073;
  --cinza-700: #475557;
  --cinza-800: #30393B;
  --cinza-900: #1A1F20;
  --white: #FFFFFF;

  /* Marca: amarelo */
  --brand-amarelo-50: #FEFDF1;
  --brand-amarelo-100: #FDFADD;
  --brand-amarelo-200: #FAF4AD;
  --brand-amarelo-300: #F7ED7E;
  --brand-amarelo-400: #F4E64D;
  --brand-amarelo-500: #F1E01D;

  /* Marca: blue */
  --brand-blue-50: #F0FBFF;
  --brand-blue-100: #E3F7FF;
  --brand-blue-200: #B3E9FF;
  --brand-blue-600: #0080B2;
  --brand-blue-700: #005B80;
  --brand-blue-800: #00374D;

  /* Marca: tons únicos */
  --brand-bruma: #98B5BE;
  --brand-seixo: #C4C4C4;
  --brand-porcelana: #F5FAFE;

  /* Semânticos */
  --bg-page: var(--white);
  --bg-subtle: var(--brand-porcelana);
  --bg-highlight: var(--brand-blue-100);
  --bg-accent: var(--brand-amarelo-300);
  --bg-accent-pressed: var(--brand-amarelo-400);
  --bg-inverse: var(--cinza-900);
  --text-primary: var(--cinza-900);
  --text-secondary: var(--cinza-700);
  --text-link: var(--brand-blue-700);
  --text-on-accent: var(--cinza-900);
  --text-on-inverse: var(--white);
  --icon-on-inverse: var(--brand-amarelo-300);
  --border-strong: var(--cinza-500);
  --border-subtle: var(--brand-seixo);

  /* Tipografia */
  --font-heading: "Chillax", "Helvetica Neue", Arial, sans-serif;
  --font-body: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  /* Espaço */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* Forma */
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 999px;

  /* Toque */
  --target-min: 64px;
  --target-primary: 72px;
  --grid-gap: var(--space-6);

  /* Gradientes (texto sempre cinza-900) */
  --grad-amarelo: linear-gradient(180deg, var(--brand-amarelo-50) 0%, var(--brand-amarelo-300) 55%, var(--brand-amarelo-500) 100%);
  --grad-amarelo-card: linear-gradient(160deg, var(--brand-amarelo-100) 0%, var(--brand-amarelo-400) 100%);
  --grad-azul-card: linear-gradient(160deg, var(--brand-blue-50) 0%, var(--brand-blue-200) 100%);
  --grad-bruma-card: linear-gradient(160deg, var(--brand-porcelana) 0%, var(--brand-bruma) 100%);
  --grad-cinza-card: linear-gradient(160deg, var(--cinza-50) 0%, var(--cinza-200) 100%);
  --grad-bulb-pulso: radial-gradient(ellipse closest-side at center, var(--brand-amarelo-300) 0%, transparent 100%);
  --grad-bulb: radial-gradient(ellipse closest-side at center, var(--brand-porcelana) 0%, transparent 100%);
}

body {
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 28px;
  color: var(--text-primary);
  background: var(--bg-page);
  font-variant-ligatures: none;
  font-variant-numeric: tabular-nums;
}

h1, h2, h3, button { font-family: var(--font-heading); }

:focus-visible {
  outline: 3px solid var(--cinza-900);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--white);
}
```

---

## 10. Voz e glossário

O app fala como uma pessoa calma: frases curtas, verbos no imperativo gentil, nenhuma sigla. Termos técnicos ficam só na apresentação do hardware, nunca na interface nem no fluxograma.

| Em vez de | Escrever |
|---|---|
| MPU-6050, sensor inercial, acelerômetro | (não aparece) ou "o sensor de movimento do ZENI" |
| BLE, Bluetooth, pareamento | "conectar o ZENI" |
| Calibração | "posição inicial" |
| Sessão | "exercício" |
| Amplitude, ROM | "tamanho do movimento" |
| Jerk, fluidez | "suavidade" |
| Fadiga, decaimento | "cansaço" |
| Cadência, rhythmic cueing | "ritmo guiado" |
| Score | "nota" |
| Dashboard | "início" |
| Relatório | "minha evolução" |
| Erro de conexão | "perdi o sinal do ZENI" |

Tom por situação: incentivo curto ao terminar ("Bom trabalho hoje."), nunca cobrança ao falhar, nunca comparação com outras pessoas.

---

## 11. Pendências

1. **`brand-blue-600` não passa como texto.** São 4,44:1 sobre branco. Se a intenção é usar esse azul em links, escurecer um passo ou aceitar `brand-blue-700` para texto (como está neste documento).
2. **Lacuna na escala azul.** Faltam os passos 300, 400 e 500 entre o azul claro e o azul de marca.
3. **Seixo e cinza-200 fazem o mesmo trabalho.** `brand-seixo` (`#C4C4C4`, cinza puro) e `cinza-200` (`#CAD2D4`, cinza azulado) são divisores quase iguais. Escolher um ou dar um papel distinto a cada um.
4. **Nomes em dois idiomas.** Os grupos usam `brand-amarelo` e `brand-blue`. Se a ideia é tudo em português, `brand-azul` fecha o conjunto com bruma, seixo e porcelana.
5. **Cores de estado.** A paleta não tem vermelho nem verde. O documento resolve com ícone, texto e inversão de fundo. Se o teste com usuários mostrar necessidade de uma cor de alerta, definir uma e checar contraste.
6. **Corpo em monoespaçada.** Validar com pessoas reais a leitura de frases em JetBrains Mono a 18 px. Se cansar, manter a mono para números e rótulos e passar parágrafos longos para uma sans de apoio.
7. **Nota de 0 a 100.** Pode soar como prova. Alternativa: níveis ou frases ("Hoje foi um bom dia").
8. **Logo e nome ZENI.** Definir o logotipo em Chillax, versões em cinza-900 e em brand-amarelo-300, e a área de respiro.
9. **Modo escuro e alto contraste.** Fora do escopo desta versão.
10. **Exportação para o fisioterapeuta.** Definir o layout do PDF, que pode ter regras tipográficas próprias.
11. **Home.** (Atualizado em 25/11: a nova home está na seção 6.2. O "cinza claro" foi resolvido: rótulos em `cinza-800`, "–" em `cinza-700`. Ficam em aberto o dashboard sem histórico além do "–" e a pílula sem conexão. O texto abaixo sobre cartões quadrados é histórico.) Os cinco destinos vinham do fluxograma.
12. **Um nível só de painel.** A seção 6.8 diz que o painel nunca abre outro e que "Voltar" leva sempre à home. "Personalizar" tem cinco itens com sequências próprias, e dele se pode abrir "Pedir ajuda ao ZENI". Definir se cada item vira um painel em sequência ou se a regra de um nível muda.
13. **Perspectiva.** Interpretei como profundidade por raio grande e gradiente diagonal, sem inclinar cartões nem texto. Texto inclinado piora a leitura e o público já tem dificuldade de estabilidade. Perspectiva real só em material de divulgação, se quiser.
14. **Gradiente parado após 5 segundos.** Pode parecer que o app travou. Testar a tela de espera com pessoas reais. O limite de 15 segundos para a mensagem de demora pode precisar baixar.
15. **Telas de espera com botão na falha.** O pedido era só texto e gradiente. Sem botão, uma conexão que falha deixa a pessoa presa, então abri essa exceção. O limite de 15 segundos aqui difere dos 10 segundos por tentativa da reconexão durante o exercício (seção 6.11); alinhar.
16. **Texto nos cartões quadrados.** O limite de cerca de 10 caracteres é uma estimativa. Conferir no Figma com Chillax 22 px e com fonte do sistema ampliada.
17. **Cor dos cartões.** A paleta limita os gradientes a tons claros. Se quiserem cartões mais saturados, falta uma escala média de azul (passos 300 a 500, ver item 2) e a checagem de contraste do texto.
18. **Telas novas sem teste.** As seções 6.10 (Pausado), 6.11 (Reconexão) e 6.12 (Triagem) foram escritas a partir das decisões do fluxo e ainda não foram vistas no Figma nem testadas com pessoas.
