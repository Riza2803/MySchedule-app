import { AgendaItem, Category, AgendaFilter } from '../types';

export const defaultCategories: Category[] = [
  { id: 'cat-work', name: 'Pekerjaan', color: '#1F241E', icon: 'briefcase-outline' },
  { id: 'cat-personal', name: 'Pribadi', color: '#5A6E58', icon: 'person-outline' },
  { id: 'cat-finance', name: 'Finansial', color: '#D4973B', icon: 'wallet-outline' },
  { id: 'cat-health', name: 'Kesehatan', color: '#D96B52', icon: 'fitness-outline' },
  { id: 'cat-study', name: 'Belajar', color: '#4A6B82', icon: 'book-outline' },
];

function getTodayFormatted(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let mockAgendas: AgendaItem[] = [
  {
    id: 'agenda-1',
    title: 'Review proposal MySchedule',
    description: 'Pemeriksaan kelengkapan fitur offline dan arsitektur desain sistem.',
    date: getTodayFormatted(),
    startTime: '09:00',
    endTime: '10:30',
    categoryId: 'cat-work',
    priority: 'high',
    isCompleted: true,
    hasReminder: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agenda-2',
    title: 'Evaluasi mingguan dompet dan tabungan',
    description: 'Rekapitulasi anggaran kas dan pengeluaran akhir pekan.',
    date: getTodayFormatted(),
    startTime: '13:00',
    endTime: '14:00',
    categoryId: 'cat-finance',
    priority: 'medium',
    isCompleted: false,
    hasReminder: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agenda-3',
    title: 'Jalan santai sore dan peregangan',
    description: 'Target 30 menit di taman komplek.',
    date: getTodayFormatted(),
    startTime: '17:00',
    endTime: '17:45',
    categoryId: 'cat-health',
    priority: 'low',
    isCompleted: false,
    hasReminder: false,
    createdAt: new Date().toISOString(),
  },
];

let mockCategories: Category[] = [...defaultCategories];

export async function initDatabase(): Promise<void> {
  // Web in-memory initialization
  return Promise.resolve();
}

export async function getAgendas(date?: string, categoryId?: string, filter?: AgendaFilter): Promise<AgendaItem[]> {
  let result = [...mockAgendas];
  if (date) {
    result = result.filter(item => item.date === date);
  }
  if (categoryId && categoryId !== 'all') {
    result = result.filter(item => item.categoryId === categoryId);
  }
  if (filter === 'pending') {
    result = result.filter(item => !item.isCompleted);
  } else if (filter === 'completed') {
    result = result.filter(item => item.isCompleted);
  }
  return Promise.resolve(result.sort((a, b) => a.startTime.localeCompare(b.startTime)));
}

export async function addAgenda(item: Omit<AgendaItem, 'id' | 'createdAt'>): Promise<AgendaItem> {
  const newItem: AgendaItem = {
    ...item,
    id: `agenda-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  mockAgendas.unshift(newItem);
  return Promise.resolve(newItem);
}

export async function updateAgenda(item: AgendaItem): Promise<void> {
  const idx = mockAgendas.findIndex(a => a.id === item.id);
  if (idx !== -1) {
    mockAgendas[idx] = item;
  }
  return Promise.resolve();
}

export async function toggleAgendaCompletion(id: string, isCompleted: boolean): Promise<void> {
  const target = mockAgendas.find(a => a.id === id);
  if (target) {
    target.isCompleted = isCompleted;
  }
  return Promise.resolve();
}

export async function deleteAgenda(id: string): Promise<void> {
  mockAgendas = mockAgendas.filter(a => a.id !== id);
  return Promise.resolve();
}

export async function getCategories(): Promise<Category[]> {
  return Promise.resolve([...mockCategories]);
}

export async function addCategory(category: Category): Promise<void> {
  mockCategories.push(category);
  return Promise.resolve();
}

export async function updateCategory(category: Category): Promise<void> {
  const idx = mockCategories.findIndex(c => c.id === category.id);
  if (idx !== -1) {
    mockCategories[idx] = category;
  }
  return Promise.resolve();
}

export async function deleteCategory(id: string): Promise<void> {
  mockCategories = mockCategories.filter(c => c.id !== id);
  // Re-assign agendas in deleted category to fallback
  const fallbackId = mockCategories[0]?.id || 'cat-personal';
  for (const a of mockAgendas) {
    if (a.categoryId === id) {
      a.categoryId = fallbackId;
    }
  }
  return Promise.resolve();
}
