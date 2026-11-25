# ZENI

Site mobile do ZENI, dispositivo de cuidado motor para pessoas com Parkinson e tremores. Antes de qualquer trabalho de interface, ler `docs/fluxo-do-app.md` (o que cada tela faz e para onde vai) e `docs/design-system.md`. A triagem de saúde está em `docs/triagem-parq.md`. O design system é a fonte única de cor, tipografia, espaço, componentes, acessibilidade e tokens CSS. Ignorar `docs/arquivo/`.

## Fluxo

Seguir `docs/fluxo-do-app.md`. Ordem de prioridade: a seção "Decisões do grupo (25/11)" do documento, depois "Decisões do grupo (24/11)", depois a imagem `docs/fluxograma.png`, depois o texto restante. A decisão mais recente do grupo vale mais que qualquer regra anterior, inclusive as deste arquivo e as do design system. Todos os caminhos voltam à Tela inicial. Os pontos abertos no fim do documento são decisões do grupo: perguntar antes de resolver.

## Regras que valem em toda tela

- Uma decisão por tela, com uma ação principal grande. Sem menus, abas nem barras de navegação, salvo as exceções abaixo.
- Todo painel é bottom sheet, salvo as exceções abaixo. O bottom sheet se ajusta à altura do conteúdo. O botão Voltar tem um passo a menos de altura que o botão primário.
- **Exceções (decisão de 25/11), só estas três:**
    - Menu suspenso ao tocar no avatar, com Personalizar e Conexão com o ZENI. O avatar mostra a inicial da pessoa, tem no mínimo 64 px e `aria-label` "Abrir menu" (exceção à regra de ícone sozinho).
    - O exercício do dia em tela cheia.
    - A nota em modal centralizado.
- Pequenas exceções de layout (25/11): em Minha evolução, Exportar (72) e Voltar (64) ficam lado a lado, alinhados pela base.
- Alvos de toque grandes, feitos para mão com tremor. Os tamanhos exatos estão na seção 7 do design system.
- Linguagem leiga, sem termos técnicos. O glossário está na seção 10 do design system.
- Avisos calmos, sem vermelho nem alarme.
- Usar os tokens de `zeni-site/src/styles/tokens.css` (origem: seção 9 do design system). Não inventar cores nem tamanhos fora deles.

## Escopo da v1 (entrega para a banca)

- Site mobile, feito para tela de celular. Sem PWA nesta versão.
- Sem backend. Os dados (respostas do PAR-Q, histórico, ajustes) ficam guardados no aparelho, simulando o servidor.
- O ZENI (dispositivo) é simulado: a conexão e os dados de movimento são gerados pelo app. Bluetooth real fica para depois.
- A IA é simulada por regras simples (sugestão do exercício, nota, resumo, ritmo habitual).
- Home: avatar e pílula do ZENI no topo, dashboard (suavidade e ritmo), dois botões lado a lado e gradiente de fundo em bulb. "Começar o exercício" é o principal (amarelo), "Minha evolução" o secundário (cinza). Detalhes na decisão 16 de `docs/fluxo-do-app.md`. A grade de cartões não vale mais.
- O exercício diário é uma série de 3 exercícios, um de cada grupo do catálogo (decisão 9 de 25/11 em `docs/fluxo-do-app.md`), sempre na ordem amplitude, ritmo, manter a energia. Entre os dois de cada grupo, a paridade do dia do ano decide (par: o primeiro, ímpar: o segundo). A nota só aparece ao fim da série, em modal centralizado, com botão direto para Minha evolução.
- Exercício: tela de carregamento com bulb, depois tela cheia com a instrução em animação (personagem 3D da cintura para cima segurando o ZENI, `zeni-site/src/assets/zeni-personagem.glb`, com three + @react-three/fiber + drei; sem ler texto). Catálogo A–F em `zeni-site/src/simulacao.js` (decisão 23). Durante o exercício, sem barra nem círculo: bulb amarelo que pulsa ao fundo. Sem LED, vibração, áudio ou música. Nada de termos clínicos na interface.
- "Terminar" no meio da série (e "Voltar ao início" após falha de reconexão) volta à Home sem nota. Os exercícios concluídos ficam registrados sem nota e o em andamento é descartado. Provisório.
- Minha evolução abre direto no dashboard, com alternador 7/30 dias no topo. Embaixo: Exportar à esquerda e Voltar à direita. Exportar abre um bottom sheet com "Salvar em PDF" (abre a impressão do navegador) e "Enviar link" (Web Share API com texto-resumo; sem suporte, copia e mostra "Copiado"). O link real fica para a v2.
- Microfone: pedido só ao começar o primeiro exercício, depois de uma tela de explicação. Se negado, a voz fica desligada e os botões continuam. Bluetooth real é v2.
- Medidas do ZENI: vale o modelo 3D. 160 mm de comprimento, 60 mm de diâmetro nas pontas e cerca de 45 mm na cintura.
- Voz, só durante o exercício: pausar, continuar, terminar, repetir. Os botões ficam sempre na tela. "Repetir" mostra de novo a animação do exercício atual e pausa o exercício até "Continuar".
- Ritmo: na v1 aparece na tela por um pulso amarelo. Luz, vibração e música do dispositivo ficam na v2.
- Bloco 7 (Pedir ajuda ao ZENI) fora da v1.
- Lembretes só funcionam com o app aberto.
- PAR-Q é obrigatório antes do primeiro exercício e um "sim" nunca bloqueia.

## Vocabulário

Decisão do grupo: dizer "o ZENI". Evitar "bastão", "manopla", "treino" e "fisioterapia" no texto da interface. Os nomes do catálogo de exercícios usam linguagem leiga (ver decisão 9 de 25/11). Preferir "cuidado motor" e "movimento".

O fluxograma já usa "exercício" e "o ZENI". Atenção: `docs/design-system.md` ainda usa "manopla" e "treino" nos exemplos e no glossário (seção 10). Nos textos novos, seguir a decisão acima e não copiar essas palavras dos exemplos.

## Pendências

A seção 11 do design system lista decisões em aberto (logo, escala azul, formato da home e outras). Os pontos abertos no fim de `docs/fluxo-do-app.md` também. Não resolver sozinho: perguntar.

## Stack

Vite + React, sem backend, deploy na Vercel. Os tokens de design estão em `zeni-site/src/styles/tokens.css`.

Variante escolhida: JavaScript (não TypeScript). Linter: Oxlint.
