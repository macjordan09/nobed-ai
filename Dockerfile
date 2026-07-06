# noBed.ai — production container (alternative to Vercel)
# Works on Railway / Fly.io / Render / any Docker host.
# Requires DATABASE_URL pointing at a PostgreSQL instance (e.g. Neon).

FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set DATABASE_URL (PostgreSQL) and AUTH_SECRET at runtime
EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
