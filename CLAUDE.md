# ZENI

Site mobile do ZENI, dispositivo de cuidado motor para pessoas com Parkinson e tremores. Antes de qualquer trabalho de interface, ler `docs/fluxo-do-app.md` (o que cada tela faz e para onde vai) e `docs/design-system.md`. A triagem de saúde está em `docs/triagem-parq.md`. O design system é a fonte única de cor, tipografia, espaço, componentes, acessibilidade e tokens CSS. Ignorar `docs/arquivo/`.

## Fluxo

Seguir `docs/fluxo-do-app.md`. Ordem de prioridade: a seção "Decisões do grupo" do documento, depois a imagem `docs/fluxograma.png`, depois o texto restante. Todos os caminhos voltam à Tela inicial. Os pontos abertos no fim do documento são decisões do grupo: perguntar antes de resolver.

## Regras que valem em toda tela

- Uma decisão por tela, com uma ação principal grande. Sem menus, abas nem barras de navegação.
- Alvos de toque grandes, feitos para mão com tremor. Os tamanhos exatos estão na seção 7 do design system.
- Linguagem leiga, sem termos técnicos. O glossário está na seção 10 do design system.
- Avisos calmos, sem vermelho nem alarme.
- Usar os tokens de `zeni-site/src/styles/tokens.css` (origem: seção 9 do design system). Não inventar cores nem tamanhos fora deles.

## Escopo da v1 (entrega para a banca)

- Site mobile, feito para tela de celular. Sem PWA nesta versão.
- Sem backend. Os dados (respostas do PAR-Q, histórico, ajustes) ficam guardados no aparelho, simulando o servidor.
- O ZENI (dispositivo) é simulado: a conexão e os dados de movimento são gerados pelo app. Bluetooth real fica para depois.
- A IA é simulada por regras simples (sugestão do exercício, nota, resumo, ritmo habitual).
- Voz: um único comando, "pausar", só durante o exercício, com o botão Pausar sempre na tela.
- Sem música. Bloco 7 (Pedir ajuda ao ZENI) só por texto, com poucos pedidos reconhecidos.
- Lembretes só funcionam com o app aberto.
- PAR-Q é obrigatório antes do primeiro exercício e um "sim" nunca bloqueia.

## Vocabulário

Decisão do grupo: dizer "o ZENI". Evitar "bastão", "manopla" e "treino" no texto da interface. Preferir "cuidado motor" e "movimento".

O fluxograma já usa "exercício" e "o ZENI". Atenção: `docs/design-system.md` ainda usa "manopla" e "treino" nos exemplos e no glossário (seção 10). Nos textos novos, seguir a decisão acima e não copiar essas palavras dos exemplos.

## Pendências

A seção 11 do design system lista decisões em aberto (logo, escala azul, ordem dos cinco destinos da home e outras). Não resolver sozinho: perguntar.

## Stack

Vite + React, sem backend, deploy na Vercel. Os tokens de design estão em `zeni-site/src/styles/tokens.css`.

Variante escolhida: JavaScript (não TypeScript). Linter: Oxlint.
