#!/bin/sh
set -e

echo "==> Syncing database schema"
npx prisma db push --skip-generate

HOSPITALS=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.hospital.count().then(n => { console.log(n); return p.\$disconnect(); }).catch(() => { console.log('ERR'); process.exit(0); });
")

if [ "$HOSPITALS" = "0" ]; then
  echo "==> Empty database: seeding demo data"
  node prisma/seed.mjs
else
  echo "==> Database has $HOSPITALS hospitals, skipping seed"
fi

echo "==> Starting noBed.ai on port ${PORT:-3000}"
exec npm start
