# Vue3 RESTful API Demo

## 功能特点

- 使用Vue3 Composition API和TypeScript
- 基于TailwindCSS的响应式UI设计
- 完整的RESTful API对接
- 支持CSRF保护
- 基于路由的权限控制
- 支持环境变量配置多域名部署
- 完整的HTTP状态码处理

## API 接口

所有API请求基于基础URL: `https://dev.178778.xyz`

- `GET /` – 获取服务器及客户端基本信息
- `GET /csrf-cookie` - 获取CSRF令牌
- `POST /login` - 用户登录
- `POST /logout` - 用户登出
- `GET /api/user` - 获取用户资料

## 开发环境

```bash
# 安装依赖
yarn install

# 开发模式启动
yarn dev

# 类型检查
yarn type-check

# 构建生产版本
yarn build

# 预览生产版本
yarn preview
```

## 部署

项目支持以下部署方式：

- GitHub Pages (通过GitHub Actions自动部署)
- Cloudflare Pages

## 环境变量

项目使用环境变量来配置不同的API基础URL：

- `.env` - 开发环境配置
- `.env.production` - 生产环境配置

可以根据需要配置不同环境的API地址。

## 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 组件
├── services/       # API服务
├── views/          # 页面视图
├── App.vue         # 主应用组件
├── main.ts         # 入口文件
└── vite-env.d.ts   # 环境类型定义
```
