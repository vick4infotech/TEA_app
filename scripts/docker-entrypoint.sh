#!/bin/sh
set -eu

mkdir -p /app/data

if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="file:/app/data/tea-app.db"
fi

if [ -z "${JWT_SECRET:-}" ]; then
  export JWT_SECRET="change-this-long-random-secret-before-deployment"
  echo "JWT_SECRET was not set. Set a strong JWT_SECRET in Dockploy environment variables."
fi

if [ -z "${DEFAULT_SUPER_ADMIN_EMAIL:-}" ]; then
  export DEFAULT_SUPER_ADMIN_EMAIL="admin@theedifyingassembly.org"
fi

if [ -z "${DEFAULT_SUPER_ADMIN_PASSWORD:-}" ]; then
  export DEFAULT_SUPER_ADMIN_PASSWORD="ChangeMe@12345"
fi

if [ -z "${SESSION_COOKIE_SECURE:-}" ]; then
  export SESSION_COOKIE_SECURE="auto"
fi

npm run start
