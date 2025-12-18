# Implementation Plan

- [x] 1. 项目基础设施搭建





  - [x] 1.1 安装 Supabase 相关依赖


    - 安装 @supabase/supabase-js, @supabase/ssr
    - 配置环境变量 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY


    - _Requirements: 1.1_
  - [ ] 1.2 创建 Supabase 客户端配置
    - 创建 src/lib/supabase/client.ts（浏览器端）




    - 创建 src/lib/supabase/server.ts（服务端）

    - _Requirements: 1.1_
  - [ ] 1.3 更新 Prisma Schema 添加 User 模型
    - 添加 User 表：phone, passwordHash, nickname, avatar, gender, birthday, bio, authId 等字段

    - 添加 Gender 枚举
    - 运行 prisma migrate

    - _Requirements: 7.1, 7.2, 7.4_

- [x] 2. 表单基础组件（参考 portal-task-web）

  - [ ] 2.1 创建 ActionState 工具函数
    - 创建 src/components/form/utils/to-action-state.ts



    - _Requirements: 1.3, 1.4, 1.5, 2.2_

  - [x] 2.2 创建 Form 组件

    - 创建 src/components/form/form.tsx
    - 集成 toast 反馈
    - _Requirements: 1.6, 2.3_
  - [x] 2.3 创建 FieldError 组件

    - 创建 src/components/form/field-error.tsx
    - _Requirements: 1.3, 1.4, 1.5_
  - [x] 2.4 创建 SubmitButton 组件

    - 创建 src/components/form/submit-button.tsx
    - 支持 loading 状态
    - _Requirements: 1.2, 2.1_

  - [ ] 2.5 创建 useActionFeedback hook
    - 创建 src/components/form/hooks/use-action-feedback.ts
    - _Requirements: 1.6, 2.3_





- [x] 3. 认证 Server Actions

  - [ ] 3.1 创建发送验证码 Action
    - 创建 src/features/auth/actions/send-otp.ts
    - 集成 Supabase OTP 或第三方短信服务

    - _Requirements: 1.1, 3.2_
  - [x] 3.2 创建注册 Action




    - 创建 src/features/auth/actions/sign-up.ts
    - 验证手机号、密码、验证码

    - 创建 Supabase Auth 用户和 Prisma User
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_
  - [x] 3.3 创建密码登录 Action

    - 创建 src/features/auth/actions/sign-in.ts
    - 验证手机号和密码
    - _Requirements: 2.1, 2.2, 2.3, 2.4_



  - [-] 3.4 创建验证码登录 Action

    - 创建 src/features/auth/actions/sign-in-otp.ts

    - 验证手机号和验证码
    - _Requirements: 3.1, 3.3, 3.4_
  - [x] 3.5 创建登出 Action





    - 创建 src/features/auth/actions/sign-out.ts

    - 清除 Supabase 会话
    - _Requirements: 4.1_


- [ ] 4. 认证查询函数
  - [x] 4.1 创建 getAuth 查询

    - 创建 src/features/auth/queries/get-auth.ts
    - 获取当前用户会话
    - _Requirements: 5.1, 5.2_



  - [-] 4.2 创建 getAuthOrRedirect 查询

    - 创建 src/features/auth/queries/get-auth-or-redirect.ts
    - 未登录时重定向到登录页
    - _Requirements: 4.2_

- [ ] 5. Checkpoint - 确保基础功能正常
  - Ensure all tests pass, ask the user if questions arise.



- [ ] 6. 认证表单组件
  - [ ] 6.1 创建注册表单组件
    - 创建 src/features/auth/components/sign-up-form.tsx
    - 包含手机号、验证码、密码、确认密码输入
    - _Requirements: 1.1, 1.2, 1.3_




  - [ ] 6.2 创建登录表单组件
    - 创建 src/features/auth/components/sign-in-form.tsx
    - 支持密码登录和验证码登录切换
    - _Requirements: 2.1, 3.1, 3.3_
  - [ ] 6.3 创建验证码输入组件
    - 创建 src/features/auth/components/otp-input.tsx
    - 支持倒计时重发
    - _Requirements: 1.1, 3.2_

- [ ] 7. 认证页面
  - [ ] 7.1 创建注册页面
    - 创建 src/app/[locale]/sign-up/page.tsx
    - _Requirements: 1.2, 1.6_
  - [ ] 7.2 创建登录页面
    - 创建 src/app/[locale]/sign-in/page.tsx
    - _Requirements: 2.1, 2.3, 3.1_
  - [ ] 7.3 更新路由配置
    - 更新 src/paths.ts 添加认证相关路径
    - _Requirements: 1.6, 2.3, 4.1_

- [ ] 8. 用户资料功能
  - [ ] 8.1 创建更新资料 Action
    - 创建 src/features/auth/actions/update-profile.ts
    - _Requirements: 6.2_
  - [ ] 8.2 创建获取用户资料查询
    - 创建 src/features/auth/queries/get-user-profile.ts
    - _Requirements: 6.1_
  - [ ] 8.3 创建资料表单组件
    - 创建 src/features/auth/components/profile-form.tsx
    - 支持编辑昵称、头像、性别、生日、简介
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 8.4 更新个人中心页面
    - 更新 src/app/[locale]/profile/page.tsx
    - 集成资料表单和登出功能
    - _Requirements: 6.1, 4.1_

- [ ] 9. 中间件和路由保护
  - [ ] 9.1 更新 middleware.ts
    - 添加认证路由保护逻辑
    - 未登录用户访问受保护页面时重定向
    - _Requirements: 4.2, 5.2_

- [ ] 10. 国际化支持
  - [ ] 10.1 添加认证相关翻译
    - 更新 messages/zh.json 和 messages/en.json
    - 添加登录、注册、资料相关文案
    - _Requirements: 1.3, 2.2_

- [ ] 11. Final Checkpoint - 确保所有功能正常
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 12. 属性测试实现
  - [ ]* 12.1 设置测试环境
    - 安装 vitest, @testing-library/react, fast-check
    - 配置 vitest.config.ts
  - [ ]* 12.2 编写属性测试：注册验证逻辑
    - **Property 1: 注册验证逻辑**
    - **Validates: Requirements 1.3, 1.4, 1.5**
  - [ ]* 12.3 编写属性测试：密码登录验证
    - **Property 3: 密码登录验证**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 12.4 编写属性测试：用户数据模型完整性
    - **Property 5: 用户数据模型完整性**
    - **Validates: Requirements 7.1, 7.2, 7.4**
