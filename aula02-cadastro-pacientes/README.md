# Aula 2 — Consumindo Dados com Fetch API

O cadastro de pacientes agora inicia carregando os pacientes de `data/pacientes.json` com `fetch` + `async/await`.

> ⚠️ Rode com um servidor local (extensão **Live Server** do VS Code → `http://127.0.0.1:5500`). Abrindo o `index.html` por duplo clique (`file://`) o navegador bloqueia o `fetch`.

Material da aula: [`aula-02-fetch-api.md`](aula-02-fetch-api.md)

## Exercícios de fixação

- [x] **Simulação de latência:** `setTimeout` de 1 s antes do `fetch` (constante `ATRASO_SIMULADO_MS`) para ver "Carregando pacientes...".
- [x] **Contador por origem:** "Do arquivo JSON: X | Cadastrados manualmente nesta sessão: Y" (e coluna "Origem" na tabela).
- [x] **Lista vazia:** se o JSON vier `[]`, aparece "Nenhum paciente cadastrado ainda" no lugar da tabela.
- [x] **Erro amigável:** com o arquivo inexistente (troque `URL_DADOS` por `'data/inexistente.json'`) a tela mostra um alerta claro, e não só o `console.error`.

As respostas dos estudos dirigidos estão em [`../issues/`](../issues) (arquivos `03` a `06`).
