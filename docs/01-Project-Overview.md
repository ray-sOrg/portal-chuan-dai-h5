# 项目概述

## 基本信息

| 项目 | 值 |
|------|-----|
| 项目名称 | portal-chuan-dai-h5 |
| 类型 | H5 Web 应用 (移动端优先) |
| 框架 | Next.js 16.0.0 |
| 语言 | TypeScript |
| 包管理 | Bun |

## 项目定位

这是一个餐饮服务相关的 H5 项目，主要功能包括：
- 用户注册/登录
- 菜品浏览与收藏
- 照片分享与社交

## 技术栈

### 核心框架
- **Next.js 16** - React 全栈框架 (App Router)
- **React 19.2.0** - UI 库
- **TypeScript 5** - 类型安全

### 样式与 UI
- **Tailwind CSS 4** - 原子化 CSS
- **shadcn/ui** - 组件库 (CVA, clsx, tailwind-merge)
- **Lucide React** - 图标库
- **Sonner** - Toast 通知

### 状态管理
- **Zustand 5** - 全局状态管理
- **Lucia Auth** - 认证框架

### 数据层
- **Prisma ORM** - 数据库操作
- **PostgreSQL** - 数据库
- **Zod 4** - 数据验证

### 国际化
- **next-intl** - 多语言支持 (zh/en)

### 存储与云服务
- **腾讯云 COS** - 图片存储 (cos-nodejs-sdk-v5)

### 开发工具
- **ESLint 9** - 代码规范
- **Docker** - 容器化部署

## 目录结构

```
portal-chuan-dai-h5/
├── src/
│   ├── actions/          # Server Actions
│   ├── app/              # App Router 页面
│   │   └── [locale]/     # 多语言路由
│   │       ├── home/     # 首页
│   │       ├── menu/     # 菜单
│   │       ├── photo/    # 照片
│   │       ├── sign-in/  # 登录
│   │       └── sign-up/  # 注册
│   ├── components/       # 公共组件
│   ├── constants/        # 常量
│   ├── features/         # 业务功能模块
│   │   ├── auth/         # 认证模块
│   │   ├── dish/         # 菜品模块
│   │   └── photo/        # 照片模块
│   ├── hooks/            # 自定义 Hooks
│   ├── i18n/             # 国际化配置
│   ├── lib/              # 工具库
│   ├── stores/           # Zustand 状态
│   ├── types/            # 类型定义
│   └── middleware.ts     # 中间件
├── prisma/
│   └── schema.prisma     # 数据库模型
├── messages/             # 国际化文案
├── public/               # 静态资源
└── deployment.yaml       # K8s 部署配置
```

## 文档索引

1. [01-Project-Overview.md] - 项目概述
2. [02-Database-Schema.md] - 数据库设计
3. [03-Features.md] - 功能模块
4. [04-API-Routes.md] - API 路由
5. [05-Deployment.md] - 部署文档
6. [06-Development.md] - 开发指南
