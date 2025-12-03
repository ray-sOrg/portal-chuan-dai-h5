# =================== Step 1: Install dependencies ===================
FROM docker.1ms.run/oven/bun:1 AS deps
WORKDIR /app

# 只拷贝 package.json 和 bun.lock
COPY package.json bun.lock ./
COPY prisma ./prisma

# 安装依赖
RUN bun install --frozen-lockfile

# =================== Step 2: Build project ==========================
FROM docker.1ms.run/oven/bun:1 AS builder
WORKDIR /app

ARG DATABASE_URL
ARG DIRECT_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NODE_ENV=production

# 拷贝 deps 阶段的依赖
COPY --from=deps /app/node_modules ./node_modules

# 拷贝项目源码，包括 prisma
COPY . .

# 执行 Next.js 构建，postinstall 会生成 Prisma Client
RUN bun run build

# =================== Step 3: Production runtime ====================
FROM docker.1ms.run/oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# 拷贝 standalone 构建产物（包含所有必要的依赖）
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 拷贝 Prisma Client 运行时必要文件
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# 使用 Bun 启动 standalone server
CMD ["bun", "run", "server.js"]
