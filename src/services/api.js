import CryptoJS from 'crypto-js';

// 加密密钥，在实际应用中应该从环境变量获取
const ENCRYPTION_KEY = 'your-secret-key';

// 模拟数据存储
let passwords = [
  {
    id: '1',
    name: 'Gmail',
    username: 'john.smith@gmail.com',
    password: 'password123',
    url: 'https://gmail.com',
    owner: 'Acme',
    category: 'acme',
    tags: ['login'],
    icon: 'https://www.google.com/favicon.ico',
    images: []
  },
  {
    id: '2',
    name: 'Instagram',
    username: 'jsmith@gmail.com',
    password: 'insta2023',
    url: 'https://instagram.com',
    owner: 'Acme',
    category: 'acme',
    tags: ['login', 'social'],
    icon: 'https://www.instagram.com/favicon.ico',
    images: []
  },
  {
    id: '3',
    name: 'Facebook',
    username: 'johnnySmith',
    password: 'fb123456',
    url: 'https://facebook.com',
    owner: 'Me',
    category: 'my',
    tags: ['login', 'social'],
    icon: 'https://www.facebook.com/favicon.ico',
    images: []
  }
];

// 加密函数
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// 解密函数
const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 获取所有密码
export const fetchPasswords = async () => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在实际应用中，这里应该从API获取加密的密码，然后解密
  return passwords;
};

// 添加新密码
export const addPassword = async (passwordData) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPassword = {
    ...passwordData,
    id: Date.now().toString(),
    // 在实际应用中，这里应该加密密码
    // password: encrypt(passwordData.password),
    images: passwordData.images || []
  };
  
  passwords.push(newPassword);
  return newPassword;
};

// 更新密码
export const updatePassword = async (id, passwordData) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = passwords.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('密码不存在');
  }
  
  // 在实际应用中，这里应该加密密码
  // const encryptedPassword = encrypt(passwordData.password);
  
  passwords[index] = {
    ...passwords[index],
    ...passwordData,
    // password: encryptedPassword
  };
  
  return passwords[index];
};

// 删除密码
export const deletePassword = async (id) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = passwords.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('密码不存在');
  }
  
  passwords.splice(index, 1);
  return { success: true };
};

// 上传图片
export const uploadImage = async (file, passwordId) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 在实际应用中，这里应该上传图片到Cloudflare R2
  // 为了演示，我们创建一个本地URL
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      // 创建图片对象
      const image = {
        id: Date.now().toString(),
        url: imageUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        passwordId
      };
      
      // 更新密码对象中的图片数组
      const passwordIndex = passwords.findIndex(p => p.id === passwordId);
      if (passwordIndex !== -1) {
        if (!passwords[passwordIndex].images) {
          passwords[passwordIndex].images = [];
        }
        passwords[passwordIndex].images.push(image);
      }
      
      resolve(image);
    };
    reader.readAsDataURL(file);
  });
};
