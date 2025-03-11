import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import TaskForm from '../components/tasks/TaskForm';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const TaskFormPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const isEditing = taskId !== 'new';
  
  const task = useSelector((state: RootState) => 
    isEditing ? state.tasks.tasks.find(t => t.id === taskId) : undefined
  );
  
  return (
    <TaskFormPageContainer>
      <TaskForm task={task} isEditing={isEditing} />
    </TaskFormPageContainer>
  );
};

const TaskFormPageContainer = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

export default TaskFormPage;