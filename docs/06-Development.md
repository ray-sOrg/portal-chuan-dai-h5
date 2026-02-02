# 开发指南

## 快速开始

```bash
# 安装依赖
bun install

# 生成 Prisma 客户端
bun prisma generate

# 启动开发服务器
bun dev
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `bun dev` | 启动开发服务器 |
| `bun build` | 生产构建 |
| `bun start` | 启动生产服务器 |
| `bun lint` | 代码检查 |
| `bun prisma studio` | 数据库管理界面 |

## 代码规范

- ESLint 自动检查
- TypeScript 严格模式
- Tailwind CSS 原子化

## 项目约定

### 组件开发
- 使用 Server/Client Component 区分
- 公共组件放 `components/`
- 业务组件放 `features/`

### 状态管理
- 全局状态 → Zustand
- Server State → Server Actions + React Server Components

### 国际化
- 所有 UI 文本通过 i18n
- 新增文案 → `messages/zh.json` & `messages/en.json`

## 调试技巧

### 数据库
```bash
# 查看数据库内容
bun prisma studio
```

### 国际化
访问 `/?locale=en` 测试英文界面。

## 常见问题

Q: 构建失败?
A: 确保 `.env` 配置正确，运行 `bun postinstall`
