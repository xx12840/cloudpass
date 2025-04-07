// 创建简单的令牌
function createToken(username) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 // 24小时过期
  };
  
  // 在实际应用中，应该使用更安全的JWT库
  // 这里简化处理，使用Base64编码
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // 使用简单的签名方法
  const signature = btoa(
    encrypt(`${encodedHeader}.${encodedPayload}`)
  );
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 验证令牌
export function verifyToken(token) {
  try {
    if (!token) return false;
    
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    // 验证签名
    const expectedSignature = btoa(
      encrypt(`${encodedHeader}.${encodedPayload}`)
    );
    
    if (signature !== expectedSignature) {
      return false;
    }
    
    // 解析载荷
    const payload = JSON.parse(atob(encodedPayload));
    
    // 检查令牌是否过期
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return false;
    }
    
    return payload;
  } catch (error) {
    return false;
  }
}

// 中间件：验证请求中的令牌
export function authMiddleware(handler) {
  return async (request, env, ctx) => {
    // 从请求头中获取令牌
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '未授权访问' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '无效或过期的令牌' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 将用户信息添加到请求中
    request.user = payload;
    
    // 调用处理程序
    return handler(request, env, ctx);
  };
}
