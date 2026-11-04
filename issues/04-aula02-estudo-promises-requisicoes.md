# [Aula02] Estudo Dirigido: Assincronismo, Promises e Requisições HTTP

Análise dos conceitos teóricos abordados no uso da API `fetch`, comportamento assíncrono do JavaScript e infraestrutura básica de execução web.

Responda e prepare-se para discutir em sala os seguintes tópicos:

1. **Promises no JavaScript:** Por que a função `fetch` não retorna os dados de forma instantânea, e sim uma "promessa" (Promise)?
2. **Execução Assíncrona vs. Síncrona:** O que significa, na prática, o `fetch` ser assíncrono? O que aconteceria com a interface da página se ele fosse síncrono?
3. **Status da Resposta HTTP:** Por que precisamos verificar `resposta.ok` no código, mesmo quando a execução do `fetch` não lançou uma exceção no bloco `catch`?
4. **Transição de Arquivo Local para API:** Nesta atividade buscamos dados de um arquivo `.json` local. O que muda no código JavaScript quando esse arquivo for substituído por uma API backend real (ex: feita em Node.js)?
5. **Servidor Local vs. Sistema de Arquivos:** Por que a partir desta etapa precisamos de um servidor local (como a extensão Live Server) para rodar a aplicação, enquanto na etapa anterior podíamos abrir o arquivo `.html` diretamente com o duplo clique?

<!-- COMENTARIO -->
## Respostas

### 1. Promises
Uma requisição de rede leva um tempo imprevisível (depende da rede e do servidor). Em vez de parar tudo esperando, o `fetch` devolve **imediatamente** uma *Promise*: um objeto que representa um resultado que ainda vai chegar e que passa de *pending* para *fulfilled* (deu certo) ou *rejected* (falhou). Quando a resposta chega, o código que estava aguardando (`.then` ou `await`) é retomado.

### 2. Assíncrono vs. síncrono
Ser assíncrono significa que o JavaScript **continua trabalhando** (responder a cliques, rolar a página, animações) enquanto a resposta não chega, e só executa o código seguinte ao `await` quando ela chega. Se o `fetch` fosse síncrono, a thread principal ficaria bloqueada até o servidor responder: a página **congelaria** (sem cliques, sem rolagem), o que seria péssimo em redes lentas.

### 3. Verificar `resposta.ok`
O `fetch` só rejeita a Promise (cai no `catch`) em **falhas de rede** (sem internet, DNS, CORS). Uma resposta HTTP `404` ou `500` é, para o `fetch`, uma resposta recebida com sucesso, então a Promise é resolvida normalmente. `resposta.ok` é `true` só para status 200–299. Sem essa checagem, o código tentaria tratar a página/corpo de erro como se fossem os dados (ex.: `dados.forEach is not a function`).

### 4. De arquivo local para API
Quase nada: **muda a URL** (de `data/pacientes.json` para algo como `http://localhost:3000/pacientes`). O padrão `try/await fetch/resposta.ok/await resposta.json()` continua igual. O que passa a existir é: o servidor precisa estar rodando, o servidor precisa liberar CORS, e podemos usar outros métodos (`POST`, `PUT`, `DELETE`) com `headers` e `body`, além de mais cenários de erro e de latência.

### 5. Servidor local vs. sistema de arquivos
Abrindo o HTML por duplo clique, a página usa o protocolo `file://`. Por segurança (política de mesma origem/CORS), o navegador **bloqueia** `fetch` para ler arquivos nesse contexto. Com o Live Server a página é servida por `http://localhost:5500`, como em um servidor real, e o `fetch` funciona. Na etapa anterior não havia nenhuma requisição, então só o HTML/CSS/JS local bastava.
