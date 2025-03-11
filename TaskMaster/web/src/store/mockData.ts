import { Task, TaskStatus, TaskPriority } from '../../../shared/types/task';
import { User } from '../../../shared/types/user';

// Mock user
export const mockUser: User = {
  id: 'user1',
  email: 'user@example.com',
  displayName: 'Demo User',
  photoURL: 'https://via.placeholder.com/150',
  createdAt: new Date('2023-01-01'),
  lastLoginAt: new Date(),
  preferences: {
    theme: 'system',
    defaultView: 'list',
    defaultTaskSort: 'dueDate',
    defaultTaskSortDirection: 'asc',
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: 30
  }
};

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Complete project proposal',
    description: 'Write a detailed project proposal for the new client project including timeline, budget, and resource allocation.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000), // Yesterday
    categoryId: 'work',
    tags: ['urgent', 'meeting'],
    userId: 'user1'
  },
  {
    id: 'task2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits, vegetables',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000), // Yesterday
    categoryId: 'shopping',
    tags: [],
    userId: 'user1'
  },
  {
    id: 'task3',
    title: 'Schedule dentist appointment',
    description: 'Call Dr. Smith for a check-up appointment',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    dueDate: new Date(Date.now() + 604800000), // Next week
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000), // 3 days ago
    categoryId: 'health',
    tags: [],
    userId: 'user1'
  },
  {
    id: 'task4',
    title: 'Prepare for presentation',
    description: 'Create slides and practice for the quarterly review presentation',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() - 86400000), // Yesterday (overdue)
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
    updatedAt: new Date(Date.now() - 172800000), // 2 days ago
    categoryId: 'work',
    tags: ['urgent', 'meeting'],
    userId: 'user1'
  },
  {
    id: 'task5',
    title: 'Pay utility bills',
    description: 'Pay electricity, water, and internet bills',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(Date.now() - 172800000), // 2 days ago
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000), // Yesterday
    completedAt: new Date(Date.now() - 86400000), // Yesterday
    categoryId: 'personal',
    tags: ['important'],
    userId: 'user1'
  },
  {
    id: 'task6',
    title: 'Research new technologies',
    description: 'Look into React 18 features and new TypeScript updates',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(Date.now() - 518400000), // 6 days ago
    updatedAt: new Date(Date.now() - 259200000), // 3 days ago
    categoryId: 'education',
    tags: ['idea'],
    userId: 'user1'
  },
  {
    id: 'task7',
    title: 'Review code pull request',
    description: 'Review and provide feedback on the new feature PR',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() - 259200000), // 3 days ago
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
    updatedAt: new Date(Date.now() - 172800000), // 2 days ago
    completedAt: new Date(Date.now() - 172800000), // 2 days ago
    categoryId: 'work',
    tags: ['review'],
    userId: 'user1'
  },
  {
    id: 'task8',
    title: 'Plan weekend trip',
    description: 'Research destinations, accommodations, and activities for the weekend getaway',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    dueDate: new Date(Date.now() + 259200000), // 3 days from now
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000), // Yesterday
    categoryId: 'personal',
    tags: ['idea'],
    userId: 'user1'
  }
];