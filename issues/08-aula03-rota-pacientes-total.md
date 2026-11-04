# [Aula03] Nova rota GET /pacientes/total

Crie uma verificação no `server.js` para responder ao endpoint `/pacientes/total` retornando o objeto `{ "total": N }`.

**Critérios de aceite**

- [x] `GET /pacientes/total` responde `200` com `{ "total": N }`, onde `N` é calculado a partir do array em memória (`pacientes.length`).
- [x] A rota `GET /pacientes` continua funcionando.
- [x] Rotas desconhecidas continuam respondendo `404`.

**Como testar:** `cd aula-03-cadastro-pacientes/backend && npm start` e abrir `http://localhost:3000/pacientes/total`.
