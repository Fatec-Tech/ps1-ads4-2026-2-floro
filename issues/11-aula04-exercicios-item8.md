# [Aula04] Exercícios Práticos (item 8): total, e-mail único, filtro e testes de erro

Exercícios do item 8 do material da Aula 4 (Express e CRUD completo).

1. **`GET /pacientes/total`**, retornando `{ "total": N }`. Dica: onde essa rota precisa ficar em relação a `/pacientes/:id`? Teste das duas formas e explique o resultado.
2. Impedir o cadastro de dois pacientes com o **mesmo e-mail**, devolvendo status **409** (Conflict).
3. Suportar **filtro por nome** na listagem: `GET /pacientes?nome=ana` (use `req.query.nome`).
4. Testar no `curl`/Thunder Client o que acontece em `DELETE /pacientes/999` e `POST /pacientes` com body vazio. Os status estão como esperado?

**Critérios de aceite**

- [x] `GET /pacientes/total` → `200 {"total": N}`.
- [x] `POST /pacientes` com e-mail repetido → `409 {"erro":"E-mail já cadastrado"}` (também em `PUT`/`PATCH`, ignorando o próprio paciente).
- [x] `GET /pacientes?nome=ana` → somente pacientes cujo nome contém "ana" (sem diferenciar maiúsculas/minúsculas).
- [x] `DELETE /pacientes/999` → `404`; `POST /pacientes` sem body → `400`.

**Extensões (item 9) também implementadas**

- [x] Validar o formato do e-mail e rejeitar data de nascimento no futuro (`400` com mensagem clara).
- [x] `PATCH /pacientes/:id` para atualização parcial (diferença para o `PUT`: o `PUT` substitui o recurso inteiro e exige todos os campos; o `PATCH` altera só os campos enviados).
- [x] O frontend exibe a mensagem de erro específica vinda da API (ex.: "E-mail já cadastrado").

**Onde está:** `aula-04-cadastro-pacientes/backend/server.js`.

<!-- COMENTARIO -->
## Resultados dos testes

### 1. Posição da rota `/pacientes/total`
- **Declarada ANTES de `/pacientes/:id`:** `GET /pacientes/total` → `200 {"total":3}`.
- **Declarada DEPOIS de `/pacientes/:id`:** `GET /pacientes/total` → `404 {"erro":"Paciente não encontrado"}`.

**Explicação:** o Express avalia as rotas **na ordem em que foram declaradas** e usa a primeira que casar. `/pacientes/:id` casa com qualquer valor, inclusive a palavra `total`; então `req.params.id` vira `"total"`, `Number("total")` é `NaN` e nenhum paciente é encontrado (404). Regra: **rotas específicas vêm antes das genéricas**.

### 2. E-mail repetido
```
POST /pacientes {"nome":"Dup","email":"CARLOS@email.com",...}
→ 409 {"erro":"E-mail já cadastrado"}
```
A comparação ignora maiúsculas/minúsculas e espaços.

### 3. Filtro por nome
```
GET /pacientes?nome=ana → 200 [{"id":3,"nome":"Ana Costa",...}]
```

### 4. Casos de erro
| Requisição | Status | Esperado? |
|---|---|---|
| `DELETE /pacientes/999` | `404` `{"erro":"Paciente não encontrado"}` | ✅ sim, o recurso não existe |
| `POST /pacientes` com body vazio (`{}` ou sem body) | `400` `{"erro":"Nome, e-mail e nascimento são obrigatórios"}` | ✅ sim, requisição inválida |

O uso de `req.body ?? {}` evita um erro `500` quando o cliente não envia corpo/`Content-Type`.
