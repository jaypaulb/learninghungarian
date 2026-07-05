#!/bin/sh
set -e
echo "Applying database migrations..."
node scripts/migrate.js
echo "Importing content..."
node scripts/import-content.js
echo "Starting server..."
exec node build
