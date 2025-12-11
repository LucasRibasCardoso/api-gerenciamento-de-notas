#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

pkill -f "node.*fronted/index.js" 2>/dev/null
cd "$ROOT_DIR/backend" && docker-compose down 2>/dev/null

echo "Aplicação parada"
