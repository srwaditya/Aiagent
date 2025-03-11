import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, TaskPriority } from '../../shared/types/task';
import { generateTaskId } from '../../shared/utils/taskUtils';
import { mockTasks } from '../mockData';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

const initialState: TasksState = {
  tasks: mockTasks,
  loading: false,
  error: null,
  selectedTaskId: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set selected task
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    
    // Add a new task
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: generateTaskId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      state.tasks.push(newTask);
    },
    
    // Update an existing task
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        };
      }
    },
    
    // Delete a task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      
      // Clear selected task if it was deleted
      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
    },
    
    // Update task status
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const { id, status } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = status;
        state.tasks[taskIndex].updatedAt = new Date();
        
        // If marking as completed, set completedAt
        if (status === TaskStatus.COMPLETED) {
          state.tasks[taskIndex].completedAt = new Date();
        } else {
          state.tasks[taskIndex].completedAt = undefined;
        }
      }
    },
    
    // Update task priority
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: TaskPriority }>) => {
      const { id, priority } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].priority = priority;
        state.tasks[taskIndex].updatedAt = new Date();
      }
    },
    
    // Add tag to task
    addTagToTask: (state, action: PayloadAction<{ taskId: string; tagId: string }>) => {
      const { taskId, tagId } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1 && !state.tasks[taskIndex].tags.includes(tagId)) {
        state.tasks[taskIndex].tags.push(tagId);
        state.tasks[taskIndex].updatedAt = new Date();
      }
    },
    
    // Remove tag from task
    removeTagFromTask: (state, action: PayloadAction<{ taskId: string; tagId: string }>) => {
      const { taskId, tagId } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].tags = state.tasks[taskIndex].tags.filter(id => id !== tagId);
        state.tasks[taskIndex].updatedAt = new Date();
      }
    },
    
    // Set all tasks (used for loading from storage)
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setSelectedTask,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
  addTagToTask,
  removeTagFromTask,
  setTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;