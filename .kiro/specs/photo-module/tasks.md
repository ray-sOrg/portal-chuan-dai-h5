# 照片模块实现计划

- [x] 1. 数据库模型设计





  - [ ] 1.1 更新 Prisma Schema，添加 Photo、Gathering、PhotoFavorite、PhotoComment 表和 EmotionTag 枚举
    - 添加 Gathering 聚会表
    - 添加 Photo 照片表（含多尺寸 URL 字段）
    - 添加 PhotoFavorite 照片收藏表
    - 添加 PhotoComment 照片评论表

    - 添加 EmotionTag 情绪标签枚举
    - 更新 User 表关联





    - _Requirements: 1.1, 2.1, 4.3, 5.1, 6.3_
  - [ ] 1.2 运行数据库迁移
    - 执行 `npx prisma migrate dev --name add_photo_module`
    - _Requirements: 1.1_



- [ ] 2. 照片列表功能
  - [x] 2.1 创建获取照片列表的 Server Action


    - 实现 `getPhotos` action，支持分页和时间倒序
    - 返回照片基本信息和收藏状态

    - _Requirements: 1.2_

  - [ ]* 2.2 编写属性测试：照片列表时间倒序
    - **Property 1: 照片列表时间倒序**
    - **Validates: Requirements 1.2**
  - [ ] 2.3 创建 PhotoCard 组件
    - 显示照片缩略图、标题、描述（省略）
    - 右下角爱心收藏按钮
    - 点击跳转详情页
    - _Requirements: 1.3, 2.1, 4.1_
  - [ ] 2.4 创建 PhotoGrid 瀑布流组件
    - 实现两列瀑布流布局
    - 支持懒加载更多
    - _Requirements: 1.1, 1.4_
  - [ ] 2.5 实现照片瀑布流页面
    - 整合 PhotoGrid 组件
    - 底部固定上传按钮
    - _Requirements: 1.1, 3.1_

- [x] 3. Checkpoint - 确保所有测试通过

  - 确保所有测试通过，如有问题请询问用户。

- [-] 4. 收藏功能


  - [ ] 4.1 创建收藏切换 Server Action
    - 实现 `togglePhotoFavorite` action
    - 登录校验，未登录返回错误
    - _Requirements: 2.2, 2.3_
  - [ ]* 4.2 编写属性测试：收藏状态切换幂等性
    - **Property 2: 收藏状态切换幂等性**
    - **Validates: Requirements 2.2, 4.5**

  - [ ] 4.3 在 PhotoCard 中集成收藏功能
    - 点击爱心切换收藏状态
    - 未登录跳转登录页
    - _Requirements: 2.2, 2.3_

- [x] 5. 照片详情页


  - [x] 5.1 创建获取照片详情 Server Action


    - 实现 `getPhotoDetail` action
    - 返回完整照片信息、聚会信息、收藏状态
    - _Requirements: 4.2, 4.3, 4.4_
  - [x] 5.2 创建照片详情页面


    - 大图展示
    - 完整标题和描述
    - 聚会信息（如有）
    - 上传时间
    - 收藏按钮
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 6. 评论功能

  - [ ] 6.1 创建获取评论列表 Server Action
    - 实现 `getPhotoComments` action
    - 按时间正序返回评论
    - _Requirements: 5.1_

  - [ ] 6.2 创建添加评论 Server Action
    - 实现 `addPhotoComment` action
    - 登录校验
    - 内容验证（非空）
    - _Requirements: 5.2, 5.3_
  - [ ]* 6.3 编写属性测试：评论添加增长性
    - **Property 3: 评论添加增长性**

    - **Validates: Requirements 5.2**
  - [ ] 6.4 创建 CommentList 组件
    - 显示评论列表
    - 显示评论者头像、昵称、内容、时间
    - _Requirements: 5.1_
  - [x] 6.5 创建 CommentForm 组件

    - 评论输入框
    - 提交按钮
    - 未登录提示
    - _Requirements: 5.2, 5.3_

  - [ ] 6.6 在详情页集成评论功能
    - 整合 CommentList 和 CommentForm
    - _Requirements: 5.1, 5.2_

- [ ] 7. Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [-] 8. 照片上传功能

  - [ ] 8.1 创建图片处理工具函数
    - 实现图片压缩
    - 生成多尺寸版本（缩略图、中等、原图）
    - _Requirements: 6.5_
  - [ ]* 8.2 编写属性测试：图片压缩有效性
    - **Property 4: 图片压缩有效性**
    - **Validates: Requirements 6.5**

  - [x] 8.3 创建照片上传 Server Action

    - 实现 `uploadPhoto` action
    - 登录校验
    - 处理图片上传到存储服务
    - _Requirements: 6.1, 6.5_

  - [x] 8.4 创建 UploadForm 组件

    - 图片选择器（支持多选）
    - 图片预览
    - 表单字段：标题、描述、聚会选择、情绪标签
    - 上传进度显示
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 8.5 创建照片上传页面
    - 整合 UploadForm
    - 上传成功后跳转详情页
    - _Requirements: 6.6_


  - [ ] 8.6 在瀑布流页面集成上传入口
    - 底部上传按钮点击逻辑
    - 登录校验，未登录跳转登录页
    - _Requirements: 3.2, 3.3_

- [ ] 9. 国际化支持
  - [ ] 9.1 添加照片模块的 i18n 翻译
    - 中文翻译
    - 英文翻译
    - _Requirements: 全部_

- [ ] 10. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。
