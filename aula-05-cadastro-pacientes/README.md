# Aula 5 (material "Aula 09") — Persistindo dados com PostgreSQL no Supabase

Mesma API da Aula 4, agora guardando os pacientes em um **banco PostgreSQL** (Supabase). Rotas, métodos e JSON continuam iguais, então o **frontend não mudou nenhuma linha**.

```
aula-05-cadastro-pacientes/
├── backend/
│   ├── package.json
│   ├── server.js              → rotas do CRUD com SQL parametrizado ($1, $2...)
│   ├── banco.js               → Pool do pg (lê DATABASE_URL e DB_SSL)
│   ├── scripts/
│   │   ├── schema.sql         → CREATE TABLE + ALTER TABLE (telefone) + dados iniciais
│   │   └── criar-tabela.js    → executa o schema.sql (npm run db:setup)
│   ├── .env.example           → modelo do .env (o .env verdadeiro NÃO vai para o Git)
│   └── .gitignore             → node_modules/ e .env
└── frontend/                  → igual ao da Aula 4
```

## Como rodar

1. Crie o projeto no Supabase e copie a string do **Session pooler** (botão *Connect*), trocando `[YOUR-PASSWORD]` pela senha (use senha só com letras e números).
2. Em `backend/`, copie `.env.example` para `.env` e preencha:
   ```
   DATABASE_URL=sua-string-do-session-pooler
   DB_SSL=true
   ```
3. Instale, crie a tabela e suba o servidor:
   ```bash
   cd backend
   npm install
   npm run db:setup     # Tabela "pacientes" pronta.
   npm run dev
   ```
   `--env-file` exige **Node 20.6 ou superior** (`node -v`).
4. No Render (serviço da API): aba *Environment* → `DATABASE_URL` e `DB_SSL=true`; em *Settings*, **Root Directory** = `aula-05-cadastro-pacientes/backend`. Depois `git push`.

## Mapa CRUD → HTTP → SQL

| Operação | Endpoint | SQL |
|---|---|---|
| Create | `POST /pacientes` | `INSERT INTO pacientes ... RETURNING ...` |
| Read (lista) | `GET /pacientes` (aceita `?nome=ana`) | `SELECT ... ORDER BY id` / `WHERE nome ILIKE $1` |
| Read (total) | `GET /pacientes/total` | `SELECT COUNT(*) FROM pacientes` |
| Read (um) | `GET /pacientes/:id` | `SELECT ... WHERE id = $1` |
| Update | `PUT` / `PATCH /pacientes/:id` | `UPDATE pacientes SET ... WHERE id = $n RETURNING ...` |
| Delete | `DELETE /pacientes/:id` | `DELETE FROM pacientes WHERE id = $1` |

## Exercícios (item 8)

- [x] E-mail repetido → `409` (restrição `UNIQUE` do banco, erro `23505` traduzido pela API)
- [x] `GET /pacientes/total` com `SELECT COUNT(*)` (declarada antes de `/pacientes/:id`)
- [x] Busca `GET /pacientes?nome=ana` com `ILIKE`
- [x] Coluna `telefone` via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (opcional na API; o frontend atual não a usa)

As respostas dos itens 8 e 11 estão em [`../issues/`](../issues) (arquivos `13` e `14`).

> ⚠️ Dados **fictícios** apenas: a API é pública e sem autenticação. Nunca envie o `.env` ao GitHub; se isso acontecer, troque a senha do banco.
