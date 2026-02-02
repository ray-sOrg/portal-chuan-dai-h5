# API 路由

## 概览

基于 Next.js App Router，API 路由位于 `src/app/api/`。

## 路由列表

### 健康检查

```
GET /api/health
```
返回服务健康状态。

### 照片上传

```
POST /api/photos/upload-image
```
上传图片到腾讯云 COS。

**请求**: multipart/form-data
- `file`: 图片文件

**响应**:
```json
{
  "url": "https://img.tt829.cn/xxx.jpg",
  "thumbnailUrl": "https://img.tt829.cn/xxx_thumb.jpg",
  "mediumUrl": "https://img.tt829.cn/xxx_medium.jpg",
  "width": 1920,
  "height": 1080
}
```

## Server Actions

Actions 位于 `src/actions/` 目录，按模块组织：

### 认证 (auth)
- `signUp` - 用户注册
- `signIn` - 用户登录
- `signOut` - 退出登录
- `updatePassword` - 修改密码
- `forgotPassword` - 忘记密码

### 菜品 (dish)
- `getDishes` - 获取菜品列表
- `getDishDetail` - 获取菜品详情
- `toggleFavorite` - 收藏/取消收藏

### 照片 (photo)
- `getPhotos` - 获取照片列表
- `getPhotoDetail` - 获取照片详情
- `uploadPhoto` - 上传照片
- `deletePhoto` - 删除照片
- `addComment` - 添加评论
- `toggleFavorite` - 收藏/取消收藏
