#!/usr/bin/env bash
# Atividade 07a — Homologação da API REST via curl (5 rotas do CRUD)
#
# Uso (Git Bash, Linux ou Mac):
#   ./testes-curl.sh https://api-clinica-SEU_NOME.onrender.com/pacientes
#
# Sem argumento, testa a API local (http://localhost:3000/pacientes).
# Mostra tudo no terminal (para tirar os prints) e grava o mesmo conteúdo em
# resultado-curl.md, já em Markdown, para colar como comentário na issue.
#
# Obs.: no plano gratuito do Render a primeira requisição pode levar ~1 minuto
# (o servidor "acorda"). O script espera até 2 minutos por resposta.

API="${1:-http://localhost:3000/pacientes}"
API="${API%/}"
SAIDA="resultado-curl.md"
CT='Content-Type: application/json'

: > "$SAIDA"
{
  echo "## Homologação da API via cURL"
  echo
  echo "API testada: \`$API\`"
  echo
} >> "$SAIDA"

# executar "<título>" "<comando exibido>" <argumentos do curl...>
executar() {
  local titulo="$1" exibido="$2"
  shift 2
  echo
  echo "=== $titulo ==="
  echo "\$ $exibido"
  RESP=$(curl -s -i --max-time 120 "$@" | tr -d '\r')
  echo "$RESP"
  {
    echo "### $titulo"
    echo '```bash'
    echo "\$ $exibido"
    echo "$RESP"
    echo '```'
    echo
  } >> "$SAIDA"
}

# 1. GET (Listar todos)
executar "1. GET (Listar todos os pacientes)" \
  "curl -i -X GET $API" \
  -X GET "$API"

# 2. POST (Cadastrar)
CORPO='{"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}'
executar "2. POST (Cadastrar novo paciente)" \
  "curl -i -X POST $API -H \"$CT\" -d '$CORPO'" \
  -X POST "$API" -H "$CT" -d "$CORPO"

# Captura o id retornado no corpo da resposta do POST
ID=$(echo "$RESP" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -z "$ID" ]; then
  echo
  echo "!! Não foi possível obter o id do POST (esperado: 201 Created)."
  echo "   Se o status foi 409, o e-mail de teste já existe: apague o paciente antigo"
  echo "   (curl -X DELETE $API/<id>) e rode de novo."
  exit 1
fi
echo ">> id gerado: $ID"

# 3. GET por ID
executar "3. GET por ID (Buscar o paciente criado)" \
  "curl -i -X GET $API/$ID" \
  -X GET "$API/$ID"

# 4. PUT
CORPO_PUT='{"nome":"Paciente Atualizado CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}'
executar "4. PUT (Atualizar o paciente)" \
  "curl -i -X PUT $API/$ID -H \"$CT\" -d '$CORPO_PUT'" \
  -X PUT "$API/$ID" -H "$CT" -d "$CORPO_PUT"

# 5. DELETE
executar "5. DELETE (Remover o paciente)" \
  "curl -i -X DELETE $API/$ID" \
  -X DELETE "$API/$ID"

echo
echo "Pronto! Conteúdo para o comentário da issue salvo em: $SAIDA"
