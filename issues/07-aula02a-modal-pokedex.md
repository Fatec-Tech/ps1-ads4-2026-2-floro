# [aula02a] Desafio: Implementar Modal de Detalhes Completo da Pokédex

### 🎯 Objetivo

Estender a aplicação base da Pokédex implementando um **Modal de Detalhes Completo** do Bootstrap. Ao clicar na carta de qualquer Pokémon na tela, o usuário deve visualizar informações aprofundadas sobre o Pokémon selecionado diretamente de uma caixa de diálogo responsiva.

### 📋 Requisitos da Tarefa

1. **Interatividade nos Cards**
   - [x] Tornar os cards da lista clicáveis (`cursor: pointer`).
   - [x] Ao clicar no card, disparar a abertura do modal sem recarregar a página.
2. **Estrutura e Dados no Modal** (consumidos da PokéAPI)
   - [x] **Status Base (`stats`):** HP, Ataque, Defesa e Velocidade com **Progress Bar** do Bootstrap.
   - [x] **Habilidades (`abilities`):** listadas em badges.
   - [x] **Áudio (`cries`):** player HTML5 `<audio>` com `cries.latest`.
   - [x] **Galeria de Sprites:** Normal e Shiny (frente e costas).
3. **Feedback Visual e UX**
   - [x] Spinner dentro do modal enquanto os dados são recuperados.
   - [x] Tratamento amigável de erros de requisição.

### 🏆 Critérios de Aceite

- [x] A aplicação abre o modal ao clicar em qualquer card da lista.
- [x] O modal exibe os status base (HP, Ataque, Defesa, Velocidade) em barras de progresso.
- [x] As habilidades estão visíveis e formatadas corretamente.
- [x] O som do Pokémon pode ser ouvido interativamente.
- [x] As visões de sprites (Normal/Shiny) são exibidas.
- [x] Não há erros no console ao abrir ou fechar o modal.

**Onde está:** `aula02a-poke-api/` (`index.html` e `js/app.js`). Extras: cache dos Pokémon já abertos, abertura pelo teclado (Enter/Espaço) e áudio pausado ao fechar o modal.
