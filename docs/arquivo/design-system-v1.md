# ZENI: Identidade Visual e Design System

Interface mobile (app e site) para uma manopla de treino motor usada por pessoas com Parkinson e tremores. Este documento define cor, tipografia, espaço, componentes e regras de acessibilidade. As cores e os nomes vêm do arquivo "tec embutida" no Figma.

---

## 1. Princípios

1. **Espaço em branco é conteúdo.** O vazio mostra o que importa e reduz a chance de erro de toque. Em dúvida, remova um elemento antes de reduzir o espaço.
2. **Uma decisão por tela.** Cada tela tem uma ação principal, grande e óbvia. Ações secundárias ficam visualmente menores e mais baixas.
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
| `text-link` | brand-blue-700 | Links e botão de texto |
| `text-on-accent` | cinza-900 | Texto sobre amarelo |
| `text-on-inverse` | white | Texto sobre cinza-900 |
| `icon-on-inverse` | brand-amarelo-300 | Ícone sobre cinza-900 |
| `border-strong` | cinza-500 | Campos e botões vazados |
| `border-subtle` | brand-seixo | Divisores decorativos |
| `focus-ring` | cinza-900, 3 px, com 2 px de branco por fora | Foco de teclado e leitor de tela |

---

## 3. Tipografia

### 3.1 Famílias

| Uso | Família | Pesos |
|---|---|---|
| Títulos, botões, nome da marca | **Chillax** (Indian Type Foundry, via Fontshare) | Medium 500, Semibold 600 |
| Textos, números, rótulos | **JetBrains Mono** (JetBrains, licença OFL) | Regular 400, Medium 500 |

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
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 3.2 Escala (mobile)

| Estilo | Família | Tamanho / entrelinha | Peso | Uso |
|---|---|---|---|---|
| Display | Chillax | 40 / 44 | 600 | Tela de boas-vindas, nota do treino |
| Título 1 | Chillax | 32 / 38 | 600 | Título de tela |
| Título 2 | Chillax | 26 / 32 | 600 | Seção |
| Título 3 | Chillax | 22 / 28 | 500 | Cartão |
| Botão | Chillax | 22 / 28 | 500 | Rótulo de botão |
| Corpo | JetBrains Mono | 18 / 28 | 400 | Texto padrão |
| Corpo em destaque | JetBrains Mono | 18 / 28 | 500 | Instruções do treino |
| Apoio | JetBrains Mono | 16 / 24 | 400 | Legendas e datas (tamanho mínimo da interface) |
| Número grande | JetBrains Mono | 56 / 60 | 500 | Cronômetro, nota |

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
- Pelo menos um terço da altura de cada tela deve estar vazio.
- Fundo branco como padrão. Cartões em `brand-porcelana`, sem sombra e sem borda.
- A ação principal fica ancorada na parte de baixo, na zona do polegar, com 24 px de margem inferior mais a área segura do aparelho.
- Colunas: 4 em telefone (margens 24, espaçamento 16). Conteúdo limitado a 560 px de largura no site em telas maiores, centralizado.

---

## 5. Forma e profundidade

| Token | Valor | Uso |
|---|---|---|
| `radius-md` | 16 | Botões, campos, cartões |
| `radius-lg` | 24 | Painéis inferiores e janelas de aviso |
| `radius-full` | 999 | Etiquetas e indicadores |
| `stroke` | 2 px | Bordas de campos e ícones |

Sem sombras. A hierarquia vem de cor de fundo e espaço. Painéis inferiores usam `bg-page` sobre uma película `cinza-900` a 40% de opacidade.

---

## 6. Componentes

### 6.1 Botões

| Tipo | Fundo | Texto | Altura | Uso |
|---|---|---|---|---|
| Principal | brand-amarelo-300 | cinza-900 | 64 | Uma por tela (Começar, Conectar manopla) |
| Secundário | cinza-900 | white | 56 | Segunda ação (Pausar, Voltar) |
| Vazado | transparente, borda 2 px cinza-500 | cinza-900 | 56 | Ação de baixa importância |
| Texto | transparente | brand-blue-700 | 56 | Link dentro de frase ou ação discreta |

- Largura total da tela, menos as margens, quando for o botão principal.
- Estado de toque: o fundo vai para o passo seguinte da escala (amarelo-300 para amarelo-400) e o botão reduz para 98% por 120 ms.
- Estado desativado: não usar cinza claro. Manter o contorno e escrever o motivo abaixo ("Conecte a manopla para começar").
- **Pausar** aparece em todas as telas de treino, na mesma posição, 56 px de altura mínima.

### 6.2 Cartões

Fundo `brand-porcelana`, raio 16, padding 24, sem borda. Um título (Título 3) e no máximo duas linhas de apoio. Cartão tocável: altura mínima 88 px e seta ou ícone à direita.

### 6.3 Campos e seleção

Altura mínima 64, borda 2 px `cinza-500`, foco com `focus-ring`. Preferir botões de escolha a campos de digitação. Não usar controles deslizantes de precisão, seletores de data por rolagem nem caixas de seleção pequenas.

### 6.4 Avisos

Todos têm ícone, título curto e uma frase de orientação. Sem vermelho.

| Nível | Aparência | Exemplo |
|---|---|---|
| Informação | Fundo `brand-blue-100`, texto cinza-900, ícone brand-blue-700 | "Reconectando à manopla…" |
| Atenção | Fundo `brand-amarelo-200`, texto cinza-900 | "A bateria da manopla está acabando." |
| Urgente | Fundo `cinza-900`, texto white, ícone brand-amarelo-300 | "O treino foi pausado. Vamos descansar um pouco." |

Avisos de atenção ficam no topo, discretos, e somem sozinhos só quando não exigem decisão. Avisos urgentes ficam até serem tocados.

### 6.5 Nota e evolução

- A nota usa o estilo "Número grande" e vem sempre com uma frase de incentivo. A escala 0 a 100 é uma decisão pendente (ver Pendências).
- Gráficos: uma série por vez, linha de 3 px em `cinza-900`, área em `brand-amarelo-200`, rótulos em 16 px. Uma segunda série, quando houver, usa `brand-blue-600` tracejada. Sem grades densas nem legenda com mais de duas entradas.

### 6.6 Marca de IA

Pequena etiqueta ("IA") em `brand-blue-100` com texto `brand-blue-800` (11,50:1), raio total, altura 28 px. É o mesmo azul do bloco "O app pensa" do fluxograma. Aparece só onde o app adapta ou escreve algo para a pessoa: treino do dia sugerido, ajuste da meta, resumo do treino. Sempre acompanhada de uma frase que explica o que o app fez ("O app ajustou a sua meta porque o treino mostrou cansaço").

### 6.7 Ícones

Traço de 2 px, 28 px de área, cantos arredondados, `cinza-900`. Sempre com texto ao lado nas ações principais.

---

## 7. Acessibilidade motora e cognitiva

Estas regras valem mais do que o gosto visual.

| Regra | Valor |
|---|---|
| Alvo de toque mínimo | 56 × 56 px (botão principal 64). A norma pede 24 (WCAG 2.2 AA) ou 44 (AAA), então 56 é decisão do projeto, para tremor |
| Distância entre alvos | 16 px ou mais |
| Gestos | Todo gesto de arrastar, pinça ou segurar tem alternativa por toque simples |
| Toque acidental | Ações que apagam ou encerram têm "Desfazer" por 8 segundos, em vez de janela de confirmação |
| Tempo | Nenhuma tela some ou expira sem aviso e sem opção de prolongar |
| Movimento | Respeitar "reduzir movimento" do sistema. Transições de 150 a 250 ms, curva de saída suave |
| Pulsos visuais | O guia de ritmo na tela não pisca mais de 3 vezes por segundo e não usa alto contraste de flash (WCAG 2.3.1) |
| Voz e leitor de tela | Todo elemento tem rótulo. Ordem de leitura igual à ordem visual |
| Vibração da manopla | Complementa o aviso visual, nunca é o único aviso |

---

## 8. Movimento e retorno

| Situação | Retorno no app |
|---|---|
| Conexão feita | Ícone muda para cinza-900 sobre brand-amarelo-300, 200 ms, mais mensagem de texto |
| Ritmo guiado | Círculo `brand-amarelo-300` que cresce e encolhe no tempo do ritmo, sem passar de 3 pulsos por segundo |
| Fim do treino | Nota aparece por contagem rápida de 600 ms |
| Troca de tela | Deslize curto de 200 ms. Com "reduzir movimento", troca direta |

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
  --radius-full: 999px;

  /* Toque */
  --target-min: 56px;
  --target-primary: 64px;
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
| MPU-6050, sensor inercial, acelerômetro | (não aparece) ou "o sensor de movimento da manopla" |
| BLE, Bluetooth, pareamento | "conectar a manopla" |
| Calibração | "posição inicial" |
| Sessão | "treino" |
| Amplitude, ROM | "tamanho do movimento" |
| Jerk, fluidez | "suavidade" |
| Fadiga, decaimento | "cansaço" |
| Cadência, rhythmic cueing | "ritmo guiado" |
| Score | "nota" |
| Dashboard | "início" |
| Relatório | "minha evolução" |
| Erro de conexão | "perdi o sinal da manopla" |

Tom por situação: incentivo curto ao terminar ("Bom treino de hoje."), nunca cobrança ao falhar, nunca comparação com outras pessoas.

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
