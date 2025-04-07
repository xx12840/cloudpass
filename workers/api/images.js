import { authMiddleware } from './auth';

export const handleImages = {
  // 上传图片
  upload: authMiddleware(async (request, env) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const passwordId = formData.get('passwordId');
      
      if (!file || !passwordId) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '缺少文件或密码ID' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 检查密码是否存在
      const passwordObj = await env.PASSWORDS_BUCKET.get(`password_${passwordId}.json`);
      
      if (!passwordObj) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '密码不存在' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 生成唯一的图片ID
      const imageId = Date.now().toString();
      
      // 存储图片到R2
      const imageKey = `images/${passwordId}/${imageId}`;
      await env.PASSWORDS_BUCKET.put(imageKey, file);
      
      // 获取图片的公共URL
      const imageUrl = `${env.PUBLIC_URL}/api/images/${imageKey}`;
      
      // 更新密码对象，添加图片信息
      const password = JSON.parse(await passwordObj.text());
      
      if (!password.images) {
        password.images = [];
      }
      
      password.images.push({
        id: imageId,
        url: imageUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        createdAt: new Date().toISOString()
      });
      
      password.updatedAt = new Date().toISOString();
      
      // 保存更新后的密码对象
      await env.PASSWORDS_BUCKET.put(
        `password_${passwordId}.json`,
        JSON.stringify(password)
      );
      
      return new Response(JSON.stringify({ 
        success: true, 
        image: {
          id: imageId,
          url: imageUrl,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date().toISOString()
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '上传图片失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
  
  // 删除图片
  delete: authMiddleware(async (request, env) => {
    try {
      const { id } = request.params;
      const { passwordId } = await request.json();
      
      if (!passwordId) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '缺少密码ID' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 检查密码是否存在
      const passwordObj = await env.PASSWORDS_BUCKET.get(`password_${passwordId}.json`);
      
      if (!passwordObj) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: '密码不存在' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 删除R2中的图片
      const imageKey = `images/${passwordId}/${id}`;
      await env.PASSWORDS_BUCKET.delete(imageKey);
      
      // 更新密码对象，移除图片信息
      const password = JSON.parse(await passwordObj.text());
      
      if (password.images) {
        password.images = password.images.filter(image => image.id !== id);
        password.updatedAt = new Date().toISOString();
        
        // 保存更新后的密码对象
        await env.PASSWORDS_BUCKET.put(
          `password_${passwordId}.json`,
          JSON.stringify(password)
        );
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: '图片已删除' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '删除图片失败', 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  })
};