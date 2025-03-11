export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'list' | 'board' | 'calendar';
  defaultTaskSort: 'dueDate' | 'priority' | 'createdAt' | 'title';
  defaultTaskSortDirection: 'asc' | 'desc';
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: number; // Minutes before due date
}