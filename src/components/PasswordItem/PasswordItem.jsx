import React, { useState } from 'react';
import styled from 'styled-components';
import ImageUploader from '../ImageUploader/ImageUploader';
import { deletePassword, updatePassword } from '../../services/api';

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

const TableCell = styled.td`
  padding: 12px 20px;
  vertical-align: middle;
`;

const NameCell = styled(TableCell)`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-weight: 500;
`;

const Username = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const OwnerTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${props => props.owner === 'Me' ? '#e3f2fd' : '#e8f5e9'};
  color: ${props => props.owner === 'Me' ? '#1976d2' : '#388e3c'};
  border-radius: 4px;
  font-size: 0.85rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #175DDC;
  }
`;

const DetailsPanel = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 15px;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
`;

const DetailValue = styled.div`
  display: flex;
  align-items: center;
  
  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: ${props => props.readOnly ? '#f5f5f5' : 'white'};
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  margin-left: 8px;
  
  &:hover {
    color: #175DDC;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? '#175DDC' : props.danger ? '#e74c3c' : 'white'};
  color: ${props => (props.primary || props.danger) ? 'white' : '#333'};
  border: 1px solid ${props => props.primary ? '#175DDC' : props.danger ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#0e4bba' : props.danger ? '#c0392b' : '#f5f5f5'};
  }
`;

function PasswordItem({ password }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPassword, setEditedPassword] = useState({ ...password });
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [images, setImages] = useState(password.images || []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails) {
      setIsEditing(false);
      setEditedPassword({ ...password });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updatePassword(editedPassword.id, editedPassword);
      setIsEditing(false);
      // 更新本地状态
      Object.assign(password, editedPassword);
    } catch (err) {
      console.error('更新密码失败:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPassword({ ...password });
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个密码吗？')) {
      try {
        await deletePassword(password.id);
        // 刷新页面以更新列表
        window.location.reload();
      } catch (err) {
        console.error('删除密码失败:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  const getIconUrl = () => {
    if (password.icon) return password.icon;
    
    // 默认图标逻辑
    const domain = password.url ? new URL(password.url).hostname : '';
    if (domain.includes('google')) return 'https://www.google.com/favicon.ico';
    if (domain.includes('facebook')) return 'https://www.facebook.com/favicon.ico';
    if (domain.includes('twitter')) return 'https://twitter.com/favicon.ico';
    if (domain.includes('instagram')) return 'https://www.instagram.com/favicon.ico';
    if (domain.includes('github')) return 'https://github.com/favicon.ico';
    
    // 默认图标
    return 'https://via.placeholder.com/32';
  };

  const handleImageUpload = (newImages) => {
    setImages([...images, ...newImages]);
    setEditedPassword(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <input type="checkbox" />
        </TableCell>
        <NameCell>
          <Icon>
            <img src={getIconUrl()} alt={password.name} />
          </Icon>
          <NameInfo>
            <Name>{password.name}</Name>
            <Username>{password.username}</Username>
          </NameInfo>
        </NameCell>
        <TableCell>
          <OwnerTag owner={password.owner}>{password.owner}</OwnerTag>
        </TableCell>
        <TableCell>
          <ActionButton onClick={toggleDetails}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
        </TableCell>
      </TableRow>
      
      {showDetails && (
        <tr>
          <td colSpan="4">
            <DetailsPanel>
              <DetailsGrid>
                <DetailItem>
                  <DetailLabel>名称</DetailLabel>
                  <DetailValue>
                    <input 
                      type="text" 
                      name="name"
                      value={editedPassword.name} 
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>用户名</DetailLabel>
                  <DetailValue>
                    <input 
                      type="text" 
                      name="username"
                      value={editedPassword.username} 
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                    <CopyButton onClick={() => copyToClipboard(password.username)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5H7C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 11V3C3 1.89543 3.89543 1 5 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopyButton>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>密码</DetailLabel>
                  <DetailValue>
                    <input 
                      type="password" 
                      name="password"
                      value={editedPassword.password} 
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                    <CopyButton onClick={() => copyToClipboard(password.password)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5H7C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 11V3C3 1.89543 3.89543 1 5 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopyButton>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>网址</DetailLabel>
                  <DetailValue>
                    <input 
                      type="text" 
                      name="url"
                      value={editedPassword.url} 
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                    <CopyButton onClick={() => copyToClipboard(password.url)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5H7C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 11V3C3 1.89543 3.89543 1 5 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopyButton>
                  </DetailValue>
                </DetailItem>
              </DetailsGrid>
              
              <div style={{ marginTop: '20px' }}>
                <DetailLabel>图片</DetailLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                  {images.map((image, index) => (
                    <div key={index} style={{ width: '100px', height: '100px', position: 'relative' }}>
                      <img 
                        src={image.url} 
                        alt={`Screenshot ${index + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        border: '2px dashed #ddd', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowImageUploader(true)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <ButtonGroup>
                {isEditing ? (
                  <>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button primary onClick={handleSave}>保存</Button>
                  </>
                ) : (
                  <>
                    <Button danger onClick={handleDelete}>删除</Button>
                    <Button onClick={handleEdit}>编辑</Button>
                  </>
                )}
              </ButtonGroup>
            </DetailsPanel>
          </td>
        </tr>
      )}
      
      {showImageUploader && (
        <ImageUploader 
          onClose={() => setShowImageUploader(false)}
          onUpload={handleImageUpload}
          passwordId={password.id}
        />
      )}
    </>
  );
}

export default PasswordItem;
