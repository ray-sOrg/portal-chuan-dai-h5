# 部署文档

## 部署方式

### 1. Docker 部署

```bash
# 构建镜像
docker build -t portal-chuan-dai-h5 .

# 运行容器
docker run -p 3000:3000 portal-chuan-dai-h5
```

### 2. K8s 部署

项目包含 `deployment.yaml` 配置文件。

```bash
# 应用部署
kubectl apply -f deployment.yaml

# 查看状态
kubectl get pods -l app=portal-chuan-dai-h5
```

## 环境变量

```env
# 数据库
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 认证
AUTH_SECRET="your-secret-key"

# 腾讯云 COS
COS_SECRET_ID="..."
COS_SECRET_KEY="..."
COS_REGION="ap-shanghai"
COS_BUCKET="..."

# 其他
NEXT_PUBLIC_API_URL="https://api.example.com"
```

## 构建输出

使用 Next.js standalone 模式，构建产物独立运行。

## Nginx 配置 (可选)

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
