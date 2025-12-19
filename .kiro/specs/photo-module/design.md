# 照片模块设计文档

## 概述

照片模块是一个完整的照片管理系统，包含照片展示（瀑布流）、详情查看、收藏、评论和上传功能。采用 Next.js App Router + Prisma + Server Actions 架构。

## 架构

```
src/
├── app/[locale]/photo/
│   ├── page.tsx              # 照片瀑布流页面
│   ├── [id]/page.tsx         # 照片详情页
│   └── upload/page.tsx       # 照片上传页
├── features/photo/
│   ├── actions/              # Server Actions
│   │   ├── get-photos.ts     # 获取照片列表
│   │   ├── get-photo-detail.ts
│   │   ├── toggle-favorite.ts
│   │   ├── upload-photo.ts
│   │   ├── add-comment.ts
│   │   └── get-comments.ts
│   ├── components/           # 组件
│   │   ├── photo-card.tsx    # 照片卡片
│   │   ├── photo-grid.tsx    # 瀑布流网格
│   │   ├── photo-detail.tsx  # 详情展示
│   │   ├── comment-list.tsx  # 评论列表
│   │   ├── comment-form.tsx  # 评论表单
│   │   └── upload-form.tsx   # 上传表单
│   └── types/
│       └── index.ts          # 类型定义
└── lib/
    └── image-utils.ts        # 图片处理工具
```

## 组件和接口

### 页面组件

1. **PhotoPage** - 照片瀑布流页面
   - 展示照片网格
   - 底部固定上传按钮
   - 支持懒加载

2. **PhotoDetailPage** - 照片详情页
   - 大图展示
   - 完整信息
   - 评论区

3. **PhotoUploadPage** - 照片上传页
   - 图片选择器
   - 表单填写
   - 上传进度

### 功能组件

1. **PhotoCard** - 照片卡片
   ```typescript
   interface PhotoCardProps {
     photo: Photo;
     isFavorited?: boolean;
     onFavoriteClick?: () => void;
   }
   ```

2. **PhotoGrid** - 瀑布流网格
   ```typescript
   interface PhotoGridProps {
     photos: Photo[];
     onLoadMore?: () => void;
     hasMore?: boolean;
   }
   ```

3. **CommentList** - 评论列表
   ```typescript
   interface CommentListProps {
     comments: Comment[];
   }
   ```

4. **CommentForm** - 评论表单
   ```typescript
   interface CommentFormProps {
     photoId: string;
     onSubmit?: (comment: Comment) => void;
   }
   ```

## 数据模型

### Prisma Schema 新增

```prisma
// ============================================================================
// 照片模块 (Photo Module)
// ============================================================================

// 情绪标签枚举
enum EmotionTag {
  HAPPY       // 开心
  EXCITED     // 兴奋
  WARM        // 温馨
  NOSTALGIC   // 怀旧
  FUNNY       // 搞笑
}

// 聚会表
model Gathering {
  id          String   @id @default(uuid()) @db.Uuid
  title       String                           // 聚会标题
  description String?  @db.VarChar(500)        // 描述
  date        DateTime                         // 聚会日期
  location    String?                          // 地点
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关联
  photos      Photo[]
}

// 照片表
model Photo {
  id          String       @id @default(uuid()) @db.Uuid
  title       String                           // 标题
  description String?      @db.VarChar(500)    // 描述
  url         String                           // 原图 URL
  thumbnailUrl String?                         // 缩略图 URL
  mediumUrl   String?                          // 中等尺寸 URL
  width       Int?                             // 原图宽度
  height      Int?                             // 原图高度
  emotionTag  EmotionTag?                      // 情绪标签（可选）
  gatheringId String?      @db.Uuid            // 所属聚会（可选）
  uploaderId  String       @db.Uuid            // 上传者
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // 关联
  gathering   Gathering?   @relation(fields: [gatheringId], references: [id])
  uploader    User         @relation(fields: [uploaderId], references: [id])
  favorites   PhotoFavorite[]
  comments    PhotoComment[]

  @@index([uploaderId])
  @@index([gatheringId])
  @@index([createdAt])
}

// 照片收藏表
model PhotoFavorite {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  photoId   String   @db.Uuid
  createdAt DateTime @default(now())

  // 关联
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  photo     Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)

  @@unique([userId, photoId])
  @@index([userId])
  @@index([photoId])
}

// 照片评论表
model PhotoComment {
  id        String   @id @default(uuid()) @db.Uuid
  content   String   @db.VarChar(500)          // 评论内容
  photoId   String   @db.Uuid
  authorId  String   @db.Uuid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关联
  photo     Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([photoId])
  @@index([authorId])
}
```

### User 表新增关联

```prisma
model User {
  // ... 现有字段
  
  // 新增关联
  photos         Photo[]
  photoFavorites PhotoFavorite[]
  photoComments  PhotoComment[]
}
```

## 正确性属性

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 照片列表时间倒序
*For any* 照片列表查询结果，列表中的每一项的 createdAt 应该大于等于下一项的 createdAt
**Validates: Requirements 1.2**

### Property 2: 收藏状态切换幂等性
*For any* 用户和照片，执行两次收藏操作后，收藏状态应该与初始状态相同（收藏→取消→收藏 = 收藏）
**Validates: Requirements 2.2, 4.5**

### Property 3: 评论添加增长性
*For any* 照片，添加一条有效评论后，该照片的评论数量应该增加 1
**Validates: Requirements 5.2**

### Property 4: 图片压缩有效性
*For any* 上传的图片，压缩后的文件大小应该小于或等于原图大小
**Validates: Requirements 6.5**

## 错误处理

1. **未登录错误** - 收藏、评论、上传操作需要登录，未登录时返回 `UNAUTHORIZED` 错误
2. **照片不存在** - 访问不存在的照片详情时返回 `NOT_FOUND` 错误
3. **上传失败** - 图片上传失败时返回具体错误信息，支持重试
4. **评论内容为空** - 提交空评论时返回 `VALIDATION_ERROR`

## 测试策略

### 单元测试
- 照片列表排序逻辑
- 收藏状态切换逻辑
- 评论添加逻辑
- 图片压缩工具函数

### 属性测试
使用 `fast-check` 库进行属性测试：

1. **Property 1** - 生成随机照片数据，验证排序正确性
2. **Property 2** - 生成随机用户和照片，验证收藏切换逻辑
3. **Property 3** - 生成随机评论，验证评论数量增长
4. **Property 4** - 生成随机图片数据，验证压缩效果

### 集成测试
- 完整的照片上传流程
- 收藏功能端到端测试
- 评论功能端到端测试
