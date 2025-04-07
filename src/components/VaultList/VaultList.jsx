import React, { useState } from 'react';
import styled from 'styled-components';
import PasswordItem from '../PasswordItem/PasswordItem';
import { addPassword } from '../../services/api';

const VaultContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const VaultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  
  input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? '#175DDC' : 'white'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: 1px solid ${props => props.primary ? '#175DDC' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#0e4bba' : '#f5f5f5'};
  }
`;

const VaultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f9f9f9;
  
  th {
    padding: 12px 20px;
    text-align: left;
    font-weight: 500;
    color: #666;
    border-bottom: 1px solid #eee;
  }
`;

const TableBody = styled.tbody`
  tr:hover {
    background-color: #f5f6fa;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
`;

const LoadingState = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
`;

const ErrorState = styled.div`
  padding: 40px;
  text-align: center;
  color: #e74c3c;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

function VaultList({ passwords, loading, error, searchTerm, onSearchChange }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    name: '',
    username: '',
    password: '',
    url: '',
    category: 'my',
    tags: ['login'],
    icon: ''
  });

  const handleAddPassword = async () => {
    try {
      await addPassword(newPassword);
      setShowAddModal(false);
      // 重新加载密码列表
      window.location.reload();
    } catch (err) {
      console.error('添加密码失败:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <VaultContainer>
        <VaultHeader>
          <Title>所有保管库</Title>
        </VaultHeader>
        <LoadingState>加载中...</LoadingState>
      </VaultContainer>
    );
  }

  if (error) {
    return (
      <VaultContainer>
        <VaultHeader>
          <Title>所有保管库</Title>
        </VaultHeader>
        <ErrorState>{error}</ErrorState>
      </VaultContainer>
    );
  }

  return (
    <>
      <VaultContainer>
        <VaultHeader>
          <Title>所有保管库</Title>
          <div style={{ display: 'flex' }}>
            <SearchBar>
              <input 
                type="text" 
                placeholder="搜索" 
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </SearchBar>
            <ActionButtons>
              <Button primary onClick={() => setShowAddModal(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                新建
              </Button>
            </ActionButtons>
          </div>
        </VaultHeader>
        
        {passwords.length === 0 ? (
          <EmptyState>
            {searchTerm ? '没有找到匹配的密码' : '没有保存的密码，点击"新建"添加一个'}
          </EmptyState>
        ) : (
          <VaultTable>
            <TableHeader>
              <tr>
                <th style={{ width: '30px' }}>
                  <input type="checkbox" />
                </th>
                <th style={{ width: '40%' }}>名称</th>
                <th style={{ width: '30%' }}>所有者</th>
                <th style={{ width: '30px' }}></th>
              </tr>
            </TableHeader>
            <TableBody>
              {passwords.map(password => (
                <PasswordItem key={password.id} password={password} />
              ))}
            </TableBody>
          </VaultTable>
        )}
      </VaultContainer>
      
      {showAddModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>添加新密码</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </ModalHeader>
            
            <FormGroup>
              <label htmlFor="name">名称</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                value={newPassword.name}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="username">用户名</label>
              <input 
                id="username" 
                name="username" 
                type="text" 
                value={newPassword.username}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="password">密码</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                value={newPassword.password}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="url">网址</label>
              <input 
                id="url" 
                name="url" 
                type="text" 
                value={newPassword.url}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="category">分类</label>
              <select 
                id="category" 
                name="category" 
                value={newPassword.category}
                onChange={handleInputChange}
              >
                <option value="my">我的保管库</option>
                <option value="acme">Acme</option>
              </select>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="icon">图标URL (可选)</label>
              <input 
                id="icon" 
                name="icon" 
                type="text" 
                value={newPassword.icon}
                onChange={handleInputChange}
                placeholder="例如: https://example.com/icon.png"
              />
            </FormGroup>
            
            <Button primary onClick={handleAddPassword} style={{ width: '100%' }}>
              保存
            </Button>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default VaultList;
