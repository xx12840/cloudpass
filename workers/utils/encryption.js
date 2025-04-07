// 加密密钥，在实际应用中应该从环境变量获取
const ENCRYPTION_KEY = 'your-secret-key';

// 简单的加密函数
export function encrypt(text) {
  // 在实际应用中，应该使用更安全的加密方法
  // 这里使用简单的Base64编码和异或操作进行演示
  const encoded = btoa(text);
  let encrypted = '';
  
  for (let i = 0; i < encoded.length; i++) {
    const charCode = encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  return btoa(encrypted);
}

// 简单的解密函数
export function decrypt(ciphertext) {
  try {
    const encrypted = atob(ciphertext);
    let decoded = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decoded += String.fromCharCode(charCode);
    }
    
    return atob(decoded);
  } catch (error) {
    console.error('解密失败:', error);
    return '';
  }
}
