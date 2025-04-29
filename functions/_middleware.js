// 定义需要代理的后端API基础URL
const API_ORIGIN = "https://dev.178778.xyz";

// 需要代理的路径列表
const PROXY_PATHS = [
  "/",
  "/csrf-cookie",
  "/login",
  "/logout",
  "/api/user"
];

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 检查是否为需要代理的路径
  const shouldProxy = PROXY_PATHS.some(path => 
    url.pathname === path || 
    (path.endsWith('*') && url.pathname.startsWith(path.slice(0, -1)))
  );
  
  // 如果不需要代理，继续正常处理
  if (!shouldProxy) {
    return context.next();
  }
  
  // 处理OPTIONS预检请求
  if (request.method === "OPTIONS") {
    return handleCors(request);
  }
  
  // 构建目标URL
  const targetUrl = new URL(url.pathname, API_ORIGIN);
  
  // 复制所有查询参数
  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });
  
  console.log(`代理请求: ${request.method} ${url.pathname} -> ${targetUrl.toString()}`);
  
  // 创建发送到后端的请求
  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.blob(),
    redirect: 'manual',
  });
  
  try {
    // 发送请求到后端
    const response = await fetch(newRequest);
    
    // 读取响应体 (需要处理各种响应类型)
    let responseBody;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
      responseBody = JSON.stringify(responseBody);
    } else {
      responseBody = await response.arrayBuffer();
    }
    
    // 创建新响应对象
    const newResponse = new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });
    
    // 复制所有响应头
    response.headers.forEach((value, key) => {
      // 跳过某些特定头部，这些头部由Cloudflare自动设置
      if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
        newResponse.headers.set(key, value);
      }
    });
    
    // 添加CORS头部
    newResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, X-XSRF-TOKEN');
    
    return newResponse;
  } catch (error) {
    console.error(`代理请求错误: ${error.message}`);
    return new Response(JSON.stringify({
      error: '代理请求失败',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }
}

// 处理CORS预检请求
function handleCors(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-TOKEN, X-XSRF-TOKEN',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
}
