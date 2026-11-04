# [Aula03] Simulação de falha: servidor parado

Interrompa o servidor no terminal (`Ctrl + C`). Atualize o navegador e observe a mensagem de erro amigável tratada pelo `catch` no frontend.

**Critérios de aceite**

- [x] Com o servidor parado, a página **não quebra** e não fica em "Carregando pacientes...".
- [x] O usuário vê a mensagem "Erro ao carregar pacientes. O servidor está rodando?".
- [x] O erro técnico aparece apenas no `console.error`.

**Por que funciona:** com o servidor parado o `fetch` falha na rede e a Promise é rejeitada, o que cai no bloco `catch` de `carregarPacientesIniciais()`.
