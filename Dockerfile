# =================== Step 1: Install dependencies ===================
FROM docker.1ms.run/oven/bun:1 AS deps
WORKDIR /app

# 拷贝 package.json 和 bun.lock / bun.lockb
COPY package.json bun.lock bun.lockb ./

# 安装依赖，postinstall 会自动执行 prisma generate
RUN bun install --registry=https://registry.npmmirror.com --frozen-lockfile

# =================== Step 2: Build project ==========================
FROM docker.1ms.run/oven/bun:1 AS builder
WORKDIR /app

ARG DATABASE_URL
ARG DIRECT_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NODE_ENV=production

# 拷贝依赖
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lockb ./bun.lockb

# 拷贝项目代码
COPY . .

# 执行 Next.js 构建
RUN bun run build && rm -rf .next/cache

# =================== Step 3: Production runtime ====================
FROM docker.1ms.run/oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# 拷贝 Next.js 构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# 只拷贝 Prisma Client 运行时需要的文件
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# 使用 Bun 启动 Next.js
CMD ["bun", "run", "start"]
