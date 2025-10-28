# 部署指南

## Vercel部署（推荐）

### 1. 准备工作
- 确保代码已推送到GitHub仓库
- 准备好所有必要的API密钥

### 2. 在Vercel中部署
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的GitHub仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### 3. 环境变量配置
在Vercel项目设置中添加以下环境变量：

```env
OPENAI_API_KEY=your_openai_api_key
YOUTUBE_API_KEY=your_youtube_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. 部署
- 点击 "Deploy" 开始部署
- 等待部署完成
- 访问生成的域名

## Docker部署

### 1. 构建镜像
```bash
docker build -t yourmusicplaylist .
```

### 2. 运行容器
```bash
docker run -d \
  --name yourmusicplaylist \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e YOUTUBE_API_KEY=your_key \
  -e FIREBASE_PROJECT_ID=your_id \
  -e FIREBASE_PRIVATE_KEY=your_key \
  -e FIREBASE_CLIENT_EMAIL=your_email \
  -e JWT_SECRET=your_secret \
  yourmusicplaylist
```

### 3. 使用Docker Compose
```bash
# 创建环境变量文件
cp env.example .env

# 编辑环境变量
nano .env

# 启动服务
docker-compose up -d
```

## 服务器部署

### 1. 服务器要求
- Ubuntu 20.04+ 或 CentOS 8+
- Node.js 18+
- Nginx（可选）
- PM2（进程管理）

### 2. 安装依赖
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
sudo npm install -g pm2
```

### 3. 部署应用
```bash
# 克隆项目
git clone https://github.com/yourusername/yourmusicplaylist.git
cd yourmusicplaylist

# 安装依赖
npm install

# 构建应用
npm run build

# 使用PM2启动
pm2 start npm --name "yourmusicplaylist" -- start
pm2 save
pm2 startup
```

### 4. Nginx配置
创建 `/etc/nginx/sites-available/yourmusicplaylist`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/yourmusicplaylist /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Firebase配置

### 1. 创建Firebase项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 启用Authentication和Firestore

### 2. 配置Authentication
1. 在Authentication页面启用Email/Password登录
2. 配置授权域名

### 3. 配置Firestore
1. 创建Firestore数据库
2. 设置安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || resource.data.isPublic);
    }
  }
}
```

### 4. 获取服务账户密钥
1. 进入项目设置
2. 服务账户标签
3. 生成新的私钥
4. 下载JSON文件

## 环境变量说明

### 必需变量
- `OPENAI_API_KEY`: OpenAI API密钥
- `YOUTUBE_API_KEY`: YouTube Data API密钥
- `FIREBASE_PROJECT_ID`: Firebase项目ID
- `FIREBASE_PRIVATE_KEY`: Firebase私钥
- `FIREBASE_CLIENT_EMAIL`: Firebase客户端邮箱
- `JWT_SECRET`: JWT签名密钥

### 可选变量
- `NEXTAUTH_URL`: 应用URL（生产环境必需）
- `NEXTAUTH_SECRET`: NextAuth密钥
- `NODE_ENV`: 环境（development/production）

## 性能优化

### 1. 启用压缩
在 `next.config.js` 中：
```javascript
module.exports = {
  compress: true,
  // 其他配置...
}
```

### 2. 配置缓存
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}
```

### 3. 图片优化
使用Next.js Image组件：
```jsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="描述"
  width={500}
  height={300}
  priority
/>
```

## 监控和日志

### 1. 应用监控
使用PM2监控：
```bash
pm2 monit
```

### 2. 日志管理
```bash
# 查看日志
pm2 logs yourmusicplaylist

# 日志轮转
pm2 install pm2-logrotate
```

### 3. 健康检查
创建健康检查端点：
```javascript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date() })
}
```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本
   - 清除缓存：`rm -rf .next node_modules && npm install`

2. **API调用失败**
   - 检查环境变量
   - 验证API密钥有效性

3. **Firebase连接问题**
   - 检查项目ID和密钥
   - 验证安全规则

4. **性能问题**
   - 启用压缩
   - 优化图片
   - 使用CDN

### 调试模式
```bash
# 开发模式
npm run dev

# 生产模式调试
NODE_ENV=production npm start
```

