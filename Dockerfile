# =================== Step 1: Install dependencies ===================
FROM oven/bun:1.3.10-alpine AS deps
WORKDIR /app

# 拷贝 package.json 和 bun.lock
COPY package.json bun.lock bunfig.toml ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# 使用 bunfig.toml 中配置的镜像源安装依赖
RUN --mount=type=cache,id=chuan-dai-bun,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

# =================== Step 2: Build project ==========================
FROM deps AS builder

ARG DATABASE_URL
ARG DIRECT_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NODE_ENV=production

# builder 继承 deps，避免再次复制完整 node_modules。
# 拷贝项目源码，包括 prisma
COPY . .

# 执行 Next.js 构建，postinstall 会生成 Prisma Client
RUN --mount=type=cache,id=chuan-dai-next,target=/app/.next/cache \
    bun run build

# =================== Step 3: Production runtime ====================
FROM oven/bun:1.3.10-alpine AS runner
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
CMD ["bun", "server.js"]
