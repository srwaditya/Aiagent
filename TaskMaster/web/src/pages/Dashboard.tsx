import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../shared/constants/colors';
import { Task, TaskStatus, TaskPriority } from '../shared/types/task';
import { isOverdue } from '../shared/utils/dateUtils';

// Import components
import TaskItem from '../components/tasks/TaskItem';

// Import icons
import { 
  FiPlus, 
  FiClock, 
  FiFlag, 
  FiCheckCircle,
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';

// Import from Redux
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  // Filter tasks for different sections
  const overdueTasks = tasks.filter(task => 
    task.status !== TaskStatus.COMPLETED && 
    task.dueDate && 
    isOverdue(task.dueDate)
  );
  
  const todayTasks = tasks.filter(task => {
    if (task.status === TaskStatus.COMPLETED) return false;
    if (!task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });
  
  const highPriorityTasks = tasks.filter(task => 
    task.status !== TaskStatus.COMPLETED && 
    task.priority === TaskPriority.HIGH
  );
  
  const recentlyCompletedTasks = tasks
    .filter(task => task.status === TaskStatus.COMPLETED)
    .sort((a, b) => {
      const dateA = a.completedAt || a.updatedAt;
      const dateB = b.completedAt || b.updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <AddTaskButton onClick={() => navigate('/tasks/new')}>
          <FiPlus />
          <span>Add Task</span>
        </AddTaskButton>
      </DashboardHeader>
      
      <StatisticsContainer theme={theme}>
        <StatCard theme={theme}>
          <StatIcon $color={COLORS.primary}>
            <FiCheckCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{completionRate}%</StatValue>
            <StatLabel>Completion Rate</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard theme={theme}>
          <StatIcon $color={COLORS.info}>
            <FiBarChart2 />
          </StatIcon>
          <StatContent>
            <StatValue>{tasks.length}</StatValue>
            <StatLabel>Total Tasks</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard theme={theme}>
          <StatIcon $color={COLORS.error}>
            <FiClock />
          </StatIcon>
          <StatContent>
            <StatValue>{overdueTasks.length}</StatValue>
            <StatLabel>Overdue Tasks</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard theme={theme}>
          <StatIcon $color={COLORS.warning}>
            <FiFlag />
          </StatIcon>
          <StatContent>
            <StatValue>{highPriorityTasks.length}</StatValue>
            <StatLabel>High Priority</StatLabel>
          </StatContent>
        </StatCard>
      </StatisticsContainer>
      
      <DashboardGrid>
        <DashboardSection>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color={COLORS.error}>
                <FiClock />
              </SectionIcon>
              <span>Overdue Tasks</span>
            </SectionTitle>
            {overdueTasks.length > 0 && (
              <ViewAllButton onClick={() => navigate('/tasks?filter=overdue')}>
                View All
              </ViewAllButton>
            )}
          </SectionHeader>
          
          <TaskList>
            {overdueTasks.length > 0 ? (
              overdueTasks.slice(0, 3).map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <EmptyState theme={theme}>
                <EmptyStateText>No overdue tasks</EmptyStateText>
              </EmptyState>
            )}
          </TaskList>
        </DashboardSection>
        
        <DashboardSection>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color={COLORS.primary}>
                <FiCalendar />
              </SectionIcon>
              <span>Today's Tasks</span>
            </SectionTitle>
            {todayTasks.length > 0 && (
              <ViewAllButton onClick={() => navigate('/tasks?filter=today')}>
                View All
              </ViewAllButton>
            )}
          </SectionHeader>
          
          <TaskList>
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 3).map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <EmptyState theme={theme}>
                <EmptyStateText>No tasks due today</EmptyStateText>
              </EmptyState>
            )}
          </TaskList>
        </DashboardSection>
        
        <DashboardSection>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color={COLORS.warning}>
                <FiFlag />
              </SectionIcon>
              <span>High Priority</span>
            </SectionTitle>
            {highPriorityTasks.length > 0 && (
              <ViewAllButton onClick={() => navigate('/tasks?filter=high-priority')}>
                View All
              </ViewAllButton>
            )}
          </SectionHeader>
          
          <TaskList>
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.slice(0, 3).map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <EmptyState theme={theme}>
                <EmptyStateText>No high priority tasks</EmptyStateText>
              </EmptyState>
            )}
          </TaskList>
        </DashboardSection>
        
        <DashboardSection>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color={COLORS.success}>
                <FiCheckCircle />
              </SectionIcon>
              <span>Recently Completed</span>
            </SectionTitle>
            {recentlyCompletedTasks.length > 0 && (
              <ViewAllButton onClick={() => navigate('/tasks?filter=completed')}>
                View All
              </ViewAllButton>
            )}
          </SectionHeader>
          
          <TaskList>
            {recentlyCompletedTasks.length > 0 ? (
              recentlyCompletedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <EmptyState theme={theme}>
                <EmptyStateText>No completed tasks yet</EmptyStateText>
              </EmptyState>
            )}
          </TaskList>
        </DashboardSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 16px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DashboardTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${COLORS.primaryDark};
  }
`;

const StatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
`;

const StatIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  font-size: 1.5rem;
  margin-right: 16px;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const DashboardSection = styled.section`
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const SectionIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  font-size: 1rem;
  margin-right: 8px;
`;

const ViewAllButton = styled.button`
  font-size: 0.85rem;
  color: ${COLORS.primary};
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
`;

const EmptyStateText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

export default Dashboard;