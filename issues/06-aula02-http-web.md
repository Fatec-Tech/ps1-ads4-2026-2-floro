# [Aula02] Estudo Dirigido: Fundamentos da Programação para Web e Protocolo HTTP

Após a leitura do material de apoio, responda às questões abaixo sobre os conceitos fundamentais da Web, arquitetura cliente-servidor e o funcionamento do protocolo HTTP.

Material: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview

**Instruções para Entrega:** escreva as respostas diretamente nos comentários desta Issue, usando Markdown.

**Lista de Exercícios**

1. **Conceito de Cliente-Servidor:** Como funciona o modelo cliente-servidor no HTTP? Quem inicia a comunicação e qual o papel de cada parte?
2. **Subdocumentos e Construção da Página:** Como um documento completo é reconstruído a partir do HTML original e de seus subrecursos?
3. **O Agente-Usuário (User Agent):** O que é um agente-usuário? Cite outro exemplo além dos navegadores.
4. **Papel e Tipos de Proxies:** O que é um proxy e quais três funções importantes ele pode desempenhar?
5. **Simplicidade e Extensibilidade:** Por que o HTTP é "simples" e "extensível"? Como os cabeçalhos contribuem?
6. **Comportamento Stateless:** Qual problema isso traz para aplicações Web e qual mecanismo contorna essa limitação?
7. **HTTP e Camada de Transporte (TCP):** Como a evolução do HTTP/1.0 para 1.1 e 2.0 otimizou o uso das conexões TCP?
8. **Controle de Cache:** Como o servidor pode gerenciar o cache nos clientes e proxies? Qual a principal vantagem do cache?
9. **Segurança e Origem (CORS):** Como o HTTP permite "relaxar" a Same-Origin Policy de forma segura?
10. **Sintaxe e Leitura de Mensagens:** Por que mensagens legíveis por humanos são vantajosas na fase de desenvolvimento e aprendizado?

<!-- COMENTARIO -->
## Respostas

### 1. Cliente-servidor
O **cliente** (normalmente o navegador, agindo pelo usuário) é sempre quem **inicia** a comunicação, enviando uma *requisição*. O **servidor** fica aguardando, processa o pedido e devolve uma *resposta* (HTML, JSON, imagem etc.). Cliente pede; servidor atende.

### 2. Subdocumentos
O navegador primeiro recebe o **HTML**. Ao interpretá-lo, descobre os subrecursos (`<link>` de CSS, `<script>`, `<img>`, fontes, `<iframe>`...) e faz **novas requisições** para cada um. Depois junta tudo: aplica o CSS, executa o JavaScript e **renderiza** a página completa.

### 3. Agente-usuário (user agent)
É qualquer ferramenta que age **em nome do usuário** fazendo requisições HTTP. O principal é o navegador, mas também são user agents: robôs de busca (*crawlers*, como o Googlebot), o `curl`, clientes de API como Postman/Thunder Client e aplicativos mobile.

### 4. Proxies
Um proxy é um **intermediário** entre cliente e servidor que repassa requisições e respostas. Funções: **cache** (guarda respostas e diminui o tráfego), **filtragem/bloqueio** de conteúdo, **balanceamento de carga**, **autenticação/controle de acesso**, **registro (logs)** e **anonimização** do cliente.

### 5. Simples e extensível
É **simples** porque as mensagens são textuais, legíveis e seguem uma estrutura pequena (linha inicial, cabeçalhos, corpo). É **extensível** porque novas funcionalidades podem ser criadas só **definindo novos cabeçalhos**, sem mudar o protocolo: cliente e servidor combinam o significado (`Authorization`, `Cache-Control`, `Content-Type`, cabeçalhos CORS...).

### 6. Stateless
Como duas requisições não têm relação entre si, o servidor "esquece" quem é o cliente: em um e-commerce, o carrinho ou o login se perderiam a cada página. O mecanismo para contornar é o **cookie HTTP**: o servidor envia um identificador de sessão (`Set-Cookie`) e o navegador o reenvia em todas as requisições seguintes. Tokens (como JWT) também são usados.

### 7. HTTP e TCP
- **HTTP/1.0:** abria uma conexão TCP nova para cada requisição (lento e custoso).
- **HTTP/1.1:** conexões **persistentes** (*keep-alive*), reaproveitadas para várias requisições, e *pipelining*.
- **HTTP/2:** **multiplexação** de várias requisições/respostas simultâneas na mesma conexão, formato binário e **compressão de cabeçalhos**.

### 8. Cache
O servidor controla o cache com cabeçalhos como `Cache-Control` (`max-age`, `no-store`...), `Expires` e validadores `ETag`/`Last-Modified` (o cliente pergunta "mudou?" e o servidor responde `304 Not Modified` se não mudou). A vantagem é **menos tráfego, resposta mais rápida e menos carga no servidor**.

### 9. CORS
Por padrão o navegador só deixa uma página acessar dados da **mesma origem**. O servidor pode **autorizar explicitamente** outras origens com cabeçalhos como `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` e `Access-Control-Allow-Headers`; em alguns casos o navegador faz antes uma requisição *preflight* (`OPTIONS`). É seguro porque quem decide quais origens são permitidas é o próprio servidor (no Express, o middleware `cors()`).

### 10. Mensagens legíveis
Podemos **ler e depurar** requisições e respostas direto no DevTools, no `curl` ou no Thunder Client, sem ferramentas especiais, e ver exatamente o que foi enviado e recebido. Isso ajuda a **aprender** o protocolo e a achar erros mais rápido.
