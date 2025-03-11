import { Task, TaskPriority, TaskStatus, TaskFilter } from '../types/task';

/**
 * Generate a unique ID for a task
 */
export const generateTaskId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Create a new task with default values
 */
export const createNewTask = (userId: string, title: string): Task => {
  const now = new Date();
  
  return {
    id: generateTaskId(),
    title,
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: now,
    updatedAt: now,
    tags: [],
    userId
  };
};

/**
 * Filter tasks based on filter criteria
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter(task => {
    // Filter by status
    if (filter.status && filter.status.length > 0 && !filter.status.includes(task.status)) {
      return false;
    }
    
    // Filter by priority
    if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(task.priority)) {
      return false;
    }
    
    // Filter by category
    if (filter.categoryId && task.categoryId !== filter.categoryId) {
      return false;
    }
    
    // Filter by tags (any match)
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = task.tags.some(tagId => filter.tags?.includes(tagId));
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    // Filter by search text
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descMatch = task.description?.toLowerCase().includes(searchLower) || false;
      
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    
    // Filter by due date range
    if (filter.dueDateFrom && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const fromDate = new Date(filter.dueDateFrom);
      
      if (dueDate < fromDate) {
        return false;
      }
    }
    
    if (filter.dueDateTo && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const toDate = new Date(filter.dueDateTo);
      
      if (dueDate > toDate) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Sort tasks by different criteria
 */
export const sortTasks = (
  tasks: Task[], 
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title' = 'dueDate',
  sortDirection: 'asc' | 'desc' = 'asc'
): Task[] => {
  const sortedTasks = [...tasks];
  
  sortedTasks.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate':
        // Handle tasks without due dates
        if (!a.dueDate && !b.dueDate) {
          comparison = 0;
        } else if (!a.dueDate) {
          comparison = 1; // a comes after b
        } else if (!b.dueDate) {
          comparison = -1; // a comes before b
        } else {
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        break;
        
      case 'priority':
        const priorityValues = {
          [TaskPriority.HIGH]: 3,
          [TaskPriority.MEDIUM]: 2,
          [TaskPriority.LOW]: 1
        };
        comparison = priorityValues[b.priority] - priorityValues[a.priority];
        break;
        
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
        
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return sortedTasks;
};