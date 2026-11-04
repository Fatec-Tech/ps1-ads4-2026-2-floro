#!/usr/bin/env bash
# Cria no GitHub todas as issues desta pasta (e os comentários com as respostas).
#
# Requisitos: GitHub CLI (gh) instalado e autenticado (`gh auth login`)
# Uso (dentro da pasta do repositório clonado):
#   ./issues/criar-issues.sh --dry-run   # só mostra o que seria criado
#   ./issues/criar-issues.sh             # cria as issues de verdade
#
# Formato de cada arquivo NN-*.md:
#   linha 1          → título da issue ("# [AulaXX] ...")
#   até o marcador   → corpo da issue
#   após <!-- COMENTARIO --> → comentário com as respostas (opcional)
#
# Atenção: rodar duas vezes cria issues duplicadas.
set -euo pipefail
cd "$(dirname "$0")"

DRY=0
[[ "${1:-}" == "--dry-run" ]] && DRY=1

for arquivo in [0-9][0-9]-*.md; do
  titulo=$(head -n 1 "$arquivo" | sed 's/^# *//')
  corpo=$(mktemp)
  comentario=$(mktemp)

  awk -v corpo="$corpo" -v coment="$comentario" '
    NR == 1 { next }
    /<!-- COMENTARIO -->/ { destino = coment; next }
    { print > (destino == "" ? corpo : destino) }
  ' "$arquivo"
  touch "$corpo" "$comentario"

  if (( DRY )); then
    echo "[dry-run] \"$titulo\" — corpo: $(wc -l < "$corpo") linhas, comentário: $(wc -l < "$comentario") linhas"
  else
    url=$(gh issue create --title "$titulo" --body-file "$corpo")
    echo "criada: $url"
    if [[ -s "$comentario" ]]; then
      gh issue comment "$url" --body-file "$comentario" > /dev/null
      echo "  └ resposta adicionada como comentário"
    fi
  fi

  rm -f "$corpo" "$comentario"
done
