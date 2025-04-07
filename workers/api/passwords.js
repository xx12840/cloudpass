import { authMiddleware } from './auth';
import { encrypt, decrypt } from '../utils/encryption';

// 密码管理处理程序
export const handlePasswords = {
  // 获取所有密码
  getAll: authMiddleware(async (request, env) => {
    try {
      // 从 R2 存储桶获取密码列表
      const passwordsListObj = await env.PASSWORDS_BUCKET.get('passwords_list.json');
      
      if (!passwordsListObj) {
        // 如果不存在，返回空数组
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 解析密码列表
      const passwordsList = JSON.parse(await passwordsListObj.text());
      
      // 获取每个密码的详细信息
      const passwords = await Promise.all(
        passwordsList.map(async (id) => {
          const passwordObj = await env.PASSWORDS_BUCKET.get(`password_${id}.json`);
          if (!passwordObj) return null;
          
          const password = JSON.parse(await passwordObj.text());
          
          // 解密密码
          if (password.encryptedPassword) {
            password.password = decrypt(password.encryptedPassword);
            delete password.encryptedPassword;
          }
          
          return password;
        })
      );
      
      // 过滤掉不存在的密码
      const filteredPasswords = passwords.filter(p => p !== null);
      
      return new Response(JSON.stringify(filteredPasswords), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '获取密码失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
  
  // 创建新密码
  create: authMiddleware(async (request, env) => {
    try {
      const passwordData = await request.json();
      
      // 验证必填字段
      if (!passwordData.name || !passwordData.username || !passwordData.password) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '名称、用户名和密码为必填项' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 生成唯一ID
      const id = Date.now().toString();
      
      // 加密密码
      const encryptedPassword = encrypt(passwordData.password);
      
      // 创建密码对象
      const password = {
        id,
        name: passwordData.name,
        username: passwordData.username,
        encryptedPassword,
        url: passwordData.url || '',
        owner: passwordData.owner || 'Me',
        category: passwordData.category || 'my',
        tags: passwordData.tags || ['login'],
        icon: passwordData.icon || '',
        images: passwordData.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 存储密码对象
      await env.PASSWORDS_BUCKET.put(
        `password_${id}.json`,
        JSON.stringify(password)
      );
      
      // 更新密码列表
      const passwordsListObj = await env.PASSWORDS_BUCKET.get('passwords_list.json');
      let passwordsList = [];
      
      if (passwordsListObj) {
        passwordsList = JSON.parse(await passwordsListObj.text());
      }
      
      passwordsList.push(id);
      
      await env.PASSWORDS_BUCKET.put(
        'passwords_list.json',
        JSON.stringify(passwordsList)
      );
      
      // 返回创建的密码（不包含加密密码）
      const responsePassword = { ...password };
      responsePassword.password = passwordData.password;
      delete responsePassword.encryptedPassword;
      
      return new Response(JSON.stringify({ 
        success: true, 
        password: responsePassword 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '创建密码失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
  
  // 更新密码
  update: authMiddleware(async (request, env) => {
    try {
      const { id } = request.params;
      const updateData = await request.json();
      
      // 获取现有密码
      const passwordObj = await env.PASSWORDS_BUCKET.get(`password_${id}.json`);
      
      if (!passwordObj) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '密码不存在' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const password = JSON.parse(await passwordObj.text());
      
      // 更新字段
      if (updateData.name) password.name = updateData.name;
      if (updateData.username) password.username = updateData.username;
      if (updateData.password) password.encryptedPassword = encrypt(updateData.password);
      if (updateData.url !== undefined) password.url = updateData.url;
      if (updateData.owner) password.owner = updateData.owner;
      if (updateData.category) password.category = updateData.category;
      if (updateData.tags) password.tags = updateData.tags;
      if (updateData.icon !== undefined) password.icon = updateData.icon;
      if (updateData.images) password.images = updateData.images;
      
      password.updatedAt = new Date().toISOString();
      
      // 存储更新后的密码
      await env.PASSWORDS_BUCKET.put(
        `password_${id}.json`,
        JSON.stringify(password)
      );
      
      // 返回更新后的密码（不包含加密密码）
      const responsePassword = { ...password };
      if (updateData.password) {
        responsePassword.password = updateData.password;
      } else {
        responsePassword.password = decrypt(password.encryptedPassword);
      }
      delete responsePassword.encryptedPassword;
      
      return new Response(JSON.stringify({ 
        success: true, 
        password: responsePassword 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '更新密码失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
  
  // 删除密码
  delete: authMiddleware(async (request, env) => {
    try {
      const { id } = request.params;
      
      // 检查密码是否存在
      const passwordObj = await env.PASSWORDS_BUCKET.get(`password_${id}.json`);
      
      if (!passwordObj) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '密码不存在' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 删除密码
      await env.PASSWORDS_BUCKET.delete(`password_${id}.json`);
      
      // 更新密码列表
      const passwordsListObj = await env.PASSWORDS_BUCKET.get('passwords_list.json');
      
      if (passwordsListObj) {
        let passwordsList = JSON.parse(await passwordsListObj.text());
        passwordsList = passwordsList.filter(passwordId => passwordId !== id);
        
        await env.PASSWORDS_BUCKET.put(
          'passwords_list.json',
          JSON.stringify(passwordsList)
        );
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: '密码已删除' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '删除密码失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  })
};