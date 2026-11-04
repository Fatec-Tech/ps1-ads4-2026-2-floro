# [Aula01] Estudo Dirigido: Perguntas para Discussão em Sala

Análise do código desenvolvido na aula e reflexão sobre conceitos de arquitetura web, persistência de dados e a necessidade de um backend.

Responda e prepare-se para discutir em sala os seguintes tópicos:

1. **Recarregamento da Página:** O que aconteceria com os dados cadastrados se recarregássemos a página agora (sem usar `localStorage`)? Por que isso acontece?
2. **Organização de Código:** Por que separamos o JavaScript em um arquivo `.js` externo ao invés de colocá-lo direto na tag `<script>` dentro do HTML?
3. **Memória vs. Banco de Dados:** Qual a diferença entre os dados ficarem "na memória do navegador" (variáveis/arrays) e ficarem "em um banco de dados"?
4. **Compartilhamento Local:** Se dois computadores diferentes abrirem essa mesma página HTML localmente, eles vão compartilhar a mesma lista de pacientes? Por quê?
5. **Introdução ao Backend:** O que precisaríamos mudar nesse código se quiséssemos que os dados fossem compartilhados entre vários usuários ao mesmo tempo em tempo real?

<!-- COMENTARIO -->
## Respostas

### 1. Recarregamento da Página
Os dados somem. O array `pacientes` existe apenas na memória da aba do navegador: ao recarregar, a página e o `app.js` são executados do zero e o array volta a ser `[]`. Nada foi gravado em lugar nenhum (com `localStorage`, como na versão estendida do projeto, os dados sobrevivem).

### 2. Organização de Código
- **Separação de responsabilidades:** HTML (estrutura), CSS (apresentação) e JS (comportamento) ficam em arquivos próprios.
- **Manutenção e leitura:** é mais fácil achar e alterar o código; editores, linters e depuradores trabalham melhor com arquivos `.js`.
- **Reuso:** o mesmo arquivo pode ser incluído em várias páginas.
- **Cache:** o navegador guarda o `.js` externo em cache, então ele não é baixado de novo a cada página.

### 3. Memória vs. Banco de Dados
Dados em memória (variáveis/arrays) são **voláteis** e pertencem a uma única aba/processo: somem ao recarregar ou fechar. Um banco de dados guarda os dados **em disco**, de forma **persistente**, e pode ser acessado por vários usuários e aplicações ao mesmo tempo, com consultas, controle de acesso, backups e controle de concorrência.

### 4. Compartilhamento Local
**Não.** Cada navegador baixa e executa sua própria cópia do JavaScript, com seu próprio array na sua própria memória. Não há nenhum canal de comunicação entre as duas máquinas. (Mesmo com `localStorage`, os dados ficam no navegador de cada pessoa.)

### 5. Introdução ao Backend
Seria preciso criar um **servidor** (por exemplo, Node.js/Express) com uma **API** que guarde os dados (em um banco). O frontend deixaria de usar o array local e passaria a usar `fetch` para enviar (`POST`) e buscar (`GET`) os pacientes nessa API; assim todos os usuários leem e gravam na mesma fonte de dados. Para atualização em tempo real, o front ainda precisaria buscar os dados de novo periodicamente (polling) ou receber atualizações do servidor (WebSockets).
