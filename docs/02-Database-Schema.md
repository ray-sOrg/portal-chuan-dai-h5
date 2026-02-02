# 数据库设计

## 概览

- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: Lucia Auth + Argon2 密码加密

## 数据模型

### 用户模块 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| account | String | 账号 (唯一, 3-16位数字字母) |
| passwordHash | String | 密码哈希 |
| phone | String? | 手机号 (可选) |
| nickname | String? | 昵称 |
| avatar | String? | 头像 URL |
| gender | Enum? | 性别 (MALE/FEMALE/OTHER) |
| birthday | DateTime? | 生日 |
| bio | VarChar(200)? | 个人简介 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |
| lastLoginAt | DateTime? | 最后登录时间 |
| lastLoginIp | String? | 最后登录 IP |

**关联**: Session, Favorite, Photo, PhotoFavorite, PhotoComment

### 会话 (Session)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 (CUID) |
| expiresAt | DateTime | 过期时间 |
| userId | UUID | 关联用户 |

### 菜品模块 (Dish)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | String | 菜品名称 |
| nameEn | String? | 英文名称 |
| description | VarChar(500)? | 描述 |
| descEn | VarChar(500)? | 英文描述 |
| price | Decimal(10,2) | 价格 |
| image | String? | 图片 URL |
| category | Enum | 分类 (APPETIZER/MAIN_COURSE/SOUP/DESSERT/BEVERAGE) |
| isSpicy | Boolean | 是否辣 |
| isVegetarian | Boolean | 是否素食 |
| isAvailable | Boolean | 是否可用 |

**关联**: Favorite

### 收藏 (Favorite)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| userId | UUID | 用户 ID |
| dishId | UUID | 菜品 ID |
| createdAt | DateTime | 收藏时间 |

**联合唯一索引**: [userId, dishId]

### 照片模块 (Photo)

#### 聚会 (Gathering)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | String | 聚会标题 |
| description | VarChar(500)? | 描述 |
| date | DateTime | 聚会日期 |
| location | String? | 地点 |

#### 照片 (Photo)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | String | 标题 |
| description | VarChar(500)? | 描述 |
| url | String | 原图 URL |
| thumbnailUrl | String? | 缩略图 URL |
| mediumUrl | String? | 中等尺寸 URL |
| width | Int? | 原图宽度 |
| height | Int? | 原图高度 |
| emotionTag | Enum? | 情绪标签 |
| gatheringId | UUID? | 所属聚会 |
| uploaderId | UUID | 上传者 |
| createdAt | DateTime | 上传时间 |
| updatedAt | DateTime | 更新时间 |

**关联**: Gathering, User, PhotoFavorite, PhotoComment

### 照片收藏 (PhotoFavorite)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| userId | UUID | 用户 ID |
| photoId | UUID | 照片 ID |
| createdAt | DateTime | 收藏时间 |

### 照片评论 (PhotoComment)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| content | VarChar(500) | 评论内容 |
| photoId | UUID | 照片 ID |
| authorId | UUID | 作者 ID |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## 待开发模块

- 订单系统 (Order, OrderItem)
- 评论系统
- 优惠券
- 收货地址
