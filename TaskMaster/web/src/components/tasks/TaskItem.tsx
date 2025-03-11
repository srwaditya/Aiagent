import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../../../shared/constants/colors';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/types/task';
import { getRelativeDateString, isOverdue } from '../../../../shared/utils/dateUtils';

// Import icons
import { 
  FiCheckCircle, 
  FiCircle, 
  FiClock, 
  FiFlag,
  FiMoreVertical,
  FiTrash2,
  FiEdit
} from 'react-icons/fi';

// Import from Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateTaskStatus, deleteTask } from '../../store/slices/tasksSlice';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tags = useSelector((state: RootState) => state.tags.tags);
  
  const category = categories.find(cat => cat.id === task.categoryId);
  const taskTags = tags.filter(tag => task.tags.includes(tag.id));
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.TODO 
      : TaskStatus.COMPLETED;
    
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };
  
  const handleTaskClick = () => {
    navigate(`/tasks/${task.id}`);
  };
  
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    navigate(`/tasks/${task.id}/edit`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };
  
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
  
  return (
    <TaskItemContainer 
      onClick={handleTaskClick}
      theme={theme}
      $completed={task.status === TaskStatus.COMPLETED}
    >
      <StatusButton onClick={handleStatusToggle}>
        {task.status === TaskStatus.COMPLETED ? (
          <CheckedIcon />
        ) : (
          <UncheckedIcon />
        )}
      </StatusButton>
      
      <TaskContent $completed={task.status === TaskStatus.COMPLETED}>
        <TaskTitle>{task.title}</TaskTitle>
        
        {task.description && (
          <TaskDescription>{task.description}</TaskDescription>
        )}
        
        <TaskMeta>
          {category && (
            <CategoryBadge color={category.color}>
              {category.name}
            </CategoryBadge>
          )}
          
          {task.dueDate && (
            <DueDateBadge $overdue={isOverdue(task.dueDate)}>
              <FiClock size={12} />
              <span>{getRelativeDateString(task.dueDate)}</span>
            </DueDateBadge>
          )}
          
          <PriorityBadge color={getPriorityColor()}>
            <FiFlag size={12} />
            <span>{getPriorityLabel()}</span>
          </PriorityBadge>
          
          {taskTags.length > 0 && (
            <TagsContainer>
              {taskTags.slice(0, 2).map(tag => (
                <TagBadge key={tag.id} color={tag.color}>
                  {tag.name}
                </TagBadge>
              ))}
              {taskTags.length > 2 && (
                <TagBadge color={COLORS.gray500}>
                  +{taskTags.length - 2}
                </TagBadge>
              )}
            </TagsContainer>
          )}
        </TaskMeta>
      </TaskContent>
      
      <MenuContainer>
        <MenuButton onClick={handleMenuToggle}>
          <FiMoreVertical />
        </MenuButton>
        
        {menuOpen && (
          <MenuDropdown theme={theme}>
            <MenuItem onClick={handleEdit}>
              <FiEdit size={14} />
              <span>Edit</span>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <FiTrash2 size={14} />
              <span>Delete</span>
            </MenuItem>
          </MenuDropdown>
        )}
      </MenuContainer>
    </TaskItemContainer>
  );
};

interface TaskItemContainerProps {
  theme: any;
  $completed: boolean;
}

const TaskItemContainer = styled.div<TaskItemContainerProps>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$completed ? 0.7 : 1};
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatusButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckedIcon = styled(FiCheckCircle)`
  font-size: 1.4rem;
  color: ${COLORS.success};
`;

const UncheckedIcon = styled(FiCircle)`
  font-size: 1.4rem;
  color: ${props => props.theme.textSecondary};
`;

interface TaskContentProps {
  $completed: boolean;
}

const TaskContent = styled.div<TaskContentProps>`
  flex: 1;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

const TaskTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
`;

const TaskDescription = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const DueDateBadge = styled.span<{ $overdue: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.$overdue ? `${COLORS.error}20` : `${COLORS.info}20`};
  color: ${props => props.$overdue ? COLORS.error : COLORS.info};
`;

const PriorityBadge = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const TagBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 150px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.text};
  
  &:hover {
    background-color: ${props => props.theme.divider};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

export default TaskItem;