export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  categoryId: string;
  priority: Priority;
  isCompleted: boolean;
  hasReminder: boolean;
  createdAt: string;
}

export type AgendaFilter = 'all' | 'pending' | 'completed';

export type NavTab = 'today' | 'schedule' | 'categories' | 'profile';
