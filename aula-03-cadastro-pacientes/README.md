# Aula 3 — Primeiro Backend (Node.js + módulo `http`)

Atividade 06: servidor Node.js na porta `3000` fornecendo a API em JSON e frontend consumindo via Fetch API.

```
aula-03-cadastro-pacientes/
├── backend/   → servidor Node.js (módulo http nativo, sem dependências)
└── frontend/  → HTML + CSS + JS (fetch para http://localhost:3000/pacientes)
```

> O "Hello World" do passo 3.1 do tutorial está na pasta `../aula03-primeiro-server`.

## Como rodar

1. **Backend** (deixe esse terminal aberto):
   ```bash
   cd backend
   npm start
   ```
2. **Frontend:** abra a pasta `frontend/` com a extensão **Live Server** do VS Code (normalmente `http://127.0.0.1:5500`).
3. A tabela deve ser preenchida com os pacientes vindos da porta `3000`.

## Rotas

| Método | Rota | Resposta |
|---|---|---|
| GET | `/pacientes` | `200` + lista de pacientes |
| GET | `/pacientes/total` | `200` + `{ "total": N }` |
| qualquer outra | — | `404` + `{ "erro": "Rota não encontrada" }` |

## Exercícios práticos

- [x] **Nova rota `GET /pacientes/total`** — implementada em `backend/server.js`, retorna o total calculado a partir do array (`{ "total": 4 }` com os pacientes atuais).
- [x] **Adição dinâmica de dados** — quarto paciente (`Carlos Lima`) adicionado no array do servidor; ao recarregar o frontend ele aparece sem nenhuma mudança no código do cliente.
- [x] **Simulação de falha** — com o servidor parado (`Ctrl + C`), ao atualizar o navegador o `catch` do `app.js` exibe **"Erro ao carregar pacientes. O servidor está rodando?"** no lugar da tabela.
