# Requirements Document

## Introduction

本功能为川傣餐饮 H5 应用实现完整的用户认证体系，基于 Supabase 平台。支持手机号注册登录，包含短信验证码功能。用户可以通过手机号+密码或手机号+验证码两种方式登录。用户资料包含详细的个人信息字段。

## Glossary

- **Supabase**: 开源的 Firebase 替代方案，提供数据库、认证、存储等后端服务
- **Auth System（认证系统）**: 用户注册、登录、登出的完整流程
- **SMS Verification（短信验证）**: 通过发送短信验证码验证用户手机号的真实性
- **OTP（One-Time Password）**: 一次性密码，即短信验证码
- **User Profile（用户资料）**: 用户的详细个人信息
- **Session（会话）**: 用户登录后的认证状态

## Requirements

### Requirement 1

**User Story:** 作为新用户，我希望能够通过手机号注册账户，以便使用应用的完整功能。

#### Acceptance Criteria

1. WHEN 用户输入手机号并点击获取验证码 THEN Auth System SHALL 向该手机号发送 6 位数字验证码
2. WHEN 用户输入正确的验证码、密码和确认密码 THEN Auth System SHALL 创建新用户账户
3. WHEN 用户输入的两次密码不一致 THEN Auth System SHALL 显示密码不匹配的错误提示
4. WHEN 手机号已被注册 THEN Auth System SHALL 显示手机号已存在的错误提示
5. WHEN 验证码错误或过期 THEN Auth System SHALL 显示验证码无效的错误提示
6. WHEN 注册成功 THEN Auth System SHALL 自动登录用户并跳转到首页

### Requirement 2

**User Story:** 作为已注册用户，我希望能够通过手机号和密码登录，以便快速访问我的账户。

#### Acceptance Criteria

1. WHEN 用户输入正确的手机号和密码 THEN Auth System SHALL 验证凭据并创建用户会话
2. WHEN 用户输入错误的手机号或密码 THEN Auth System SHALL 显示凭据错误的提示信息
3. WHEN 登录成功 THEN Auth System SHALL 跳转到首页并保持登录状态
4. WHEN 用户勾选"记住我"选项 THEN Auth System SHALL 延长会话有效期

### Requirement 3

**User Story:** 作为已注册用户，我希望能够通过手机号和验证码登录，以便在忘记密码时也能访问账户。

#### Acceptance Criteria

1. WHEN 用户选择验证码登录方式 THEN Auth System SHALL 显示手机号和验证码输入界面
2. WHEN 用户输入手机号并点击获取验证码 THEN Auth System SHALL 向该手机号发送登录验证码
3. WHEN 用户输入正确的验证码 THEN Auth System SHALL 验证并创建用户会话
4. WHEN 验证码错误或过期 THEN Auth System SHALL 显示验证码无效的错误提示

### Requirement 4

**User Story:** 作为已登录用户，我希望能够安全登出，以便保护我的账户安全。

#### Acceptance Criteria

1. WHEN 用户点击登出按钮 THEN Auth System SHALL 清除用户会话并跳转到登录页
2. WHEN 会话过期 THEN Auth System SHALL 自动登出用户并提示重新登录

### Requirement 5

**User Story:** 作为用户，我希望系统能够记住我的登录状态，以便下次访问时无需重新登录。

#### Acceptance Criteria

1. WHEN 用户登录成功 THEN Auth System SHALL 将会话信息安全存储
2. WHEN 用户重新访问应用 THEN Auth System SHALL 自动恢复登录状态（如果会话有效）
3. WHEN 用户在多个标签页操作 THEN Auth System SHALL 保持登录状态同步

### Requirement 6

**User Story:** 作为用户，我希望能够管理我的个人资料，以便展示和更新我的信息。

#### Acceptance Criteria

1. WHEN 用户访问个人资料页 THEN Auth System SHALL 显示用户的详细信息
2. WHEN 用户编辑资料 THEN Auth System SHALL 验证并保存更新的信息
3. WHEN 用户上传头像 THEN Auth System SHALL 存储图片并更新用户头像

### Requirement 7

**User Story:** 作为开发者，我希望用户数据模型包含详细的字段，以便支持丰富的用户功能。

#### Acceptance Criteria

1. WHEN 创建用户 THEN Auth System SHALL 存储以下必填字段：手机号、密码哈希、创建时间
2. WHEN 创建用户 THEN Auth System SHALL 支持以下可选字段：昵称、头像、性别、生日、个人简介
3. WHEN 用户登录 THEN Auth System SHALL 记录最后登录时间
4. WHEN 查询用户 THEN Auth System SHALL 支持通过手机号唯一标识用户
