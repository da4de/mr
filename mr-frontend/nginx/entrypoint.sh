#!/bin/sh
: "${BACKEND_URL:=http://backend:3000/}"
: "${BACKEND_HOST:=backend}"
: "${BACKEND_WS_URL:=http://backend:3001}"
: "${BACKEND_WS_HOST:=backend}"

export BACKEND_URL
export BACKEND_WS_URL
export BACKEND_HOST
export BACKEND_WS_HOST

echo "BACKEND_URL = $BACKEND_URL"
echo "BACKEND_WS_URL = $BACKEND_WS_URL"
echo "BACKEND_HOST = $BACKEND_HOST"
echo "BACKEND_WS_HOST = $BACKEND_WS_HOST"

envsubst '${BACKEND_URL} ${BACKEND_WS_URL} ${BACKEND_HOST} ${BACKEND_WS_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"

