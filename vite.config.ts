import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
    // base: "./", // 本地环境
    // base: "/Vue3Demo/", // github pag环境
    base: process.env.NODE_ENV === 'production' ? '/Vue3Demo/' : './',
    build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  }, // 本地环境，通过代理解决跨域问题
    server: {
        // 新增proxy配置
        proxy: {
            '^/(csrf-cookie|login|logout|api/user)$': { // 只代理4个目标接口
                target: 'https://dev.178778.xyz', // 后端 API 地址
                changeOrigin: true, // 改变请求头的 origin
                secure: false, // 支持 https 后端
                // logLevel: 'debug', // 开启代理请求日志
                configure: (proxy, options) => { // 挂钩 proxyRes，处理 set-cookie
                    // proxy.on('proxyRes', (proxyRes, req, res) => {
                    //     const cookies = proxyRes.headers['set-cookie'];
                    //     if (cookies) {
                    //         res.setHeader('set-cookie', cookies); // 把 set-cookie 传回浏览器
                    //     }
                    // });
                    // 打印请求头
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('📨 代理请求:', req.method, req.url);
                        console.log('📝 请求头:', req.headers);
                    });
                    // 打印响应头
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('📤 代理响应:', proxyRes.statusCode);
                        console.log('📄 响应头:', proxyRes.headers);
                        // 保留原有的 set-cookie 处理
                        const cookies = proxyRes.headers['set-cookie'];
                        if (cookies) {
                            res.setHeader('set-cookie', cookies);
                        }
                    });
                },
            },
            // 由于代理的/根路径跟当前主页路径冲突，这里临时：新增一个proxy配置来解决(单独配置获取服务器信息的接口,路径重写:/server-info=>/ 根路径)
            '^/(server-info)$': { // 单独代理服务器信息接口
                target: 'https://dev.178778.xyz', // 后端 API 地址
                changeOrigin: true, // 改变请求头的 origin
                secure: false, // 支持 https 后端
                rewrite: (path) => path.replace(/^\/server-info$/, '/'), //: 路径重写 /server-info => /
                // logLevel: 'debug', // 开启代理请求日志
                configure: (proxy, options) => { // 挂钩 proxyRes，处理 set-cookie
                    // proxy.on('proxyRes', (proxyRes, req, res) => {
                    //     const cookies = proxyRes.headers['set-cookie'];
                    //     if (cookies) {
                    //         res.setHeader('set-cookie', cookies); // 把 set-cookie 传回浏览器
                    //     }
                    // });
                    // 打印请求头
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('📨 代理请求:', req.method, req.url);
                        console.log('📝 请求头:', req.headers);
                    });
                    // 打印响应头
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('📤 代理响应:', proxyRes.statusCode);
                        console.log('📄 响应头:', proxyRes.headers);
                        // 保留原有的 set-cookie 处理
                        const cookies = proxyRes.headers['set-cookie'];
                        if (cookies) {
                            res.setHeader('set-cookie', cookies);
                        }
                    });
                },
            },
        },
    },
})
