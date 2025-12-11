#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Inicia o backend
cd "$ROOT_DIR/backend"
docker-compose up -d 2>/dev/null

# Aguarda backend
sleep 5

# Frontend
cd "$ROOT_DIR/fronted"
[ ! -d "node_modules" ] && npm install --silent

node index.js
