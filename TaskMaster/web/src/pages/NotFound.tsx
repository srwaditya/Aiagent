import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Import icons
import { FiHome } from 'react-icons/fi';

const NotFound: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
        <NotFoundText>
          The page you are looking for doesn't exist or has been moved.
        </NotFoundText>
        <HomeButton to="/">
          <FiHome />
          <span>Back to Dashboard</span>
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 24px;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 500px;
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #4361ee; /* Primary color */
  margin: 0;
  line-height: 1;
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const NotFoundText = styled.p`
  font-size: 1rem;
  color: #6c757d; /* Secondary text color */
  margin: 0 0 24px 0;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  background-color: #4361ee; /* Primary color */
  color: white;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: #2f4ad0; /* Darker primary color */
  }
`;

export default NotFound;