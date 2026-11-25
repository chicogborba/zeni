# Triagem de saúde (PAR-Q)

Modelo provisório até haver validação médica especializada. Decisão do grupo de 24/11 (ver `docs/fluxo-do-app.md`, decisão 3). A tela está descrita na seção 6.12 do design system.

## O que é

PAR-Q (Physical Activity Readiness Questionnaire, ou Questionário de Prontidão para Atividade Física) é uma triagem rápida com respostas sim ou não. Serve para identificar se há necessidade de avaliação médica antes de iniciar ou aumentar a intensidade de exercícios físicos. É o modelo que os sites de academia da região usam para reserva de aulas.

## Perguntas (texto original, 7 questões)

1. Algum médico já disse que você possui algum problema de coração e que só deveria realizar atividade física se supervisionado por profissionais de saúde?
2. Você sente dores no peito quando pratica atividade física?
3. No último mês, você sentiu dores no peito (em atividade física ou em repouso)?
4. Você apresenta algum desequilíbrio devido à tontura e/ou perda de consciência?
5. Você possui algum problema ósseo ou articular que poderia piorar com a atividade física?
6. Atualmente, algum médico está prescrevendo medicamento para pressão arterial ou problema de coração?
7. Você sabe de qualquer outra razão pela qual não deva praticar atividade física?

## Como o ZENI usa as respostas

- Responder é obrigatório. Proposta: uma vez, antes do primeiro exercício.
- Um "sim" nunca bloqueia nem muda o fluxo. A resposta só é registrada.
- Cada resposta guarda: número da pergunta (1 a 7), resposta (sim ou não) e data e hora.
- Na v1 o registro fica no aparelho, simulando o servidor. Depois, vai para o backend, para alimentar o entendimento do app sobre a pessoa.
- Nenhuma resposta mostra alerta, ícone de aviso ou cor diferente.
- O registro exige consentimento antes de guardar (texto a definir).

## Interpretação padrão do questionário (só referência)

- Tudo "não": em geral indica prontidão para iniciar ou progredir nos exercícios, com adaptação gradual.
- Pelo menos um "sim": o questionário recomenda conversar com um médico antes de iniciar ou aumentar o nível de atividade, levando o questionário e apontando os itens com resposta afirmativa. Alguns locais também exigem atestado ou termo de responsabilidade.

O ZENI não aplica essa orientação sozinho: pela decisão do grupo, o "sim" só documenta.

## Pendências

1. **Linguagem leve.** O design system pede linguagem leiga, mas as perguntas acima são o texto original. Mudar a redação de um questionário de saúde precisa de revisão de profissional da área. Até lá, usar o texto original.
2. **Consentimento.** Escrever o texto de consentimento para guardar dados de saúde (LGPD).
3. **Frase fixa.** Decidir se todas as pessoas veem uma frase igual ao fim, independente das respostas (por exemplo, que o ZENI não substitui orientação profissional), já que um "sim" não mostra nada.
