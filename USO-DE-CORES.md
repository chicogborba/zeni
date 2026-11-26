# Uso de cores no site ZENI

Este arquivo registra **onde cada cor é usada** no site. A origem das cores é `zeni-site/src/styles/tokens.css` (design system, seção 2). **Atualizar este arquivo sempre que um uso de cor mudar** (regra também no `CLAUDE.md`).

Última atualização: 26/11/2026.

Regras gerais: só tokens, nunca hex solto fora de `tokens.css`; sem vermelho nem verde; texto sobre gradiente é `cinza-900` (exceto onde indicado); gradientes só em tons claros.

## 1. Paleta

### Cinzas
| Token | Hex |
|---|---|
| `cinza-50` | #F1F3F4 |
| `cinza-100` | #E6EAEA |
| `cinza-200` | #CAD2D4 |
| `cinza-300` | #ADBABD |
| `cinza-400` | #91A2A6 (sem uso) |
| `cinza-500` | #758B8F |
| `cinza-600` | #5E7073 (sem uso) |
| `cinza-700` | #475557 |
| `cinza-800` | #30393B |
| `cinza-900` | #1A1F20 |
| `white` | #FFFFFF |

### Amarelo da marca
`brand-amarelo-50` #FEFDF1 · `-100` #FDFADD · `-200` #FAF4AD · `-300` #F7ED7E · `-400` #F4E64D · `-500` #F1E01D

### Azul da marca
`brand-blue-50` #F0FBFF (sem uso direto) · `-100` #E3F7FF · `-200` #B3E9FF · `-600` #0080B2 (só a 40%, no cartão "minha evolução") · `-700` #005B80 · `-800` #00374D

### Tons únicos
`brand-bruma` #98B5BE · `brand-seixo` #C4C4C4 · `brand-porcelana` #F5FAFE

### Semânticos (aliases)
| Token | Aponta para | Uso |
|---|---|---|
| `bg-page` | white | fundo de painéis, avatar, pílula, menu, modal, campos |
| `bg-subtle` | porcelana | toque pressionado em linhas e menu (o fundo geral do app deixou de usá-lo) |
| `bg-highlight` | blue-100 | avisos informativos, etiqueta de IA |
| `bg-accent` | amarelo-300 | botão principal, selo, alternador ligado |
| `bg-accent-pressed` | amarelo-400 | botão principal pressionado |
| `bg-inverse` | cinza-900 | botão Voltar, opção ativa do alternador de período, dia ligado, bolinha do alternador, aviso urgente |
| `text-primary` | cinza-900 | texto padrão, linha e pontos do gráfico |
| `text-secondary` | cinza-700 | texto de apoio, rótulos "NOTA DE CADA EXERCÍCIO", "NOTA MÉDIA" e "N EXERCÍCIOS" |
| `text-link` | blue-700 | links |
| `text-on-accent` | cinza-900 | texto sobre amarelo |
| `text-on-inverse` | white | texto sobre `bg-inverse` |
| `icon-on-inverse` | amarelo-300 | ícone do aviso urgente |
| `border-strong` | cinza-500 | bordas de botão vazado, alternador, campos, dias |
| `border-subtle` | seixo | divisor das linhas de navegação |

## 2. Home

| Elemento | Cor |
|---|---|
| Fundo da página (`.app`, vale para todas as telas) | `cinza-50` |
| Bulb de fundo (`.home-bulb`) | `--grad-bulb`: porcelana (centro) até transparente |
| Avatar e pílula do ZENI | fundo `bg-page`; texto `text-primary`; "ZENI desconectado" em `cinza-700` |
| **Painel do dashboard** (`.home-dados`) | **`cinza-100` chapado**; glow interno `--brilho-interno` |
| **Cartões de suavidade e ritmo** (`.dado`) | gradiente 160°, `cinza-50` a `cinza-200`; glow interno `--brilho-interno` |
| Número do dashboard | `cinza-900` com valor; `cinza-700` no estado vazio ("–") |
| Rótulos "suavidade" e "ritmo" | `cinza-800` |
| **Cartão "minha evolução"** (`.cartao--azul`) | 4 camadas: radial `blue-100` (85% 10%), radial `blue-200` (10% 35%), radial `blue-600` a 40% de opacidade (80% 100%, token `--blue-600-40`), base `blue-100`; glow interno; texto `cinza-900`; ícone `cinza-800` |
| **Cartão "começar o exercício"** (`.cartao--amarelo`) | 4 camadas: radial `amarelo-50` (15% 10%), `amarelo-500` (90% 25%), `amarelo-200` (30% 100%), base `amarelo-300`; glow interno; texto `cinza-900`; ícone `cinza-800` |
| Aviso de conexão | `aviso--informacao`: fundo `bg-highlight`, ícone `blue-700` |

## 3. Minha evolução (painel inferior)

| Elemento | Cor |
|---|---|
| Película atrás do painel | `--scrim` (cinza-900 a 40%) |
| Fundo do painel | `bg-page` |
| Alternador 7 / 30 dias | borda `border-strong`; ativo: fundo e borda `bg-inverse`, texto `text-on-inverse` |
| Gráfico: linha e pontos | `text-primary` (cinza-900) |
| Gráfico: área | `amarelo-200` |
| Gráfico: eixos | `cinza-300` |
| Gráfico: números e datas (0, 50, 100, hoje, há N dias) | `text-primary` |
| "NOTA DE CADA EXERCÍCIO", "N EXERCÍCIOS", "NOTA MÉDIA" | `text-secondary` (cinza-700), caixa alta, peso 600 |
| Valor da nota média | `text-primary`, negrito |
| Botão Exportar | `bg-accent` (amarelo-300), texto `text-on-accent` |
| Botão Voltar | `bg-inverse`, texto `text-on-inverse` |

## 4. Componentes comuns

| Componente | Cor |
|---|---|
| Botão principal | `bg-accent`; pressionado `bg-accent-pressed`; texto `text-on-accent` |
| Botão Voltar | `bg-inverse`; pressionado `cinza-800`; texto `text-on-inverse` |
| Botão vazado | borda `border-strong`; texto `text-primary`; pressionado `bg-subtle` |
| Botão desativado | borda `border-strong`; texto `text-secondary` |
| Avisos | informação: fundo `bg-highlight`, ícone `blue-700`; atenção: fundo `amarelo-200`; urgente: fundo `bg-inverse`, texto `text-on-inverse`, ícone `icon-on-inverse` |
| Etiqueta de IA | fundo `bg-highlight`, texto `blue-800` |
| Linha de navegação | texto `text-primary`; divisor `border-subtle`; chevron `cinza-700`; pressionada `bg-subtle` |
| Menu do avatar | fundo `bg-page`; item pressionado `bg-subtle` |
| Alternador (liga/desliga) | borda `border-strong`; bolinha `bg-inverse`; ligado: trilho `bg-accent`; estado em `text-secondary` |
| Seletor de dias (lembretes) | borda `border-strong`; ligado: fundo `bg-inverse`, texto `text-on-inverse` |
| Campos | borda `border-strong`; fundo `bg-page`; rótulo `text-secondary` |
| Selo (nota) | fundo `bg-accent`, texto `text-on-accent` |
| Modal central | fundo `bg-page`; película `--scrim`; texto de apoio `text-secondary` |

## 5. Exercício

| Elemento | Cor |
|---|---|
| Bulb que pulsa | `--grad-bulb-pulso`: `amarelo-300` até transparente |
| Contador de tempo | `cinza-700` |
| Contador da instrução ("Exercício 1 de 3") | `text-secondary` |
| Indicador de voz | fundo `amarelo-200`, texto `text-primary` |
| Tela de espera | fundo `--grad-amarelo` (amarelo-50, 300, 500); texto `text-primary` |
| Tela de carregamento | fundo `bg-page`; bulb `cinza-100`; preenchimento em gradiente `amarelo-400`, `amarelo-300`, `amarelo-100` |
| Personagem 3D: corpo | `brand-porcelana` |
| Personagem 3D: o ZENI | `brand-bruma` |
| Personagem 3D: céu / chão | `white` / `cinza-100` |
| Personagem 3D: linha de mesa (exercícios D e F) | `cinza-300` |

## 6. Tokens definidos, sem uso

`cinza-400`, `cinza-600`, `blue-50` (fora dos gradientes), `grad-cinza-card` (o painel do dashboard agora é `cinza-100` chapado), `grad-amarelo-card`, `grad-azul-card`, `grad-bruma-card`.

## 7. Histórico de mudanças de cor

| Data | Mudança |
|---|---|
| 26/11/2026 | Bulb da home: de `amarelo-200` para `porcelana`. |
| 26/11/2026 | Glow branco interno (`--brilho-interno`, 30 px, branco 70%) no painel do dashboard, nos cartões de suavidade e ritmo e nos dois cartões da home. |
| 26/11/2026 | Cartões de suavidade e ritmo: de `cinza-100`→`cinza-300` para `cinza-50`→`cinza-200`. |
| 26/11/2026 | Painel do dashboard: de `grad-cinza-card` (`cinza-50`→`cinza-200`) para `cinza-100` chapado. |
| 26/11/2026 | Cartão "minha evolução": de cinzas (50, 200, 300, 100) para azuis claros (`blue-50`, `blue-200`, `blue-100`). A classe passou de `.cartao--cinza` para `.cartao--azul`. |
| 26/11/2026 | Rótulos do gráfico de evolução em `text-secondary` (antes `text-primary`). |
| 26/11/2026 | Cartão "minha evolução": de `blue-50`/`blue-200`/`blue-100` para `blue-100`, `blue-200` e `blue-600` a 40% de opacidade (novo token `--blue-600-40`). |
| 26/11/2026 | Fundo da página (`.app`): de `bg-subtle` (porcelana) para `cinza-50`. |
