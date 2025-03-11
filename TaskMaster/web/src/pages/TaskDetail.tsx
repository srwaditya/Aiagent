import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../../../shared/constants/colors';
import { TaskStatus, TaskPriority } from '../../../shared/types/task';
import { formatDateTime, isOverdue } from '../../../shared/utils/dateUtils';

// Import icons
import { 
  FiEdit, 
  FiTrash2, 
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiFlag,
  FiFolder,
  FiTag,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

// Import from Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSelectedTask, updateTaskStatus, deleteTask } from '../store/slices/tasksSlice';

const TaskDetail: React.FC = () => {
  const { theme } = useTheme();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const task = useSelector((state: RootState) => 
    state.tasks.tasks.find(t => t.id === taskId)
  );
  
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tags = useSelector((state: RootState) => state.tags.tags);
  
  const category = task?.categoryId 
    ? categories.find(cat => cat.id === task.categoryId) 
    : undefined;
    
  const taskTags = task?.tags 
    ? tags.filter(tag => task.tags.includes(tag.id)) 
    : [];
  
  // Set selected task on component mount
  useEffect(() => {
    if (taskId) {
      dispatch(setSelectedTask(taskId));
    }
    
    // Clear selected task on component unmount
    return () => {
      dispatch(setSelectedTask(null));
    };
  }, [dispatch, taskId]);
  
  // Handle task not found
  if (!task) {
    return (
      <TaskNotFound theme={theme}>
        <TaskNotFoundTitle>Task Not Found</TaskNotFoundTitle>
        <TaskNotFoundText>
          The task you are looking for doesn't exist or has been deleted.
        </TaskNotFoundText>
        <BackButton onClick={() => navigate('/tasks')}>
          <FiArrowLeft />
          <span>Back to Tasks</span>
        </BackButton>
      </TaskNotFound>
    );
  }
  
  // Get priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return COLORS.priorityHigh;
      case TaskPriority.MEDIUM:
        return COLORS.priorityMedium;
      case TaskPriority.LOW:
        return COLORS.priorityLow;
      default:
        return COLORS.priorityMedium;
    }
  };
  
  // Get priority label
  const getPriorityLabel = () => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.LOW:
        return 'Low';
      default:
        return 'Medium';
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (task.status) {
      case TaskStatus.TODO:
        return COLORS.info;
      case TaskStatus.IN_PROGRESS:
        return COLORS.warning;
      case TaskStatus.COMPLETED:
        return COLORS.success;
      case TaskStatus.ARCHIVED:
        return COLORS.gray600;
      default:
        return COLORS.info;
    }
  };
  
  // Get status label
  const getStatusLabel = () => {
    switch (task.status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.ARCHIVED:
        return 'Archived';
      default:
        return 'To Do';
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
      navigate('/tasks');
    }
  };
  
  // Handle task status toggle
  const handleToggleStatus = () => {
    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.TODO 
      : TaskStatus.COMPLETED;
    
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };
  
  return (
    <TaskDetailContainer>
      <TaskDetailHeader>
        <BackButton onClick={() => navigate('/tasks')}>
          <FiArrowLeft />
          <span>Back to Tasks</span>
        </BackButton>
        
        <TaskActions>
          <EditButton onClick={() => navigate(`/tasks/${task.id}/edit`)}>
            <FiEdit />
            <span>Edit</span>
          </EditButton>
          
          <DeleteButton onClick={handleDeleteTask}>
            <FiTrash2 />
            <span>Delete</span>
          </DeleteButton>
        </TaskActions>
      </TaskDetailHeader>
      
      <TaskDetailContent theme={theme}>
        <TaskHeader>
          <TaskTitle>{task.title}</TaskTitle>
          
          <TaskStatusToggle 
            onClick={handleToggleStatus}
            $completed={task.status === TaskStatus.COMPLETED}
          >
            {task.status === TaskStatus.COMPLETED ? (
              <>
                <FiXCircle />
                <span>Mark as Incomplete</span>
              </>
            ) : (
              <>
                <FiCheckCircle />
                <span>Mark as Complete</span>
              </>
            )}
          </TaskStatusToggle>
        </TaskHeader>
        
        <TaskMetaContainer>
          <TaskMetaItem $color={getStatusColor()}>
            <TaskMetaIcon as={FiCheckCircle} $color={getStatusColor()} />
            <TaskMetaText>Status: {getStatusLabel()}</TaskMetaText>
          </TaskMetaItem>
          
          <TaskMetaItem $color={getPriorityColor()}>
            <TaskMetaIcon as={FiFlag} $color={getPriorityColor()} />
            <TaskMetaText>Priority: {getPriorityLabel()}</TaskMetaText>
          </TaskMetaItem>
          
          {task.dueDate && (
            <TaskMetaItem $color={isOverdue(task.dueDate) && task.status !== TaskStatus.COMPLETED ? COLORS.error : COLORS.info}>
              <TaskMetaIcon as={FiCalendar} $color={isOverdue(task.dueDate) && task.status !== TaskStatus.COMPLETED ? COLORS.error : COLORS.info} />
              <TaskMetaText>
                Due: {formatDateTime(task.dueDate)}
                {isOverdue(task.dueDate) && task.status !== TaskStatus.COMPLETED && (
                  <OverdueLabel>Overdue</OverdueLabel>
                )}
              </TaskMetaText>
            </TaskMetaItem>
          )}
          
          {category && (
            <TaskMetaItem $color={category.color}>
              <TaskMetaIcon as={FiFolder} $color={category.color} />
              <TaskMetaText>Category: {category.name}</TaskMetaText>
            </TaskMetaItem>
          )}
        </TaskMetaContainer>
        
        {task.description && (
          <TaskSection>
            <TaskSectionTitle>Description</TaskSectionTitle>
            <TaskDescription>{task.description}</TaskDescription>
          </TaskSection>
        )}
        
        {taskTags.length > 0 && (
          <TaskSection>
            <TaskSectionTitle>Tags</TaskSectionTitle>
            <TaskTagsContainer>
              {taskTags.map(tag => (
                <TaskTag key={tag.id} $color={tag.color}>
                  <FiTag size={12} />
                  <span>{tag.name}</span>
                </TaskTag>
              ))}
            </TaskTagsContainer>
          </TaskSection>
        )}
        
        <TaskSection>
          <TaskSectionTitle>Task Details</TaskSectionTitle>
          <TaskDetailsGrid>
            <TaskDetailItem>
              <TaskDetailLabel>Created</TaskDetailLabel>
              <TaskDetailValue>{formatDateTime(task.createdAt)}</TaskDetailValue>
            </TaskDetailItem>
            
            <TaskDetailItem>
              <TaskDetailLabel>Last Updated</TaskDetailLabel>
              <TaskDetailValue>{formatDateTime(task.updatedAt)}</TaskDetailValue>
            </TaskDetailItem>
            
            {task.completedAt && (
              <TaskDetailItem>
                <TaskDetailLabel>Completed</TaskDetailLabel>
                <TaskDetailValue>{formatDateTime(task.completedAt)}</TaskDetailValue>
              </TaskDetailItem>
            )}
          </TaskDetailsGrid>
        </TaskSection>
      </TaskDetailContent>
    </TaskDetailContainer>
  );
};

const TaskDetailContainer = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

const TaskDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: transparent;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.divider};
  }
`;

const TaskActions = styled.div`
  display: flex;
  gap: 12px;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${COLORS.primary}20;
  color: ${COLORS.primary};
  border: 1px solid ${COLORS.primary};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${COLORS.primary}30;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${COLORS.error}10;
  color: ${COLORS.error};
  border: 1px solid ${COLORS.error};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${COLORS.error}20;
  }
`;

const TaskDetailContent = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  padding: 24px;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const TaskTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  word-break: break-word;
`;

interface TaskStatusToggleProps {
  $completed: boolean;
}

const TaskStatusToggle = styled.button<TaskStatusToggleProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${props => props.$completed ? `${COLORS.error}20` : `${COLORS.success}20`};
  color: ${props => props.$completed ? COLORS.error : COLORS.success};
  border: 1px solid ${props => props.$completed ? COLORS.error : COLORS.success};
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.$completed ? `${COLORS.error}30` : `${COLORS.success}30`};
  }
`;

const TaskMetaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

interface TaskMetaItemProps {
  $color: string;
}

const TaskMetaItem = styled.div<TaskMetaItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${props => `${props.$color}10`};
  color: ${props => props.$color};
  font-size: 0.9rem;
  font-weight: 500;
`;

interface TaskMetaIconProps {
  $color: string;
}

const TaskMetaIcon = styled.svg<TaskMetaIconProps>`
  color: ${props => props.$color};
  font-size: 1rem;
`;

const TaskMetaText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OverdueLabel = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${COLORS.error};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
`;

const TaskSection = styled.section`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TaskSectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: ${props => props.theme.textSecondary};
`;

const TaskDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const TaskTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface TaskTagProps {
  $color: string;
}

const TaskTag = styled.span<TaskTagProps>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${props => `${props.$color}20`};
  color: ${props => props.$color};
  font-size: 0.85rem;
  font-weight: 500;
`;

const TaskDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const TaskDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TaskDetailLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const TaskDetailValue = styled.span`
  font-size: 0.9rem;
`;

const TaskNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  max-width: 500px;
  margin: 48px auto;
`;

const TaskNotFoundTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const TaskNotFoundText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 24px 0;
`;

export default TaskDetail;