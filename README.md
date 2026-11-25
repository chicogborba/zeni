# ZENI

Site mobile do ZENI, dispositivo de cuidado motor para pessoas com Parkinson e tremores. Projeto em grupo (PUCRS). Esta pasta guarda a documentação e, a partir daqui, o código do site.

## Estrutura

```
zeni/
├── README.md
├── CLAUDE.md                      contexto e regras para o Claude Code
├── zeni-site/                     projeto Vite + React (JavaScript, Oxlint)
│   └── src/
│       └── styles/
│           └── tokens.css         tokens de design (cor, tipografia, espaço, movimento)
└── docs/
    ├── design-system.md           fonte única de cor, tipografia, componentes e tokens
    ├── fluxo-do-app.md            fluxo do app em texto, para seguir na execução do site
    ├── fluxograma.png             fluxograma atualizado (imagem)
    ├── triagem-parq.md            perguntas do PAR-Q e regras de uso das respostas
    ├── pesquisa/
    │   └── roteiro-entrevista.md  roteiro de entrevista (completo, curto e WhatsApp)
    └── arquivo/
        └── design-system-v1.md    versão anterior do design system, só para consulta
```

## Onde está cada coisa

- **Fluxo e telas:** `docs/fluxo-do-app.md` descreve cada passo do fluxograma. A imagem está em `docs/fluxograma.png`.
- **Decisão de design:** `docs/design-system.md`. A seção 9 traz os tokens em CSS e a seção 11 lista as pendências em aberto.
- **Pesquisa com usuários:** `docs/pesquisa/`.
- **Versões antigas:** `docs/arquivo/`. Não editar.

## Convenções

- Um documento por assunto, em `docs/`. Nomes em minúsculas, com hífen, sem espaço.
- Quando uma versão for substituída, mover a antiga para `docs/arquivo/` em vez de apagar.
