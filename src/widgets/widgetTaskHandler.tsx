import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { ScheduleWidget } from './ScheduleWidget';
import { initDatabase, getAgendas, toggleAgendaCompletion } from '../db/database';

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
    await initDatabase();
    const today = getTodayString();

    if (widgetAction === 'WIDGET_CLICK' && clickAction === 'TOGGLE_TASK') {
      const data = clickActionData as { id?: string; isCompleted?: boolean } | undefined;
      if (data && data.id) {
        await toggleAgendaCompletion(data.id, !data.isCompleted);
      }
    }

    const todayAgendas = await getAgendas(today);
    renderWidget(<ScheduleWidget agendas={todayAgendas} />);
  } catch (err) {
    console.error('widgetTaskHandler error:', err);
  }
}
