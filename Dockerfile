# ----------- Step 1: Install dependencies ------------
FROM docker.1ms.run/oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./ 

# 使用国内源加速
RUN bun install --registry=https://registry.npmmirror.com --frozen-lockfile



# ----------- Step 2: Build project -------------------
FROM docker.1ms.run/oven/bun:1 AS builder
WORKDIR /app

ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Bun 执行 Next.js build
RUN bun run build && rm -rf .next/cache



# ----------- Step 3: Production runtime --------------
FROM docker.1ms.run/oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# 使用 Bun 启动 Next.js
CMD ["bun", "run", "start"]
