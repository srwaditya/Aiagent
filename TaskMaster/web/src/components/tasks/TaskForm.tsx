import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../../../shared/constants/colors';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/types/task';

// Import icons
import { 
  FiCalendar, 
  FiFlag, 
  FiTag, 
  FiFolder,
  FiX,
  FiCheck,
  FiTrash2
} from 'react-icons/fi';

// Import from Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addTask, updateTask } from '../../store/slices/tasksSlice';

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, isEditing = false }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tags = useSelector((state: RootState) => state.tags.tags);
  const userId = useSelector((state: RootState) => state.user.currentUser?.id || 'guest');
  
  // Form state
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(task?.categoryId);
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);
  
  // UI state
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create task object
    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      categoryId,
      tags: selectedTags,
      userId,
    };
    
    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }
    
    if (isEditing && task) {
      // Update existing task
      dispatch(updateTask({ id: task.id, updates: taskData }));
      navigate(`/tasks/${task.id}`);
    } else {
      // Add new task
      dispatch(addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>));
      navigate('/tasks');
    }
  };
  
  // Handle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  return (
    <FormContainer onSubmit={handleSubmit} theme={theme}>
      <FormHeader>
        <FormTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</FormTitle>
        
        <FormActions>
          <CancelButton 
            type="button" 
            onClick={() => navigate(isEditing && task ? `/tasks/${task.id}` : '/tasks')}
            theme={theme}
          >
            <FiX />
            <span>Cancel</span>
          </CancelButton>
          
          <SubmitButton type="submit">
            <FiCheck />
            <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
          </SubmitButton>
        </FormActions>
      </FormHeader>
      
      <FormGroup>
        <FormLabel htmlFor="title">Title</FormLabel>
        <FormInput
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          $hasError={!!errors.title}
          theme={theme}
        />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          rows={4}
          theme={theme}
        />
      </FormGroup>
      
      <FormRow>
        <FormGroup style={{ flex: 1 }}>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            theme={theme}
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
            <option value={TaskStatus.ARCHIVED}>Archived</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup style={{ flex: 1 }}>
          <FormLabel htmlFor="priority">
            <FiFlag style={{ marginRight: '4px' }} />
            Priority
          </FormLabel>
          <FormSelect
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            theme={theme}
          >
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </FormSelect>
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup style={{ flex: 1 }}>
          <FormLabel htmlFor="dueDate">
            <FiCalendar style={{ marginRight: '4px' }} />
            Due Date
          </FormLabel>
          <FormInput
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            theme={theme}
          />
        </FormGroup>
        
        <FormGroup style={{ flex: 1 }}>
          <FormLabel htmlFor="category">
            <FiFolder style={{ marginRight: '4px' }} />
            Category
          </FormLabel>
          <FormSelect
            id="category"
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
            theme={theme}
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <FormLabel>
          <FiTag style={{ marginRight: '4px' }} />
          Tags
        </FormLabel>
        
        <TagsContainer>
          {selectedTags.length > 0 ? (
            <>
              {selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <TagBadge key={tag.id} color={tag.color}>
                    {tag.name}
                    <TagRemoveButton onClick={() => toggleTag(tag.id)}>
                      <FiX size={12} />
                    </TagRemoveButton>
                  </TagBadge>
                );
              })}
            </>
          ) : (
            <NoTagsText>No tags selected</NoTagsText>
          )}
          
          <AddTagButton 
            type="button" 
            onClick={() => setShowTagSelector(!showTagSelector)}
            theme={theme}
          >
            {showTagSelector ? 'Done' : '+ Add Tags'}
          </AddTagButton>
        </TagsContainer>
        
        {showTagSelector && (
          <TagSelectorContainer theme={theme}>
            {tags.map(tag => (
              <TagOption
                key={tag.id}
                $selected={selectedTags.includes(tag.id)}
                color={tag.color}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </TagOption>
            ))}
          </TagSelectorContainer>
        )}
      </FormGroup>
      
      {isEditing && task && (
        <DeleteButtonContainer>
          <DeleteButton 
            type="button" 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                dispatch({ type: 'tasks/deleteTask', payload: task.id });
                navigate('/tasks');
              }
            }}
          >
            <FiTrash2 />
            <span>Delete Task</span>
          </DeleteButton>
        </DeleteButtonContainer>
      )}
    </FormContainer>
  );
};

const FormContainer = styled.form`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.border};
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
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

const SubmitButton = styled.button`
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

interface FormInputProps {
  $hasError?: boolean;
  theme: any;
}

const FormInput = styled.input<FormInputProps>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.$hasError ? COLORS.error : props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? COLORS.error : COLORS.primary};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? `${COLORS.error}40` : `${COLORS.primary}40`};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}40;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}40;
  }
`;

const ErrorText = styled.p`
  color: ${COLORS.error};
  font-size: 0.8rem;
  margin-top: 4px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const NoTagsText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const TagBadge = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const TagRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const AddTagButton = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: transparent;
  color: ${COLORS.primary};
  border: 1px dashed ${COLORS.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${COLORS.primary}10;
  }
`;

const TagSelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
`;

interface TagOptionProps {
  $selected: boolean;
  color: string;
}

const TagOption = styled.button<TagOptionProps>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => props.$selected ? `${props.color}20` : 'transparent'};
  color: ${props => props.color};
  border: 1px solid ${props => props.color};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => `${props.color}20`};
  }
`;

const DeleteButtonContainer = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: center;
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
    background-color: ${COLORS.error};
    color: white;
  }
`;

export default TaskForm;