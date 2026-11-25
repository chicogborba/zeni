# Fluxo do app ZENI  
  
Descrição escrita do fluxograma atualizado (==fluxograma.png==). É a referência para construir o site: cada passo vira uma tela ou um estado. Se este texto e a imagem divergirem, vale a imagem e este arquivo deve ser corrigido, exceto nos pontos das seções "Decisões do grupo", que valem mais que a imagem até ela ser atualizada. A decisão mais recente (25/11) vale mais que a anterior (24/11). Os textos entre aspas são os rótulos do fluxograma.  
  
****Como ler****  

| Cor no fluxograma | Quem | No site |
| ----------------- | --------------------------------- | -------------------------------------------------------- |
| Amarelo | A pessoa faz | Toque, fala ou escolha. Vira um controle na tela. |
| Azul | O app pensa | Lógica e cálculo. Em geral não tem tela própria. |
| Preto | O ZENI processa | Acontece no dispositivo. O site só reage ao resultado. |
| Cinza azulado | A pessoa vê ou sente | O que a tela mostra ou o que o ZENI faz (luz, vibração). |
| Etiqueta IA | O app usa inteligência artificial | Etiqueta visível na tela (design system, seção 6.6). |
| Azul escuro | Tela inicial | Ponto de partida e de volta. |
  
  
Os passos são numerados por bloco (1.1, 1.2 e assim por diante) só para este documento. Linhas tracejadas no fluxograma são caminhos que podem acontecer a qualquer momento ou casos de erro.  
  
**Regra geral:** todos os caminhos terminam voltando à Tela inicial. As exceções são os casos de erro, que voltam ao exercício ou o encerram (ver o fim deste documento).  
⸻  
## Decisões do grupo (25/11)

Valem mais que a imagem do fluxograma, mais que as decisões de 24/11 e mais que as regras gerais do CLAUDE.md e do design system. Onde houver conflito, vale esta lista.

1. **Exceções às regras "sem menus", "uma decisão por tela" e "tudo em bottom sheet".**
    - (a) **Menu suspenso ao tocar no avatar**, com **Personalizar** e **Conexão com o ZENI**. Essas duas entradas saem dos cartões da Home.
    - (b) **O exercício do dia em tela cheia.**
    - (c) **A nota em modal centralizado.**
    - Os demais painéis continuam bottom sheet.
2. **O exercício diário é uma série de 3 exercícios.** A nota só aparece ao fim da série (3.2 e 3.6), não a cada exercício.
3. **O bloco 7 "Pedir ajuda ao ZENI" sai da v1.** Deixa de ser destino da Home e de ser caminho a partir de Personalizar.
4. **Minha evolução abre direto no dashboard**, com alternador 7/30 dias no topo. Embaixo: **Exportar** (Salvar em PDF ou Enviar link) à esquerda e **Voltar** à direita. Não há mais a escolha de 7 ou 30 dias antes dos gráficos (4.1).
5. **Voz na v1, só durante o exercício:** pausar, continuar, terminar, repetir. Os botões ficam sempre na tela como alternativa.
6. **Bottom sheets se ajustam à altura do conteúdo.** O botão Voltar tem um passo a menos de altura que o botão primário.
7. **Luz, vibração e música do dispositivo continuam na v2.** Na v1 o ritmo é mostrado na tela por um pulso amarelo (2.6).
8. **Catálogo de exercícios**, com nomes em linguagem leiga. Sem "manopla", "treino" ou "fisioterapia" na interface. O catálogo está na decisão 9.
9. **Catálogo de exercícios.** Três grupos, dois exercícios em cada. Na v1 tudo é simulado pelo app.

    | Grupo | Exercício | Nome na interface |
    | ----- | --------- | ----------------- |
    | Amplitude | A | "Girar o punho" |
    | Amplitude | B | "Levantar até o ombro" |
    | Ritmo | C | "No ritmo" |
    | Ritmo | D | "Tocar na mesa" |
    | Manter a energia | E | "Mesma força até o fim" |
    | Manter a energia | F | "Lado a lado" |

    A série do dia tem 3 exercícios, **um de cada grupo**, alternando a cada dia por regra simples. No grupo Ritmo, o ritmo aparece só como pulso amarelo na tela (decisão 7). A letra (A a F) é só para este documento e não aparece na interface.
10. **Nova Home.** A grade de um cartão largo e quatro quadrados deixa de valer. A Home tem, de cima para baixo: **avatar e pílula de bateria** no topo; o **dashboard** (suavidade e ritmo); **dois botões lado a lado**, Minha evolução e Começar o exercício; e **gradiente de fundo em formato de bulb**. O aviso "O ZENI não está conectado" (decisão 9 de 24/11) continua valendo. Detalhes visuais no design system, seção 6.2.
11. **"Repetir" (voz e botão).** Mostra de novo a animação de como fazer do exercício atual. Pausa o exercício enquanto a instrução aparece, e "Continuar" retoma de onde parou. Não reinicia o exercício nem a série.
12. **"Terminar" no meio da série** *(provisório)*. Encerra a sessão e volta à Home, sem nota. Os exercícios já concluídos ficam registrados como feitos, sem nota, e o exercício em andamento é descartado. Vale também para "Voltar ao início" depois da falha de reconexão. Isto responde ao ponto aberto 1 de antes, também como provisório. A avaliação (bloco 3) só roda quando a série de 3 é concluída.
13. **Avatar.** Alvo de toque de no mínimo 64 px (seção 7 do design system), com a **inicial da pessoa** como conteúdo e `aria-label` "Abrir menu". É exceção à regra "ícone nunca é alvo de toque sozinho" (seção 6.7), porque a inicial identifica o botão.
14. **Exportar e Voltar lado a lado** em "Minha evolução", **somente nessa tela**, como exceção ao rodapé empilhado (seção 6.8). Exportar à esquerda, na altura do botão primário (72). Voltar à direita, um passo menor (64), alinhados pela base.

Efeito sobre as decisões de 24/11: a 4 (significado do bloco 7), a 6 (um único comando de voz) e a 7 (bloco 7 só por texto) ficam superadas. As demais continuam valendo.

⸻  
## Decisões do grupo (24/11)  
  
Valem mais que a imagem do fluxograma.  
  
1. **Música fica para a v2.** O ramo "A música escolhida começa a tocar" e "Passar a música" não entra na v1. A imagem ainda os mostra e deve ser atualizada.  
2. **Reconexão.** Quando o sinal cai (2.4), o exercício fica em pausa e o app tenta reconectar sozinho, com 10 s por tentativa (valor ajustável, a revisar com o hardware real). Se não der na primeira tentativa, tenta de novo. Se também não der, pergunta se a pessoa quer tentar de novo ou voltar à Tela inicial. Essa pergunta não tem limite de tempo. "Tentar de novo" é o botão principal e "Voltar ao início" o secundário.  
3. **Triagem de saúde: modelo PAR-Q, provisório.** É o questionário padrão que os sites de academia da região usam para reserva de aulas, mantido até haver validação médica especializada. Responder é obrigatório. Uma resposta "sim" nunca bloqueia: só é registrada, para alimentar o entendimento do app sobre a pessoa. Na v1 as respostas ficam guardadas no aparelho, simulando o backend. Exige consentimento. As perguntas estão em ==docs/triagem-parq.md==. Proposta: aparece uma vez, antes do primeiro exercício.  
4. *(Superada em 25/11: o bloco 7 saiu da v1.)* **"Pedir ajuda ao ZENI" (bloco 7)** significa definir um comando de voz: a pessoa fala ou escreve o que quer mudar e o app ajusta (ligado a "Comandos de voz", bloco 6). O site se chama ZENI, igual ao dispositivo.  
5. **Pausa.** Seguir o que o fluxo precisa e não a seta da imagem. "Pausar" (por botão ou voz) e a pausa automática por dificuldade levam a um estado Pausado (2.8a), com "Continuar" e "Terminar". A imagem leva direto ao Fim do exercício.  
6. *(Superada em 25/11: a v1 tem quatro comandos, ver decisão 5 de 25/11.)* **Voz na v1: um único comando, "pausar".** Só vale durante o exercício. O botão Pausar continua sempre na tela como alternativa. Mais comandos, e escolher a palavra de cada um, ficam para a v2.  
7. *(Superada em 25/11: o bloco 7 saiu da v1.)* **Bloco 7 na v1: só por texto, sem voz e sem IA de verdade.** O app reconhece poucos pedidos por palavra-chave (por exemplo, texto maior ou tom mais discreto). Proposta para caber no prazo.  
8. **Entrega: site mobile.** Tornar instalável (PWA) fica para depois.  
9. **Conectar o ZENI sem destino na Home.** A Home não tem atalho para conectar. Quando o ZENI não está conectado, mostra no topo um aviso de informação "O ZENI não está conectado" com o botão "Conectar". O aviso some ao conectar ou quando a pessoa o empurra para cima. A conexão (1.6) volta à Tela inicial.  
10. **Encadeamento do primeiro uso.** Cada fluxo termina na Tela inicial, como no fluxograma. A conexão (1.6) não segue direto para o exercício: a pessoa volta à Home e toca em "Começar o exercício" de novo.  
⸻  
## Tela inicial (Home)  
  
- **H.1** [Pessoa] Abre o app.  
- **H.2** [Vê] Tela de abertura.  
**H.3** [Vê] Tela inicial (atualizada em 25/11, decisão 10), de cima para baixo:

| Elemento | O que é |
| -------- | ------- |
| Avatar | Inicial da pessoa. Abre o menu suspenso com Personalizar (bloco 6) e Conexão com o ZENI (bloco 1) |
| Pílula de bateria | Bateria do ZENI, no topo, ao lado do avatar |
| Dashboard | Suavidade e ritmo |
| Minha evolução | Botão, lado esquerdo (bloco 4) |
| Começar o exercício | Botão, lado direito (bloco 2) |

O fundo é um gradiente em formato de bulb. "Pedir ajuda ao ZENI" (bloco 7) está fora da v1. A ordem e o formato visual dos itens estão no design system, seção 6.2.

## 1. Conectar com o ZENI  
  
- **1.1** [Pessoa] Toca em "Conectar o ZENI".  
- **1.2** [ZENI] "O app procura o ZENI".  
- **1.3** [Vê e sente] "Conectado: o ZENI vibra suavemente".  
- **1.4** [Vê] "Apoiar o ZENI na mesa por 3 segundos".  
- **1.5** [ZENI] "O ZENI aprende sua posição inicial".  
- **1.6** Volta à Tela inicial.  
  
## 2. Exercícios  
  
- **2.1** [Pessoa, IA] "Ver o exercício do dia sugerido pelo app".  
- **2.1a** [App, IA] "O app aprende o seu ritmo a cada exercício e usa como referência". Acontece em segundo plano e ajuda a escolher o exercício de 2.1.  
- **2.2** [Vê] "Ver como segurar e se posicionar".  
- **2.3** [Pessoa] "Tocar em Começar".  
- **2.4** [ZENI] "O ZENI acompanha seus movimentos".  
- **2.4a** Fora da v1. A imagem ainda mostra "A música escolhida começa a tocar" e "Passar a música"; ignorar na v1 (ver Decisões e Versão 2).  
- **2.5** [App, IA] "O app compara seus movimentos com o seu ritmo habitual".  
- **2.6** [Vê e sente] "Luz e vibração marcam o ritmo e a tela mostra o tamanho do movimento".  
- **2.7** [App] "Exercício acabou?" Se não, volta a 2.5 (o ciclo 2.5, 2.6, 2.7 se repete). Se sim, vai a 2.9.  
- **2.8** A qualquer momento a partir de 2.6: [Pessoa] "Pausar o exercício: tocando em Pausar ou falando 'pausar'". Vai a 2.8a (decisão 5).  
- **2.8a** [Vê] Pausado, com duas opções. "Continuar" (principal) retoma em 2.5. "Terminar" (secundário) vai a 2.9. A imagem mostra a seta direto para 2.9, mas vale a decisão 5.  
- **2.9** [App] "Fim do exercício". Segue para 3.1.  
  
**Atualização de 25/11:** o exercício do dia é uma série de 3 exercícios, em tela cheia. O ciclo de 2.4 a 2.7 vale para cada exercício da série. A avaliação (bloco 3) só vem depois do terceiro. Em 2.6, a luz e a vibração do dispositivo ficam para a v2: na v1 o ritmo aparece na tela como um pulso amarelo. Durante o exercício a voz reconhece "pausar", "continuar", "terminar" e "repetir", e os botões continuam sempre na tela.

Os casos de erro saem de 2.4 (perda de sinal e bateria) e de 2.5 (muita dificuldade).  
  
## 3. Avaliação  

**Atualização de 25/11:** a avaliação roda uma vez, ao fim da série de 3 exercícios. A nota (3.6) aparece em modal centralizado.  
  
- **3.1** [App] "Avalia tamanho, suavidade e ritmo dos movimentos".  
- **3.2** [App] "Dá uma nota de 0 a 100".  
- **3.3** [App] "Mostrou cansaço?"  
    - Não: **3.4** "Mantém ou aumenta a meta aos poucos".  
    - Sim: **3.5** "Sugere uma pausa ou um exercício mais leve".  
- **3.6** [Vê, IA] "Mostra a nota e escreve um resumo simples, com mensagem de incentivo". Recebe os dois caminhos de 3.3.  
- **3.7** Volta à Tela inicial.  
  
## 4. Acompanhamento  

**Atualização de 25/11:** "Minha evolução" abre direto no dashboard, com o alternador 7/30 dias no topo (4.1 deixa de ser uma escolha antes da tela). Embaixo ficam "Exportar" (Salvar em PDF ou Enviar link, 4.3) à esquerda e "Voltar" à direita (4.4).  
  
- **4.1** [Pessoa] "Tocar em Minha Evolução e escolher 7 ou 30 dias".  
- **4.2** [Vê] "Ver gráficos da evolução".  
- **4.3** [Pessoa] "Salvar em PDF ou enviar link".  
- **4.4** Volta à Tela inicial.  
  
## 6. Personalizar o app  

**Atualização de 25/11:** "Personalizar" abre pelo menu suspenso do avatar. O caminho para o bloco 7 deixa de existir (o bloco saiu da v1).  
  
- **6.0** [Vê] "Tela Personalizar: o ZENI já abre ouvindo, sem precisar tocar em nada". O plano B é ajustar à mão, escolhendo um item ao lado. Desta tela também se pode seguir o fluxo 7 ("Pedir ajuda ao ZENI").  
  
Cinco itens, cada um com a sua sequência. Todos terminam em "Volta à Tela inicial".  

| Item | Passos |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lembretes | Toca em Lembretes e vê a lista. Adiciona um lembrete ou toca em um para editar. Escolhe os dias e o horário do exercício. [Vê] "O app avisa no horário marcado". |
| Aparência | Toca em Aparência e escolhe o tamanho do texto. Escolhe as cores da tela. [Vê] "A tela muda na hora, para ver como fica". Confirma ou volta ao jeito anterior. |
| Comandos de voz | Toca em Comandos de voz e vê a lista de comandos. Escolhe a palavra de cada comando. Testa falando o comando em voz alta. [App] "O app mostra o que entendeu. Se errar, tentar de novo". Na v1: comandos fixos (pausar, continuar, terminar, repetir), sem escolher a palavra (decisão 5 de 25/11). |
| Tom | Toca em Tom e escolhe mais animado ou mais discreto. [Vê] "O app mostra um exemplo de mensagem nesse tom". Confirma o tom. [Vê] "O app usa esse tom nas mensagens". |
| Dados de saúde | Toca em Dados de saúde. [Vê] "O app explica o que guarda e pede permissão". Preenche só o que quiser. Confirma e salva. |
  
  
## 7. Pedir ajuda ao ZENI  

**Fora da v1 (decisão 3 de 25/11).** O bloco fica descrito aqui para a v2, mas não entra na Home nem em Personalizar.  
  
Fluxo direto na Tela inicial.  
  
- **7.1** [Pessoa] "Tocar em Pedir ajuda ao ZENI, na Tela inicial".  
- **7.2** [Pessoa] "Falar ou escrever o que quer mudar".  
- **7.3** [App, IA] "A IA entende o pedido. Se não entender, o app pede para repetir". Se não entender, volta a 7.2.  
- **7.4** [Vê] "O app mostra o que vai mudar, na própria tela".  
- **7.5** [Pessoa] "Tocar em Confirmar, ou em Desfazer para voltar ao jeito anterior".  
- **7.6** Volta à Tela inicial.  
  
**Limite da IA neste fluxo:** ela só mexe em aparência, lembretes, tom e comandos de voz. Dados de saúde só à mão.  
  
**Na v1:** fora (25/11). A proposta anterior, só por texto com interpretação simulada de poucos pedidos (decisão 7 de 24/11), fica como ponto de partida para a v2.  
  
## Casos de erro (Edge Cases)  
  
Aparecem tracejados no fluxograma.  

| Gatilho | Sai de | O que acontece | O que a pessoa vê | Depois |
| ------------------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| "Perdeu o sinal" | 2.4 | "O ZENI perdeu a conexão" | Aviso: "Reconectando ao ZENI" | "Voltou": retoma em 2.4. Se não voltar, segue a decisão 2 (tenta de novo e, se falhar, pergunta) |
| "Bateria fraca" | 2.4 | "Bateria do ZENI acabando" | "Aviso discreto no topo da tela" | O exercício continua. O fluxograma não mostra mais nada. |
| "Muita dificuldade" | 2.5 | "O app percebe muita dificuldade no movimento" | "O exercício pausa sozinho com mensagem de apoio" (estado Pausado, 2.8a) | "Continuar" retoma em 2.5. "Terminar" vai a 2.9 e segue para a Avaliação. A imagem leva direto a 2.9, mas vale a decisão 5 |
  
⸻  
## Relação com o design system  
  
- **Home:** a grade de cinco cartões foi substituída em 25/11 (decisão 10). A seção 6.2 do design system descreve a nova Home.
- **Avisos (seção 6.4):** "Reconectando" corresponde ao aviso de informação, bateria fraca ao de atenção e a pausa por dificuldade ao urgente.  
- **Telas de espera (seção 6.9):** "procurando" corresponde ao passo 1.2 e "abertura" a H.2.  
- **Etiqueta IA (seção 6.6):** o fluxograma marca 2.1, 2.1a, 2.5, 3.6 e 7.3 (o 7.3 fica fora da v1). O design system também prevê a etiqueta em "ajuste da meta" (3.4), que o fluxograma não marca.  
- **Vocabulário:** o fluxograma já fala "exercício" e "o ZENI". Os exemplos do design system ainda dizem "manopla" e "treino". No site, valem os termos do fluxograma.  
  
## Versão 2 (fora da v1)  
  
- **Luz e vibração do dispositivo.** Marcar o ritmo do exercício com luz e vibração no ZENI (2.6). Na v1 o ritmo só aparece na tela, por um pulso amarelo.
- **Música durante o exercício.** Escolher a música, tocar ao começar o exercício e passar a música por toque ("Próxima") ou por voz ("próxima"). Falta definir de onde vem a música e onde ela é escolhida.  
- **Voz completa.** Mais comandos além de "pausar", "continuar", "terminar" e "repetir", e escolher a palavra de cada um.
- **Pedir ajuda ao ZENI (bloco 7).** Volta na v2, por texto e por voz, com IA de verdade.  
- **Backend real.** Guardar no servidor as respostas do PAR-Q e os dados da pessoa.  
- **PWA.** Instalar na tela inicial do celular.  
- **Notificações.** Avisar no horário dos lembretes mesmo com o app fechado, o que exige push e servidor.  
  
## Pontos que o fluxograma não resolve  
  
Decidir antes ou durante a execução. Não assumir sozinho.  
  
1. ~~Dados do exercício após falha de reconexão.~~ Respondido em 25/11 como provisório (decisão 12): o exercício em andamento é descartado, os concluídos ficam registrados sem nota.
2. **PAR-Q.** O modelo é o PAR-Q de 7 perguntas (==docs/triagem-parq.md==). Falta o texto de consentimento para dados de saúde, a revisão da redação em linguagem leve por profissional da área e a decisão sobre uma frase fixa para todos, independente das respostas (por exemplo, que o ZENI não substitui orientação profissional), já que um "sim" não mostra nada à pessoa.  
3. **Primeiro uso e permissões.** Sem histórico, 2.1 e 2.5 não têm ritmo de referência. O microfone (para "pausar") e o Bluetooth não têm passo de permissão no fluxograma.  
4. **Lembretes na v1.** "O app avisa no horário marcado" só funciona com o app aberto. Confirmar que é isso que a v1 entrega.  
5. **Enviar link (4.3).** Falta definir para quem vai, a privacidade desses dados e o layout do PDF (design system, pendência 10).  
6. **Nota de 0 a 100.** Continua em 3.2 e 3.6 (design system, pendência 7).  
7. **Numeração.** O fluxograma pula o número 5, e o bloco de casos de erro não tem número. No código, citar os blocos pelo nome.
8. **Resolvidos em 25/11** (decisões 9 a 14): catálogo, Home, "Repetir", "Terminar" no meio da série (provisório), avatar e Exportar/Voltar.
9. **Regra simples da série do dia.** Falta definir como o exercício de cada grupo alterna a cada dia (por exemplo, por dia da semana ou em rodízio) e o que o app faz quando não há histórico. Também faltam a descrição e a animação de como fazer de cada exercício (A a F).
10. **Home: detalhes.** Qual dos dois botões é o principal (amarelo, 72) e qual é o secundário; o que a pílula de bateria mostra quando o ZENI não está conectado; o que o dashboard mostra sem histórico; e os pontos exatos do gradiente em formato de bulb, dentro dos limites de contraste do design system (seção 2.5).
11. **Enviar link e Salvar em PDF.** Como as duas opções aparecem ao tocar em Exportar (ver também o ponto 5).
