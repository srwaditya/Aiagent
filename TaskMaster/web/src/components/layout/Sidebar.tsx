import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../../../shared/constants/colors';

// Import icons (assuming we're using react-icons)
import { 
  FiHome, 
  FiCheckSquare, 
  FiCalendar, 
  FiTag, 
  FiSettings,
  FiFolder
} from 'react-icons/fi';

// Import from Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const categories = useSelector((state: RootState) => state.categories.categories);
  
  return (
    <SidebarContainer theme={theme}>
      <LogoContainer>
        <Logo>TaskMaster</Logo>
      </LogoContainer>
      
      <NavSection>
        <NavItem 
          to="/" 
          $isActive={location.pathname === '/'}
          theme={theme}
        >
          <NavIcon as={FiHome} />
          <NavText>Dashboard</NavText>
        </NavItem>
        
        <NavItem 
          to="/tasks" 
          $isActive={location.pathname === '/tasks'}
          theme={theme}
        >
          <NavIcon as={FiCheckSquare} />
          <NavText>Tasks</NavText>
        </NavItem>
        
        <NavItem 
          to="/calendar" 
          $isActive={location.pathname === '/calendar'}
          theme={theme}
        >
          <NavIcon as={FiCalendar} />
          <NavText>Calendar</NavText>
        </NavItem>
      </NavSection>
      
      <SectionTitle>Categories</SectionTitle>
      <NavSection>
        {categories.map(category => (
          <NavItem 
            key={category.id}
            to={`/categories/${category.id}`}
            $isActive={location.pathname === `/categories/${category.id}`}
            theme={theme}
          >
            <CategoryIcon color={category.color}>
              <FiFolder />
            </CategoryIcon>
            <NavText>{category.name}</NavText>
          </NavItem>
        ))}
      </NavSection>
      
      <SectionTitle>Tags</SectionTitle>
      <NavSection>
        <NavItem 
          to="/tags" 
          $isActive={location.pathname === '/tags'}
          theme={theme}
        >
          <NavIcon as={FiTag} />
          <NavText>Manage Tags</NavText>
        </NavItem>
      </NavSection>
      
      <BottomSection>
        <NavItem 
          to="/settings" 
          $isActive={location.pathname === '/settings'}
          theme={theme}
        >
          <NavIcon as={FiSettings} />
          <NavText>Settings</NavText>
        </NavItem>
      </BottomSection>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 240px;
  height: 100%;
  background-color: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const LogoContainer = styled.div`
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.primary};
  margin: 0;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.theme.textSecondary};
  padding: 0 16px;
  margin: 8px 0;
`;

interface NavItemProps {
  $isActive: boolean;
  theme: any;
}

const NavItem = styled(NavLink)<NavItemProps>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${props => props.$isActive ? COLORS.primary : props.theme.text};
  background-color: ${props => props.$isActive ? `${COLORS.primary}10` : 'transparent'};
  border-left: 3px solid ${props => props.$isActive ? COLORS.primary : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isActive ? `${COLORS.primary}10` : props.theme.divider};
  }
`;

const NavIcon = styled.svg`
  font-size: 1.2rem;
  margin-right: 12px;
`;

const CategoryIcon = styled.div<{ color: string }>`
  font-size: 1.2rem;
  margin-right: 12px;
  color: ${props => props.color};
`;

const NavText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const BottomSection = styled.div`
  margin-top: auto;
  padding-bottom: 16px;
`;

export default Sidebar;