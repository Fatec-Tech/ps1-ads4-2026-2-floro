# [Aula04] Estudo Dirigido: Perguntas para Discussão em Sala (item 11)

1. Por que usamos métodos HTTP diferentes (GET, POST, PUT, DELETE) se poderíamos usar sempre `POST` para tudo?
2. Qual a diferença entre `/pacientes` e `/pacientes/5`? O que cada URL representa?
3. Por que a API devolve `201` ao criar e `404` ao não encontrar, em vez de sempre `200`?
4. O frontend poderia ser trocado por outro (um app de celular, por exemplo) sem mudar nada no backend? Por quê?
5. Nossos dados voltam ao estado inicial quando o servidor reinicia. Onde deveriam ficar guardados para sobreviver? (gancho para o banco de dados)

<!-- COMENTARIO -->
## Respostas

### 1. Por que métodos HTTP diferentes?
O método comunica a **intenção** da requisição, e toda a infraestrutura da Web (navegadores, caches, proxies, ferramentas) usa essa informação. `GET` é **seguro** (não altera dados) e **idempotente**, por isso pode ser cacheado e repetido sem risco; `PUT` e `DELETE` são idempotentes; `POST` não é. Com métodos distintos o código do servidor também fica mais claro (uma rota por operação, sem precisar olhar o corpo para saber o que fazer) e a API vira padrão e previsível para qualquer pessoa. Usar só `POST` jogaria fora tudo isso.

### 2. `/pacientes` vs `/pacientes/5`
`/pacientes` representa a **coleção** de pacientes (`GET` lista todos, `POST` cria um novo). `/pacientes/5` representa **um recurso específico**, o paciente de id 5 (`GET` busca, `PUT`/`PATCH` atualiza, `DELETE` remove).

### 3. Por que `201` e `404`?
O status comunica **o que aconteceu**: `201 Created` diz que algo novo foi criado (e devolvemos o recurso com seu `id`); `404 Not Found` diz que o recurso pedido não existe. Os clientes (e o `fetch`, com `resposta.ok`) decidem o que fazer com base no status. Se tudo fosse `200`, o front teria que "adivinhar" lendo o corpo se deu certo, e erros ficariam escondidos, pois o `fetch` **não** lança exceção em `404`/`500`.

### 4. Trocar o frontend
**Sim.** O contrato entre as partes é **HTTP + JSON**, e o backend não sabe nem se importa com quem o chama: um app mobile, outro site, o `curl` ou o Postman consomem a mesma API. (Só o navegador exige o CORS liberado; apps nativos não passam por essa restrição.) Essa independência é um dos principais motivos de separar frontend e backend.

### 5. Onde guardar os dados?
Os pacientes ficam num **array dentro do processo** do Node; quando o servidor reinicia (novo deploy ou quando o Render "dorme" e acorda) o processo recomeça e o array volta ao inicial. Para sobreviver, os dados devem ficar **fora do processo da API, em um banco de dados persistente** (como o PostgreSQL da Aula 5), que a API consulta e atualiza a cada requisição.
