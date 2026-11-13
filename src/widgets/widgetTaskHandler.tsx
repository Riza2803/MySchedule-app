import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { ScheduleWidget } from './ScheduleWidget';
import * as SQLite from 'expo-sqlite';
import { AgendaItem } from '../types';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, clickAction, clickActionData, renderWidget } = props;

  try {
    const db = await SQLite.openDatabaseAsync('myschedule.db');

    // Pastikan tabel agendas selalu siap
    await db.execAsync(`
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

    if (widgetAction === 'WIDGET_CLICK' && clickAction === 'TOGGLE_TASK') {
      const data = clickActionData as { id?: string; isCompleted?: boolean } | undefined;
      if (data && data.id) {
        const nextStatus = data.isCompleted ? 0 : 1;
        await db.runAsync('UPDATE agendas SET isCompleted=? WHERE id=?;', [nextStatus, data.id]);
      }
    }

    const today = getTodayString();
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM agendas ORDER BY date ASC, startTime ASC;'
    );

    const allAgendas: AgendaItem[] = rows.map(r => ({
      ...r,
      isCompleted: Boolean(r.isCompleted),
      hasReminder: Boolean(r.hasReminder),
    }));

    renderWidget(<ScheduleWidget agendas={allAgendas} todayDate={today} />);
  } catch (err) {
    console.error('widgetTaskHandler error:', err);
    renderWidget(<ScheduleWidget agendas={[]} todayDate={getTodayString()} />);
  }
}
