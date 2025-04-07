import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../services/auth';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #175DDC;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavSection = styled.div`
  margin-top: 20px;
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  
  svg {
    margin-right: 10px;
    transition: transform 0.3s;
    transform: ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0)'};
  }
`;

const NavItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const NavItem = styled.li`
  padding: 10px 20px 10px 40px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

function Sidebar({ onCategoryChange, onFilterChange }) {
  const [vaultsOpen, setVaultsOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const { logout } = useAuth();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  return (
    <SidebarContainer>
      <Logo>CloudPass</Logo>
      
      <NavSection>
        <NavHeader isOpen={vaultsOpen} onClick={() => setVaultsOpen(!vaultsOpen)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          所有保管库
        </NavHeader>
        <NavItems isOpen={vaultsOpen}>
          <NavItem 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => handleCategoryClick('all')}
          >
            所有保管库
          </NavItem>
          <NavItem 
            className={activeCategory === 'my' ? 'active' : ''} 
            onClick={() => handleCategoryClick('my')}
          >
            我的保管库
          </NavItem>
          <NavItem 
            className={activeCategory === 'acme' ? 'active' : ''} 
            onClick={() => handleCategoryClick('acme')}
          >
            Acme
          </NavItem>
        </NavItems>
      </NavSection>
      
      <NavSection>
        <NavHeader isOpen={itemsOpen} onClick={() => setItemsOpen(!itemsOpen)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          所有项目
        </NavHeader>
        <NavItems isOpen={itemsOpen}>
          <NavItem onClick={() => handleFilterClick('all')}>所有项目</NavItem>
          <NavItem onClick={() => handleFilterClick('favorites')}>收藏</NavItem>
          <NavItem onClick={() => handleFilterClick('login')}>登录</NavItem>
          <NavItem onClick={() => handleFilterClick('card')}>卡片</NavItem>
          <NavItem onClick={() => handleFilterClick('identity')}>身份</NavItem>
          <NavItem onClick={() => handleFilterClick('note')}>笔记</NavItem>
        </NavItems>
      </NavSection>
      
      <NavSection>
        <NavHeader isOpen={foldersOpen} onClick={() => setFoldersOpen(!foldersOpen)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          文件夹
        </NavHeader>
        <NavItems isOpen={foldersOpen}>
          <NavItem onClick={() => handleFilterClick('finances')}>财务</NavItem>
          <NavItem onClick={() => handleFilterClick('health')}>健康</NavItem>
          <NavItem onClick={() => handleFilterClick('entertainment')}>娱乐</NavItem>
        </NavItems>
      </NavSection>
      
      <NavSection>
        <NavHeader isOpen={collectionsOpen} onClick={() => setCollectionsOpen(!collectionsOpen)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          集合
        </NavHeader>
        <NavItems isOpen={collectionsOpen}>
          <NavItem onClick={() => handleFilterClick('marketing')}>市场营销</NavItem>
          <NavItem onClick={() => handleFilterClick('product')}>产品</NavItem>
          <NavItem onClick={() => handleFilterClick('sales')}>销售</NavItem>
        </NavItems>
      </NavSection>
      
      <LogoutButton onClick={logout}>退出登录</LogoutButton>
    </SidebarContainer>
  );
}

export default Sidebar;
