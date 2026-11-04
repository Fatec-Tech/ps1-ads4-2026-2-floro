# [Aula02] Exercícios de Fixação: Requisições Assíncronas e Tratamento de Erros

Implemente os exercícios de fixação para praticar a busca de dados assíncronos via `fetch`, manipulação de estado na tela e tratamento de erros na aplicação.

**Tarefas a serem desenvolvidas:**

- [x] **Simulação de Latência:** Adicionar um `setTimeout` de 1 segundo dentro da função (antes do `fetch`) para visualizar a mensagem "Carregando pacientes..." antes da exibição dos dados.
- [x] **Contador por Origem:** Exibir na página a quantidade de pacientes oriundos do arquivo JSON versus os cadastrados manualmente na sessão atual.
- [x] **Tratamento de Lista Vazia:** Tratar o caso em que o `pacientes.json` retorna um array vazio (`[]`), exibindo a mensagem "Nenhum paciente cadastrado ainda" no lugar da tabela.
- [x] **Tratamento de Erro Amigável:** Forçar um erro proposital (ex: alterar a URL do `fetch` para um arquivo inexistente) e exibir uma mensagem de erro clara e amigável para o usuário na interface.

**Pontos de atenção para evitar erros comuns:**

- Rodar o projeto através de um servidor local (ex: Live Server com `http://`) para evitar bloqueios de CORS e falhas no `fetch`.
- Usar `await` ao chamar `resposta.json()`.
- Erros capturados no bloco `try...catch` fornecem feedback visual ao usuário, e não apenas no `console.log`.

**Onde está:** `aula02-cadastro-pacientes/` (`index.html` e `js/app.js`). Para testar o erro, troque `URL_DADOS` por `'data/inexistente.json'`.
