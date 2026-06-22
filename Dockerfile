FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json .npmrc ./
RUN npm install --registry=https://registry.npmjs.org/ --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node scripts/prepare-env.js && npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/data/tea-app.db
ENV SESSION_COOKIE_SECURE=auto
RUN apk add --no-cache openssl
RUN mkdir -p /app/data
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
EXPOSE 3000
CMD ["sh", "scripts/docker-entrypoint.sh"]
