import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../shared/constants/colors';
import { Task, TaskStatus, TaskPriority, TaskFilter } from '../shared/types/task';
import { filterTasks, sortTasks } from '../shared/utils/taskUtils';

// Import components
import TaskItem from '../components/tasks/TaskItem';

// Import icons
import { 
  FiPlus, 
  FiFilter, 
  FiSearch,
  FiX,
  FiCheck,
  FiClock,
  FiFlag,
  FiFolder,
  FiTag,
  FiChevronDown
} from 'react-icons/fi';

// Import from Redux
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const TaskList: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tags = useSelector((state: RootState) => state.tags.tags);
  
  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialFilterParam = queryParams.get('filter');
  
  // State for search and filters
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>({
    status: initialFilterParam === 'completed' 
      ? [TaskStatus.COMPLETED] 
      : [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
    priority: [],
    tags: [],
    searchText: '',
  });
  
  // State for sorting
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Set initial filter based on URL parameter
  useEffect(() => {
    if (initialFilterParam) {
      switch (initialFilterParam) {
        case 'overdue':
          setFilter({
            ...filter,
            status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
            dueDateTo: new Date(),
          });
          break;
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          setFilter({
            ...filter,
            status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
            dueDateFrom: today,
            dueDateTo: tomorrow,
          });
          break;
        case 'high-priority':
          setFilter({
            ...filter,
            status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
            priority: [TaskPriority.HIGH],
          });
          break;
        case 'completed':
          setFilter({
            ...filter,
            status: [TaskStatus.COMPLETED],
          });
          break;
      }
    }
  }, [initialFilterParam]);
  
  // Apply search text to filter
  useEffect(() => {
    setFilter(prevFilter => ({
      ...prevFilter,
      searchText,
    }));
  }, [searchText]);
  
  // Filter and sort tasks
  const filteredTasks = sortTasks(
    filterTasks(tasks, filter),
    sortBy,
    sortDirection
  );
  
  // Toggle status filter
  const toggleStatusFilter = (status: TaskStatus) => {
    setFilter(prevFilter => {
      const currentStatuses = prevFilter.status || [];
      
      if (currentStatuses.includes(status)) {
        return {
          ...prevFilter,
          status: currentStatuses.filter(s => s !== status),
        };
      } else {
        return {
          ...prevFilter,
          status: [...currentStatuses, status],
        };
      }
    });
  };
  
  // Toggle priority filter
  const togglePriorityFilter = (priority: TaskPriority) => {
    setFilter(prevFilter => {
      const currentPriorities = prevFilter.priority || [];
      
      if (currentPriorities.includes(priority)) {
        return {
          ...prevFilter,
          priority: currentPriorities.filter(p => p !== priority),
        };
      } else {
        return {
          ...prevFilter,
          priority: [...currentPriorities, priority],
        };
      }
    });
  };
  
  // Toggle tag filter
  const toggleTagFilter = (tagId: string) => {
    setFilter(prevFilter => {
      const currentTags = prevFilter.tags || [];
      
      if (currentTags.includes(tagId)) {
        return {
          ...prevFilter,
          tags: currentTags.filter(t => t !== tagId),
        };
      } else {
        return {
          ...prevFilter,
          tags: [...currentTags, tagId],
        };
      }
    });
  };
  
  // Set category filter
  const setCategoryFilter = (categoryId: string | undefined) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      categoryId,
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilter({
      status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
      priority: [],
      tags: [],
      searchText,
      categoryId: undefined,
      dueDateFrom: undefined,
      dueDateTo: undefined,
    });
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prevDirection => 
      prevDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  return (
    <TaskListContainer>
      <TaskListHeader>
        <TaskListTitle>Tasks</TaskListTitle>
        <AddTaskButton onClick={() => navigate('/tasks/new')}>
          <FiPlus />
          <span>Add Task</span>
        </AddTaskButton>
      </TaskListHeader>
      
      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            placeholder="Search tasks..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            theme={theme}
          />
          {searchText && (
            <ClearSearchButton onClick={() => setSearchText('')}>
              <FiX />
            </ClearSearchButton>
          )}
        </SearchContainer>
        
        <FilterButton 
          onClick={() => setShowFilters(!showFilters)}
          $isActive={showFilters}
          theme={theme}
        >
          <FiFilter />
          <span>Filter</span>
        </FilterButton>
        
        <SortButton onClick={toggleSortDirection} theme={theme}>
          <span>Sort: {sortBy}</span>
          <FiChevronDown style={{ 
            transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
        </SortButton>
      </SearchFilterContainer>
      
      {showFilters && (
        <FiltersContainer theme={theme}>
          <FilterSection>
            <FilterSectionTitle>Status</FilterSectionTitle>
            <FilterOptions>
              <FilterOption 
                $isSelected={filter.status?.includes(TaskStatus.TODO)}
                onClick={() => toggleStatusFilter(TaskStatus.TODO)}
                theme={theme}
              >
                To Do
              </FilterOption>
              <FilterOption 
                $isSelected={filter.status?.includes(TaskStatus.IN_PROGRESS)}
                onClick={() => toggleStatusFilter(TaskStatus.IN_PROGRESS)}
                theme={theme}
              >
                In Progress
              </FilterOption>
              <FilterOption 
                $isSelected={filter.status?.includes(TaskStatus.COMPLETED)}
                onClick={() => toggleStatusFilter(TaskStatus.COMPLETED)}
                theme={theme}
              >
                Completed
              </FilterOption>
              <FilterOption 
                $isSelected={filter.status?.includes(TaskStatus.ARCHIVED)}
                onClick={() => toggleStatusFilter(TaskStatus.ARCHIVED)}
                theme={theme}
              >
                Archived
              </FilterOption>
            </FilterOptions>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionTitle>Priority</FilterSectionTitle>
            <FilterOptions>
              <FilterOption 
                $isSelected={filter.priority?.includes(TaskPriority.HIGH)}
                onClick={() => togglePriorityFilter(TaskPriority.HIGH)}
                $color={COLORS.priorityHigh}
                theme={theme}
              >
                <FiFlag />
                <span>High</span>
              </FilterOption>
              <FilterOption 
                $isSelected={filter.priority?.includes(TaskPriority.MEDIUM)}
                onClick={() => togglePriorityFilter(TaskPriority.MEDIUM)}
                $color={COLORS.priorityMedium}
                theme={theme}
              >
                <FiFlag />
                <span>Medium</span>
              </FilterOption>
              <FilterOption 
                $isSelected={filter.priority?.includes(TaskPriority.LOW)}
                onClick={() => togglePriorityFilter(TaskPriority.LOW)}
                $color={COLORS.priorityLow}
                theme={theme}
              >
                <FiFlag />
                <span>Low</span>
              </FilterOption>
            </FilterOptions>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionTitle>Categories</FilterSectionTitle>
            <FilterOptions>
              <FilterOption 
                $isSelected={filter.categoryId === undefined}
                onClick={() => setCategoryFilter(undefined)}
                theme={theme}
              >
                All Categories
              </FilterOption>
              {categories.map(category => (
                <FilterOption 
                  key={category.id}
                  $isSelected={filter.categoryId === category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  $color={category.color}
                  theme={theme}
                >
                  <FiFolder />
                  <span>{category.name}</span>
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
          
          <FilterSection>
            <FilterSectionTitle>Tags</FilterSectionTitle>
            <FilterOptions>
              {tags.map(tag => (
                <FilterOption 
                  key={tag.id}
                  $isSelected={filter.tags?.includes(tag.id)}
                  onClick={() => toggleTagFilter(tag.id)}
                  $color={tag.color}
                  theme={theme}
                >
                  <FiTag />
                  <span>{tag.name}</span>
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
          
          <FilterActions>
            <ResetFiltersButton onClick={resetFilters} theme={theme}>
              Reset Filters
            </ResetFiltersButton>
            <ApplyFiltersButton onClick={() => setShowFilters(false)}>
              <FiCheck />
              <span>Apply Filters</span>
            </ApplyFiltersButton>
          </FilterActions>
        </FiltersContainer>
      )}
      
      <ActiveFiltersContainer>
        {filter.status && filter.status.length > 0 && filter.status.length < 4 && (
          <ActiveFilter theme={theme}>
            Status: {filter.status.map(s => {
              switch (s) {
                case TaskStatus.TODO: return 'To Do';
                case TaskStatus.IN_PROGRESS: return 'In Progress';
                case TaskStatus.COMPLETED: return 'Completed';
                case TaskStatus.ARCHIVED: return 'Archived';
                default: return s;
              }
            }).join(', ')}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, status: [] }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {filter.priority && filter.priority.length > 0 && (
          <ActiveFilter theme={theme}>
            Priority: {filter.priority.map(p => {
              switch (p) {
                case TaskPriority.HIGH: return 'High';
                case TaskPriority.MEDIUM: return 'Medium';
                case TaskPriority.LOW: return 'Low';
                default: return p;
              }
            }).join(', ')}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, priority: [] }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {filter.categoryId && (
          <ActiveFilter theme={theme}>
            Category: {categories.find(c => c.id === filter.categoryId)?.name}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, categoryId: undefined }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {filter.tags && filter.tags.length > 0 && (
          <ActiveFilter theme={theme}>
            Tags: {filter.tags.map(tagId => 
              tags.find(t => t.id === tagId)?.name
            ).join(', ')}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, tags: [] }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {filter.dueDateFrom && (
          <ActiveFilter theme={theme}>
            From: {new Date(filter.dueDateFrom).toLocaleDateString()}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, dueDateFrom: undefined }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
        
        {filter.dueDateTo && (
          <ActiveFilter theme={theme}>
            To: {new Date(filter.dueDateTo).toLocaleDateString()}
            <RemoveFilterButton onClick={() => setFilter(prev => ({ ...prev, dueDateTo: undefined }))}>
              <FiX size={12} />
            </RemoveFilterButton>
          </ActiveFilter>
        )}
      </ActiveFiltersContainer>
      
      <TaskListContent>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <EmptyState theme={theme}>
            <EmptyStateText>
              {searchText ? 'No tasks match your search' : 'No tasks found'}
            </EmptyStateText>
            <AddTaskButton onClick={() => navigate('/tasks/new')}>
              <FiPlus />
              <span>Add Task</span>
            </AddTaskButton>
          </EmptyState>
        )}
      </TaskListContent>
    </TaskListContainer>
  );
};

const TaskListContainer = styled.div`
  padding: 16px;
`;

const TaskListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TaskListTitle = styled.h1`
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

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
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

const ClearSearchButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

interface FilterButtonProps {
  $isActive: boolean;
  theme: any;
}

const FilterButton = styled.button<FilterButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${props => props.$isActive ? `${COLORS.primary}20` : props.theme.background};
  color: ${props => props.$isActive ? COLORS.primary : props.theme.text};
  border: 1px solid ${props => props.$isActive ? COLORS.primary : props.theme.border};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isActive ? `${COLORS.primary}30` : props.theme.divider};
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.divider};
  }
`;

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface FilterOptionProps {
  $isSelected: boolean;
  $color?: string;
  theme: any;
}

const FilterOption = styled.button<FilterOptionProps>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${props => props.$isSelected 
    ? props.$color 
      ? `${props.$color}20` 
      : `${COLORS.primary}20`
    : props.theme.background
  };
  color: ${props => props.$isSelected 
    ? props.$color || COLORS.primary
    : props.theme.text
  };
  border: 1px solid ${props => props.$isSelected 
    ? props.$color || COLORS.primary
    : props.theme.border
  };
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isSelected 
      ? props.$color 
        ? `${props.$color}30` 
        : `${COLORS.primary}30`
      : props.theme.divider
    };
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ResetFiltersButton = styled.button`
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

const ApplyFiltersButton = styled.button`
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

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
`;

const RemoveFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const TaskListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px;
  border-radius: 8px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

export default TaskList;