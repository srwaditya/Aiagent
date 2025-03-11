export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
  tags: string[]; // Array of tag IDs
  userId: string;
  completedAt?: Date;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  categoryId?: string;
  tags?: string[];
  searchText?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}