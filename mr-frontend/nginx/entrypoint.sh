#!/bin/sh
: "${BACKEND_URL:=http://backend:3000/}"
: "${BACKEND_WS_URL:=http://backend:3001}"

export BACKEND_URL
export BACKEND_WS_URL

echo "BACKEND_URL = $BACKEND_URL"
echo "BACKEND_WS_URL = $BACKEND_WS_URL"

envsubst '${BACKEND_URL} ${BACKEND_WS_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"

