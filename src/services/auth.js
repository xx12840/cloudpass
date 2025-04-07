import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有认证令牌
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ username: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // 在实际应用中，这里应该调用API进行验证
    // 为了演示，我们使用硬编码的凭据
    if (username === 'admin' && password === 'admin') {
      // 创建一个简单的令牌
      const token = CryptoJS.SHA256(username + Date.now()).toString();
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}