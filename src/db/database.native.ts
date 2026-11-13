import * as SQLite from 'expo-sqlite';
import { AgendaItem, Category, AgendaFilter } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

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

const initialMockAgendas: AgendaItem[] = [
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

export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('myschedule.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agendas (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        priority TEXT NOT NULL,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        hasReminder INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);

    const existingCats = await db.getAllAsync<any>('SELECT id FROM categories LIMIT 1;');
    if (existingCats.length === 0) {
      for (const cat of defaultCategories) {
        await db.runAsync(
          'INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?);',
          [cat.id, cat.name, cat.color, cat.icon]
        );
      }
    }

    const existingAgendas = await db.getAllAsync<any>('SELECT id FROM agendas LIMIT 1;');
    if (existingAgendas.length === 0) {
      for (const a of initialMockAgendas) {
        await db.runAsync(
          `INSERT INTO agendas (id, title, description, date, startTime, endTime, categoryId, priority, isCompleted, hasReminder, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [a.id, a.title, a.description || '', a.date, a.startTime, a.endTime, a.categoryId, a.priority, a.isCompleted ? 1 : 0, a.hasReminder ? 1 : 0, a.createdAt]
        );
      }
    }
  } catch (err) {
    console.warn('Native SQLite init warning:', err);
  }
}

export async function getAgendas(date?: string, categoryId?: string, filter?: AgendaFilter): Promise<AgendaItem[]> {
  if (!db) return [];

  try {
    let query = 'SELECT * FROM agendas WHERE 1=1';
    const params: any[] = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }
    if (categoryId && categoryId !== 'all') {
      query += ' AND categoryId = ?';
      params.push(categoryId);
    }
    if (filter === 'pending') {
      query += ' AND isCompleted = 0';
    } else if (filter === 'completed') {
      query += ' AND isCompleted = 1';
    }
    query += ' ORDER BY startTime ASC;';

    const rows = await db.getAllAsync<any>(query, params);
    return rows.map(r => ({
      ...r,
      isCompleted: Boolean(r.isCompleted),
      hasReminder: Boolean(r.hasReminder),
    }));
  } catch (err) {
    console.error('getAgendas error:', err);
    return [];
  }
}

export async function addAgenda(item: Omit<AgendaItem, 'id' | 'createdAt'>): Promise<AgendaItem> {
  const newItem: AgendaItem = {
    ...item,
    id: `agenda-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };

  if (!db) return newItem;

  try {
    await db.runAsync(
      `INSERT INTO agendas (id, title, description, date, startTime, endTime, categoryId, priority, isCompleted, hasReminder, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        newItem.id,
        newItem.title,
        newItem.description || '',
        newItem.date,
        newItem.startTime,
        newItem.endTime,
        newItem.categoryId,
        newItem.priority,
        newItem.isCompleted ? 1 : 0,
        newItem.hasReminder ? 1 : 0,
        newItem.createdAt,
      ]
    );
    return newItem;
  } catch (err) {
    console.error('addAgenda error:', err);
    return newItem;
  }
}

export async function updateAgenda(item: AgendaItem): Promise<void> {
  if (!db) return;

  try {
    await db.runAsync(
      `UPDATE agendas SET title=?, description=?, date=?, startTime=?, endTime=?, categoryId=?, priority=?, isCompleted=?, hasReminder=?
       WHERE id=?;`,
      [
        item.title,
        item.description || '',
        item.date,
        item.startTime,
        item.endTime,
        item.categoryId,
        item.priority,
        item.isCompleted ? 1 : 0,
        item.hasReminder ? 1 : 0,
        item.id,
      ]
    );
  } catch (err) {
    console.error('updateAgenda error:', err);
  }
}

export async function toggleAgendaCompletion(id: string, isCompleted: boolean): Promise<void> {
  if (!db) return;

  try {
    await db.runAsync('UPDATE agendas SET isCompleted=? WHERE id=?;', [isCompleted ? 1 : 0, id]);
  } catch (err) {
    console.error('toggleAgendaCompletion error:', err);
  }
}

export async function deleteAgenda(id: string): Promise<void> {
  if (!db) return;

  try {
    await db.runAsync('DELETE FROM agendas WHERE id=?;', [id]);
  } catch (err) {
    console.error('deleteAgenda error:', err);
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!db) return [...defaultCategories];

  try {
    const rows = await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name ASC;');
    return rows;
  } catch (err) {
    console.error('getCategories error:', err);
    return [...defaultCategories];
  }
}

export async function addCategory(category: Category): Promise<void> {
  if (!db) return;
  try {
    await db.runAsync(
      'INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?);',
      [category.id, category.name, category.color, category.icon]
    );
  } catch (err) {
    console.error('addCategory error:', err);
  }
}

export async function updateCategory(category: Category): Promise<void> {
  if (!db) return;
  try {
    await db.runAsync(
      'UPDATE categories SET name=?, color=?, icon=? WHERE id=?;',
      [category.name, category.color, category.icon, category.id]
    );
  } catch (err) {
    console.error('updateCategory error:', err);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) return;
  try {
    // Re-assign agendas in deleted category to fallback
    const fallbackId = 'cat-personal';
    await db.runAsync('UPDATE agendas SET categoryId=? WHERE categoryId=?;', [fallbackId, id]);
    await db.runAsync('DELETE FROM categories WHERE id=?;', [id]);
  } catch (err) {
    console.error('deleteCategory error:', err);
  }
}
