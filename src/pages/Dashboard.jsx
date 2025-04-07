import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar/Sidebar';
import VaultList from '../components/VaultList/VaultList';
import { fetchPasswords } from '../services/api';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f6fa;
`;

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadPasswords = async () => {
      try {
        setLoading(true);
        const data = await fetchPasswords();
        setPasswords(data);
        setError(null);
      } catch (err) {
        setError('加载密码数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPasswords();
  }, []);

  const filteredPasswords = passwords.filter(password => {
    // 根据搜索词过滤
    if (searchTerm && !password.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !password.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 根据分类过滤
    if (selectedCategory !== 'all' && password.category !== selectedCategory) {
      return false;
    }
    
    // 根据标签过滤
    if (filter !== 'all' && !password.tags.includes(filter)) {
      return false;
    }
    
    return true;
  });

  return (
    <DashboardContainer>
      <Sidebar 
        onCategoryChange={setSelectedCategory} 
        onFilterChange={setFilter}
      />
      <MainContent>
        <VaultList 
          passwords={filteredPasswords} 
          loading={loading} 
          error={error}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;