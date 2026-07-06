#!/bin/sh
set -e

# Resolve the SQLite file path from DATABASE_URL (file:/data/nobed.db)
DB_PATH=$(echo "${DATABASE_URL:-file:/data/nobed.db}" | sed 's|^file:||')

echo "==> Syncing database schema ($DB_PATH)"
npx prisma db push --skip-generate

if [ ! -s "$DB_PATH.seeded" ]; then
  echo "==> First run: seeding demo data"
  node prisma/seed.mjs
  touch "$DB_PATH.seeded"
else
  echo "==> Database already seeded, skipping"
fi

echo "==> Starting noBed.ai on port ${PORT:-3000}"
exec npm start
