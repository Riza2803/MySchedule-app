import { AgendaItem } from '../types';

export function registerAndroidWidget() {
  // No-op di web dan iOS
}

export async function syncAndroidWidget(_agendas: AgendaItem[]): Promise<void> {
  // No-op di web dan iOS
  return Promise.resolve();
}
