## Homologação da API via cURL

API testada: `https://api-clinica-floro.onrender.com/pacientes`

### 1. GET (Listar todos os pacientes)
```bash
$ curl -i -X GET https://api-clinica-floro.onrender.com/pacientes
HTTP/1.1 200 OK
Date: Thu, 05 Nov 2026 00:52:07 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
access-control-allow-origin: *
cf-cache-status: DYNAMIC
etag: W/"108-41HbFl7jgjQyEf2egR2HxwWRgIA"
rndr-id: 79c98b63-b7f2-413b
Server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
CF-RAY: a557dfb7a87f934d-GRU
alt-svc: h3=":443"; ma=86400

[{"id":1,"nome":"Maria Silva","email":"maria.silva@email.com","nascimento":"1990-04-12"},{"id":2,"nome":"João Pereira","email":"joao.pereira@email.com","nascimento":"1985-11-30"},{"id":3,"nome":"Ana Costa","email":"ana.costa@email.com","nascimento":"2001-07-08"}]
```

### 2. POST (Cadastrar novo paciente)
```bash
$ curl -i -X POST https://api-clinica-floro.onrender.com/pacientes -H "Content-Type: application/json" -d '{"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}'
HTTP/1.1 201 Created
Date: Thu, 05 Nov 2026 00:52:07 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
access-control-allow-origin: *
cf-cache-status: DYNAMIC
etag: W/"5c-1J559ukysbkElMgJJS3eIFeB30A"
rndr-id: 1efe2a88-347c-4193
Server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
CF-RAY: a557dfba3cd3da71-GRU
alt-svc: h3=":443"; ma=86400

{"id":4,"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}
```

### 3. GET por ID (Buscar o paciente criado)
```bash
$ curl -i -X GET https://api-clinica-floro.onrender.com/pacientes/4
HTTP/1.1 200 OK
Date: Thu, 05 Nov 2026 00:52:08 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
access-control-allow-origin: *
cf-cache-status: DYNAMIC
etag: W/"5c-1J559ukysbkElMgJJS3eIFeB30A"
rndr-id: f3017243-5294-4a2c
Server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
CF-RAY: a557dfbcae75e142-GRU
alt-svc: h3=":443"; ma=86400

{"id":4,"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}
```

### 4. PUT (Atualizar o paciente)
```bash
$ curl -i -X PUT https://api-clinica-floro.onrender.com/pacientes/4 -H "Content-Type: application/json" -d '{"nome":"Paciente Atualizado CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}'
HTTP/1.1 200 OK
Date: Thu, 05 Nov 2026 00:52:08 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
access-control-allow-origin: *
cf-cache-status: DYNAMIC
etag: W/"61-D1ueRqmT8h8xdVwHVPPi6c3FCao"
rndr-id: a1f78620-7ca2-4cc0
Server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
CF-RAY: a557dfbf08ccb27c-GRU
alt-svc: h3=":443"; ma=86400

{"id":4,"nome":"Paciente Atualizado CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}
```

### 5. DELETE (Remover o paciente)
```bash
$ curl -i -X DELETE https://api-clinica-floro.onrender.com/pacientes/4
HTTP/1.1 204 No Content
Date: Thu, 05 Nov 2026 00:52:09 GMT
Connection: keep-alive
access-control-allow-origin: *
rndr-id: c2863791-a008-4004
Server: cloudflare
x-powered-by: Express
x-render-origin-server: Render
cf-cache-status: DYNAMIC
CF-RAY: a557dfc10f85010e-GRU
alt-svc: h3=":443"; ma=86400
```

