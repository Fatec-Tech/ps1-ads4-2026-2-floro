# Aula 4 — Express e CRUD Completo + Deploy no Render

Sistema de cadastro de pacientes em duas camadas:

```
aula-04-cadastro-pacientes/
├── backend/   → API REST com Node.js + Express (dados em memória)
└── frontend/  → HTML + Bootstrap + Fetch API (criar, listar, editar e excluir)
```

## Como rodar localmente

1. **Backend**
   ```bash
   cd backend
   npm install
   npm start          # ou: npm run dev (reinicia a cada alteração)
   ```
   A porta vem de `process.env.PORT || 3000`.
2. **Frontend:** abra `frontend/` com o **Live Server** (`http://127.0.0.1:5500`).
   Em `localhost`/`127.0.0.1` o `app.js` usa automaticamente `http://localhost:3000/pacientes`;
   publicado no Render ele usa a URL pública da API.

## Mapa do CRUD

| Operação | Método | Endpoint | Sucesso | Erros possíveis |
|---|---|---|---|---|
| Create | `POST` | `/pacientes` | `201` + paciente criado | `400`, `409` |
| Read (lista) | `GET` | `/pacientes` (aceita `?nome=ana`) | `200` + array | — |
| Read (total) | `GET` | `/pacientes/total` | `200` + `{ "total": N }` | — |
| Read (um) | `GET` | `/pacientes/:id` | `200` + paciente | `404` |
| Update (completo) | `PUT` | `/pacientes/:id` | `200` + paciente atualizado | `400`, `404`, `409` |
| Update (parcial) | `PATCH` | `/pacientes/:id` | `200` + paciente atualizado | `400`, `404`, `409` |
| Delete | `DELETE` | `/pacientes/:id` | `204` sem corpo | `404` |

Validações do `POST`/`PUT`/`PATCH`: campos obrigatórios (`400`), formato de e-mail (`400`), data de nascimento válida e não futura (`400`) e e-mail repetido (`409 Conflict`).

## Deploy no Render

Os dois serviços saem do mesmo repositório, então use **Root Directory** para apontar a pasta de cada um.

**Backend — Web Service** (nome: `api-clinica-floro`)

| Campo | Valor |
|---|---|
| Root Directory | `aula-04-cadastro-pacientes/backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

**Frontend — Static Site** (nome: `app-clinica-floro`)

| Campo | Valor |
|---|---|
| Root Directory | `aula-04-cadastro-pacientes/frontend` |
| Build Command | *(vazio)* |
| Publish Directory | `.` |

Links de entrega (preencher após o deploy):

- Repositório: https://github.com/SEU_USUARIO/ps1-ads4-2026-2-floro
- Backend: https://api-clinica-floro.onrender.com/pacientes
- Frontend: https://app-clinica-floro.onrender.com

> ⚠️ A API é pública e os dados ficam em memória: **não cadastre dados reais**. No plano gratuito o serviço "dorme" após ~15 min sem uso, e a primeira requisição pode levar ~1 minuto; ao reiniciar, os dados voltam ao estado inicial.

## Testando com `curl`

```bash
curl http://localhost:3000/pacientes
curl http://localhost:3000/pacientes/total
curl "http://localhost:3000/pacientes?nome=ana"
curl -X POST http://localhost:3000/pacientes -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Lima","email":"carlos@email.com","nascimento":"1995-02-20"}'
curl -X PUT http://localhost:3000/pacientes/4 -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Lima Jr.","email":"carlos@email.com","nascimento":"1995-02-20"}'
curl -X PATCH http://localhost:3000/pacientes/4 -H "Content-Type: application/json" \
  -d '{"nome":"Carlos L."}'
curl -X DELETE http://localhost:3000/pacientes/4
```

## Exercícios e extensões implementados

- [x] `GET /pacientes/total` retornando `{ "total": N }` (declarada **antes** de `/pacientes/:id`).
- [x] Impedir e-mail repetido com status `409`.
- [x] Filtro por nome: `GET /pacientes?nome=ana`.
- [x] `DELETE /pacientes/999` → `404` e `POST /pacientes` com corpo vazio → `400`.
- [x] Validar formato do e-mail e rejeitar nascimento no futuro (`400` com mensagem clara).
- [x] `PATCH /pacientes/:id` para atualização parcial.
- [x] Frontend exibe a mensagem de erro específica vinda da API (ex.: "E-mail já cadastrado").

As respostas teóricas (itens 8 e 11 do material) estão em [`../issues/`](../issues).
