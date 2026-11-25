# Fluxo do app ZENI  
  
Descrição escrita do fluxograma atualizado (==fluxograma.png==). É a referência para construir o site: cada passo vira uma tela ou um estado. Se este texto e a imagem divergirem, vale a imagem e este arquivo deve ser corrigido, exceto nos pontos da seção "Decisões do grupo", que valem mais que a imagem até ela ser atualizada. Os textos entre aspas são os rótulos do fluxograma.  
  
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
## Decisões do grupo (24/11)  
  
Valem mais que a imagem do fluxograma.  
  
1. **Música fica para a v2.** O ramo "A música escolhida começa a tocar" e "Passar a música" não entra na v1. A imagem ainda os mostra e deve ser atualizada.  
2. **Reconexão.** Quando o sinal cai (2.4), o exercício fica em pausa e o app tenta reconectar sozinho, com 10 s por tentativa (valor ajustável, a revisar com o hardware real). Se não der na primeira tentativa, tenta de novo. Se também não der, pergunta se a pessoa quer tentar de novo ou voltar à Tela inicial. Essa pergunta não tem limite de tempo. "Tentar de novo" é o botão principal e "Voltar ao início" o secundário.  
3. **Triagem de saúde: modelo PAR-Q, provisório.** É o questionário padrão que os sites de academia da região usam para reserva de aulas, mantido até haver validação médica especializada. Responder é obrigatório. Uma resposta "sim" nunca bloqueia: só é registrada, para alimentar o entendimento do app sobre a pessoa. Na v1 as respostas ficam guardadas no aparelho, simulando o backend. Exige consentimento. As perguntas estão em ==docs/triagem-parq.md==. Proposta: aparece uma vez, antes do primeiro exercício.  
4. **"Pedir ajuda ao ZENI" (bloco 7)** significa definir um comando de voz: a pessoa fala ou escreve o que quer mudar e o app ajusta (ligado a "Comandos de voz", bloco 6). O site se chama ZENI, igual ao dispositivo.  
5. **Pausa.** Seguir o que o fluxo precisa e não a seta da imagem. "Pausar" (por botão ou voz) e a pausa automática por dificuldade levam a um estado Pausado (2.8a), com "Continuar" e "Terminar". A imagem leva direto ao Fim do exercício.  
6. **Voz na v1: um único comando, "pausar".** Só vale durante o exercício. O botão Pausar continua sempre na tela como alternativa. Mais comandos, e escolher a palavra de cada um, ficam para a v2.  
7. **Bloco 7 na v1: só por texto, sem voz e sem IA de verdade.** O app reconhece poucos pedidos por palavra-chave (por exemplo, texto maior ou tom mais discreto). Proposta para caber no prazo.  
8. **Entrega: site mobile.** Tornar instalável (PWA) fica para depois.  
9. **Conectar o ZENI sem destino na Home.** A Home não tem atalho para conectar. Quando o ZENI não está conectado, mostra no topo um aviso de informação "O ZENI não está conectado" com o botão "Conectar". O aviso some ao conectar ou quando a pessoa o empurra para cima. A conexão (1.6) volta à Tela inicial.  
10. **Encadeamento do primeiro uso.** Cada fluxo termina na Tela inicial, como no fluxograma. A conexão (1.6) não segue direto para o exercício: a pessoa volta à Home e toca em "Começar o exercício" de novo.  
⸻  
## Tela inicial (Home)  
  
- **H.1** [Pessoa] Abre o app.  
- **H.2** [Vê] Tela de abertura.  
**H.3** [Vê] Tela inicial, com cinco destinos:  

| Destino             | Leva ao bloco |
| ------------------- | ------------- |
| Conectar o ZENI     | 1             |
| Começar o exercício | 2             |
| Minha evolução      | 4             |
| Personalizar        | 6             |
| Pedir ajuda ao ZENI | 7             |
  
  
O fluxograma não define a ordem nem o formato dos cinco destinos na tela.  
  
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
  
Os casos de erro saem de 2.4 (perda de sinal e bateria) e de 2.5 (muita dificuldade).  
  
## 3. Avaliação  
  
- **3.1** [App] "Avalia tamanho, suavidade e ritmo dos movimentos".  
- **3.2** [App] "Dá uma nota de 0 a 100".  
- **3.3** [App] "Mostrou cansaço?"  
    - Não: **3.4** "Mantém ou aumenta a meta aos poucos".  
    - Sim: **3.5** "Sugere uma pausa ou um exercício mais leve".  
- **3.6** [Vê, IA] "Mostra a nota e escreve um resumo simples, com mensagem de incentivo". Recebe os dois caminhos de 3.3.  
- **3.7** Volta à Tela inicial.  
  
## 4. Acompanhamento  
  
- **4.1** [Pessoa] "Tocar em Minha Evolução e escolher 7 ou 30 dias".  
- **4.2** [Vê] "Ver gráficos da evolução".  
- **4.3** [Pessoa] "Salvar em PDF ou enviar link".  
- **4.4** Volta à Tela inicial.  
  
## 6. Personalizar o app  
  
- **6.0** [Vê] "Tela Personalizar: o ZENI já abre ouvindo, sem precisar tocar em nada". O plano B é ajustar à mão, escolhendo um item ao lado. Desta tela também se pode seguir o fluxo 7 ("Pedir ajuda ao ZENI").  
  
Cinco itens, cada um com a sua sequência. Todos terminam em "Volta à Tela inicial".  

| Item | Passos |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lembretes | Toca em Lembretes e vê a lista. Adiciona um lembrete ou toca em um para editar. Escolhe os dias e o horário do exercício. [Vê] "O app avisa no horário marcado". |
| Aparência | Toca em Aparência e escolhe o tamanho do texto. Escolhe as cores da tela. [Vê] "A tela muda na hora, para ver como fica". Confirma ou volta ao jeito anterior. |
| Comandos de voz | Toca em Comandos de voz e vê a lista de comandos. Escolhe a palavra de cada comando. Testa falando o comando em voz alta. [App] "O app mostra o que entendeu. Se errar, tentar de novo". Na v1: só existe o comando "pausar", fixo, sem escolher a palavra (decisão 6). |
| Tom | Toca em Tom e escolhe mais animado ou mais discreto. [Vê] "O app mostra um exemplo de mensagem nesse tom". Confirma o tom. [Vê] "O app usa esse tom nas mensagens". |
| Dados de saúde | Toca em Dados de saúde. [Vê] "O app explica o que guarda e pede permissão". Preenche só o que quiser. Confirma e salva. |
  
  
## 7. Pedir ajuda ao ZENI  
  
Fluxo direto na Tela inicial.  
  
- **7.1** [Pessoa] "Tocar em Pedir ajuda ao ZENI, na Tela inicial".  
- **7.2** [Pessoa] "Falar ou escrever o que quer mudar".  
- **7.3** [App, IA] "A IA entende o pedido. Se não entender, o app pede para repetir". Se não entender, volta a 7.2.  
- **7.4** [Vê] "O app mostra o que vai mudar, na própria tela".  
- **7.5** [Pessoa] "Tocar em Confirmar, ou em Desfazer para voltar ao jeito anterior".  
- **7.6** Volta à Tela inicial.  
  
**Limite da IA neste fluxo:** ela só mexe em aparência, lembretes, tom e comandos de voz. Dados de saúde só à mão.  
  
**Na v1:** só por texto, com interpretação simulada de poucos pedidos (decisão 7).  
  
## Casos de erro (Edge Cases)  
  
Aparecem tracejados no fluxograma.  

| Gatilho | Sai de | O que acontece | O que a pessoa vê | Depois |
| ------------------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| "Perdeu o sinal" | 2.4 | "O ZENI perdeu a conexão" | Aviso: "Reconectando ao ZENI" | "Voltou": retoma em 2.4. Se não voltar, segue a decisão 2 (tenta de novo e, se falhar, pergunta) |
| "Bateria fraca" | 2.4 | "Bateria do ZENI acabando" | "Aviso discreto no topo da tela" | O exercício continua. O fluxograma não mostra mais nada. |
| "Muita dificuldade" | 2.5 | "O app percebe muita dificuldade no movimento" | "O exercício pausa sozinho com mensagem de apoio" (estado Pausado, 2.8a) | "Continuar" retoma em 2.5. "Terminar" vai a 2.9 e segue para a Avaliação. A imagem leva direto a 2.9, mas vale a decisão 5 |
  
⸻  
## Relação com o design system  
  
- **Home:** os cinco destinos de H.3 substituem os cinco atalhos provisórios do design system (pendência 11). A ordem e o formato dos cartões continuam em aberto.  
- **Avisos (seção 6.4):** "Reconectando" corresponde ao aviso de informação, bateria fraca ao de atenção e a pausa por dificuldade ao urgente.  
- **Telas de espera (seção 6.9):** "procurando" corresponde ao passo 1.2 e "abertura" a H.2.  
- **Etiqueta IA (seção 6.6):** o fluxograma marca 2.1, 2.1a, 2.5, 3.6 e 7.3. O design system também prevê a etiqueta em "ajuste da meta" (3.4), que o fluxograma não marca.  
- **Vocabulário:** o fluxograma já fala "exercício" e "o ZENI". Os exemplos do design system ainda dizem "manopla" e "treino". No site, valem os termos do fluxograma.  
  
## Versão 2 (fora da v1)  
  
- **Música durante o exercício.** Escolher a música, tocar ao começar o exercício e passar a música por toque ("Próxima") ou por voz ("próxima"). Falta definir de onde vem a música e onde ela é escolhida.  
- **Voz completa.** Mais comandos além de "pausar" e escolher a palavra de cada um. Bloco 7 por voz e com IA de verdade.  
- **Backend real.** Guardar no servidor as respostas do PAR-Q e os dados da pessoa.  
- **PWA.** Instalar na tela inicial do celular.  
- **Notificações.** Avisar no horário dos lembretes mesmo com o app fechado, o que exige push e servidor.  
  
## Pontos que o fluxograma não resolve  
  
Decidir antes ou durante a execução. Não assumir sozinho.  
  
1. **Dados do exercício após falha de reconexão.** Se a pessoa escolher "Voltar ao início", o exercício parcial é descartado ou guardado sem nota?  
2. **PAR-Q.** O modelo é o PAR-Q de 7 perguntas (==docs/triagem-parq.md==). Falta o texto de consentimento para dados de saúde, a revisão da redação em linguagem leve por profissional da área e a decisão sobre uma frase fixa para todos, independente das respostas (por exemplo, que o ZENI não substitui orientação profissional), já que um "sim" não mostra nada à pessoa.  
3. **Primeiro uso e permissões.** Sem histórico, 2.1 e 2.5 não têm ritmo de referência. O microfone (para "pausar") e o Bluetooth não têm passo de permissão no fluxograma.  
4. **Lembretes na v1.** "O app avisa no horário marcado" só funciona com o app aberto. Confirmar que é isso que a v1 entrega.  
5. **Enviar link (4.3).** Falta definir para quem vai, a privacidade desses dados e o layout do PDF (design system, pendência 10).  
6. **Nota de 0 a 100.** Continua em 3.2 e 3.6 (design system, pendência 7).  
7. **Numeração.** O fluxograma pula o número 5, e o bloco de casos de erro não tem número. No código, citar os blocos pelo nome.9. **Conectar o ZENI sem destino na Home.** A Home não tem atalho para conectar. Quando o ZENI não está conectado, mostra no topo um aviso de informação "O ZENI não está conectado" com o botão "Conectar". O aviso some ao conectar ou quando a pessoa o empurra para cima. A conexão (1.6) volta à Tela inicial.  
8. 10. **Encadeamento do primeiro uso.** Cada fluxo termina na Tela inicial, como no fluxograma. A conexão (1.6) não segue direto para o exercício: a pessoa volta à Home e toca em "Começar o exercício" de novo.  
