# [Aula02] Estudo Dirigido: Fundamentos de APIs REST e Integração de Sistemas

Após a leitura do material complementar, responda às questões abaixo para consolidar os conceitos teóricos sobre APIs REST, métodos HTTP, arquitetura e troca de dados.

Material: https://www.ibm.com/br-pt/think/topics/rest-apis#1108921664

**Instruções para Entrega:** escreva as respostas diretamente nos comentários desta Issue, usando Markdown.

**Lista de Exercícios**

1. **Conceito de API REST:** Explique com suas palavras o conceito de API REST e qual é o seu principal objetivo na comunicação entre aplicações na Web.
2. **A Sigla REST:** O que significa a sigla REST (Representational State Transfer) e o que caracteriza um serviço Web como "RESTful"?
3. **Verbos/Métodos HTTP e o Padrão CRUD:** Relacione as operações CRUD com os quatro principais métodos HTTP (GET, POST, PUT, DELETE).
4. **Arquitetura Desconectada e Sem Estado (Stateless):** Explique o que isso significa na prática para o servidor ao receber e processar uma requisição.
5. **Formatos de Dados (JSON vs. XML):** Por que o JSON é mais utilizado e vantajoso do que o XML na comunicação via APIs?
6. **Códigos de Status HTTP:** Qual é a diferença conceitual entre as famílias 2xx, 4xx e 5xx?
7. **Design de Endpoints:** Como as URIs/Endpoints devem ser organizados e nomeados? Dê um exemplo prático de um bom endpoint para listar os produtos de um e-commerce.

<!-- COMENTARIO -->
## Respostas

### 1. Conceito de API REST
Uma API REST é uma interface que permite que aplicações conversem pela Web seguindo um conjunto de regras: os dados são tratados como **recursos**, identificados por **URLs**, e manipulados com os **métodos HTTP**, trocando representações desses recursos (normalmente em JSON). O objetivo é padronizar e **desacoplar** cliente e servidor, para que sistemas diferentes (site, app de celular, outro serviço) consumam a mesma API.

### 2. A sigla REST
**REST = Representational State Transfer.** Um serviço é *RESTful* quando respeita as restrições da arquitetura: **cliente-servidor** separados, **stateless** (sem estado entre requisições), **cacheável**, **interface uniforme** (recursos identificados por URI, manipulados por representações, mensagens autodescritivas) e **sistema em camadas**.

### 3. HTTP e CRUD
| CRUD | Método HTTP |
|---|---|
| Create (criar) | `POST` |
| Read (ler) | `GET` |
| Update (atualizar) | `PUT` (substituição completa; `PATCH` para parcial) |
| Delete (excluir) | `DELETE` |

### 4. Stateless
O servidor **não guarda o contexto do cliente** entre uma requisição e outra. Cada requisição precisa levar tudo o que o servidor precisa para entendê-la (parâmetros, credenciais/token etc.) e é processada de forma independente das anteriores. Isso facilita escalar (qualquer instância do servidor atende qualquer requisição) e usar cache.

### 5. JSON vs. XML
O JSON é mais **leve e menos verboso** (não repete tags de abertura/fechamento), mais fácil de ler, mapeia direto para objetos e arrays e é **nativo no JavaScript** (`JSON.parse`/`JSON.stringify`). Isso reduz o tamanho das mensagens e simplifica o parsing. O XML é mais pesado e complexo, embora ainda seja usado em alguns cenários (como SOAP).

### 6. Códigos de status
- **2xx — sucesso:** a requisição foi recebida e processada (`200 OK`, `201 Created`).
- **4xx — erro do cliente:** a requisição está errada ou não pode ser atendida (`400 Bad Request`, `404 Not Found`).
- **5xx — erro do servidor:** a requisição era válida, mas o servidor falhou ao processá-la (`500 Internal Server Error`).

### 7. Design de endpoints
Os endpoints devem representar **recursos** com **substantivos, no plural**, em minúsculas, de forma hierárquica e **sem verbos** (o verbo é o método HTTP). Filtros e paginação vão na *query string*.

- Bom: `GET /produtos` (lista os produtos), `GET /produtos/42`, `GET /categorias/3/produtos`, `GET /produtos?categoria=livros&pagina=2`
- Ruim: `GET /getProdutos`, `POST /criarProduto`
