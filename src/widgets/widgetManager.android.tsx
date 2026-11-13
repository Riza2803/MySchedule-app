import React from 'react';
import { registerWidgetTaskHandler, requestWidgetUpdate } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgetTaskHandler';
import { ScheduleWidget } from './ScheduleWidget';
import { AgendaItem } from '../types';

export function registerAndroidWidget() {
  try {
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (err) {
    console.warn('registerAndroidWidget error:', err);
  }
}

export async function syncAndroidWidget(agendas: AgendaItem[]): Promise<void> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const todayAgendas = agendas.filter(a => a.date === today);

    await requestWidgetUpdate({
      widgetName: 'ScheduleWidget',
      renderWidget: () => <ScheduleWidget agendas={todayAgendas} />,
    });
  } catch (err) {
    console.warn('syncAndroidWidget error:', err);
  }
}
