# ps1-ads4-2026-2-floro

**Disciplina:** Programação de Scripts I — Backend
**Aluno:** Guilherme Floro

Repositório com as aulas e atividades da disciplina. O projeto principal é um **cadastro de pacientes** que evolui a cada aula: começa 100% no navegador e termina como uma aplicação com API REST em Node.js/Express publicada no Render.

## Aulas e atividades

| Pasta | Conteúdo | Status |
|---|---|---|
| [`aula01-cadastro-pacientes`](aula01-cadastro-pacientes) | Formulário + array + tabela (Vanilla JS). Exercícios (telefone, idade, contador, e-mail único) e extensões (remover, busca, ordenação, `localStorage`) | ✅ |
| [`aula02-cadastro-pacientes`](aula02-cadastro-pacientes) | Fetch API lendo `data/pacientes.json`. Exercícios: latência, contador por origem, lista vazia, erro amigável | ✅ |
| [`aula02a-poke-api`](aula02a-poke-api) | Pokédex com PokéAPI + desafio do modal de detalhes | ✅ |
| [`aula02b-jsonplaceholder-api`](aula02b-jsonplaceholder-api) | Usuários e posts (JSONPlaceholder) com requisições encadeadas e exercícios | ✅ |
| [`aula03-primeiro-server`](aula03-primeiro-server) | "Hello World" com o módulo `http` do Node.js | ✅ |
| [`aula-03-cadastro-pacientes`](aula-03-cadastro-pacientes) | Atividade 06 — primeiro backend (`backend/` + `frontend/`), rota `/pacientes/total` | ✅ |
| [`aula-04-cadastro-pacientes`](aula-04-cadastro-pacientes) | API REST com Express (CRUD completo) + frontend + deploy no Render | ✅ código · ⏳ deploy |

## Issues

As respostas teóricas e os checklists das atividades estão em [`issues/`](issues). O script `issues/criar-issues.sh` cria todas as issues no GitHub de uma vez (veja o cabeçalho do script).

## Como rodar

- **Aulas 1, 2, 2a e 2b:** abra a pasta com o **Live Server** do VS Code (as aulas com `fetch` não funcionam por duplo clique/`file://`).
- **Aulas 3 e 4:** em `backend/` rode `npm install` (Aula 4) e `npm start`; depois abra `frontend/` com o Live Server. Detalhes no README de cada pasta.
