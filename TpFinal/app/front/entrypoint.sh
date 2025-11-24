#!/bin/sh
set -eu

: "${API_BASE_URL:=http://localhost:8000}"

mkdir -p /usr/share/nginx/html
envsubst '${API_BASE_URL}' \
  < /etc/nginx/templates/index.template.html \
  > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'

