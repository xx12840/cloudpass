import CryptoJS from 'crypto-js';

// 加密密钥，在实际应用中应该从环境变量获取
const ENCRYPTION_KEY = 'your-secret-key';

// 加密函数
export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// 解密函数
export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 生成随机密码
export const generatePassword = (length = 12, options = {}) => {
  const defaults = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  };
  
  const config = { ...defaults, ...options };
  
  let chars = '';
  if (config.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (config.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (config.numbers) chars += '0123456789';
  if (config.symbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
};