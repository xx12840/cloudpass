import { Router } from 'itty-router';
import { handleAuth } from './api/auth';
import { handlePasswords } from './api/passwords';
import { handleImages } from './api/images';

// 创建路由器
const router = Router();

// CORS 预检请求处理
router.options('*', handleCors);

// 身份验证路由
router.post('/api/login', handleAuth);

// 密码管理路由
router.get('/api/passwords', handlePasswords.getAll);
router.post('/api/passwords', handlePasswords.create);
router.put('/api/passwords/:id', handlePasswords.update);
router.delete('/api/passwords/:id', handlePasswords.delete);

// 图片上传路由
router.post('/api/images', handleImages.upload);
router.delete('/api/images/:id', handleImages.delete);

// 404 处理
router.all('*', () => new Response('Not Found', { status: 404 }));

// 处理 CORS
function handleCors(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// 添加 CORS 头到所有响应
function addCorsHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// 主处理函数
export default {
  async fetch(request, env, ctx) {
    // 处理请求
    const response = await router.handle(request, env, ctx);
    
    // 添加 CORS 头
    return addCorsHeaders(response);
  }
};