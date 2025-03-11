import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from './context/ThemeContext';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Eager loaded pages
import Dashboard from './pages/Dashboard';

// Lazy loaded pages for better performance
const TaskList = lazy(() => import('./pages/TaskList'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const TaskFormPage = lazy(() => import('./pages/TaskFormPage'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    Loading...
  </div>
);

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppContainer theme={theme}>
      <Sidebar />
      <MainContent>
        <Header />
        <PageContent>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Main routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList />} />

              {/* Task management routes */}
              <Route path="/tasks/new" element={<TaskFormPage />} />
              <Route path="/tasks/:taskId/edit" element={<TaskFormPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />

              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </PageContent>
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PageContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export default App;