import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../shared/constants/colors';

// Import icons (assuming we're using react-icons)
import { FiSun, FiMoon, FiSearch, FiPlus, FiBell, FiUser } from 'react-icons/fi';

const Header: React.FC = () => {
  const { theme, themeType, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'Tasks';
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path === '/settings') return 'Settings';
    
    return 'TaskMaster';
  };
  
  return (
    <HeaderContainer theme={theme}>
      <PageTitle>{getPageTitle()}</PageTitle>
      
      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder="Search tasks..." />
      </SearchContainer>
      
      <ActionsContainer>
        <IconButton onClick={() => navigate('/tasks/new')}>
          <PlusIcon />
        </IconButton>
        
        <IconButton>
          <BellIcon />
        </IconButton>
        
        <IconButton onClick={toggleTheme}>
          {themeType === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
        
        <UserButton>
          <UserIcon />
        </UserButton>
      </ActionsContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  height: 64px;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px 8px 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primaryLight}40;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: ${props => props.theme.text};
  background-color: transparent;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.divider};
  }
`;

const UserButton = styled(IconButton)`
  background-color: ${COLORS.primary}20;
  color: ${COLORS.primary};
  
  &:hover {
    background-color: ${COLORS.primary}30;
  }
`;

const PlusIcon = styled(FiPlus)`
  font-size: 1.2rem;
`;

const BellIcon = styled(FiBell)`
  font-size: 1.2rem;
`;

const SunIcon = styled(FiSun)`
  font-size: 1.2rem;
`;

const MoonIcon = styled(FiMoon)`
  font-size: 1.2rem;
`;

const UserIcon = styled(FiUser)`
  font-size: 1.2rem;
`;

export default Header;