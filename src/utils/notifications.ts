import { Platform } from 'react-native';
import { AgendaItem } from '../types';

let scheduledTimeouts: Map<string, any[]> = new Map();

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
    return false;
  }

  try {
    const Notifications = require('expo-notifications');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (err) {
    console.warn('requestNotificationPermission error:', err);
    return false;
  }
}

export async function scheduleAgendaNotifications(agenda: AgendaItem): Promise<void> {
  // Cancel previous notifications for this agenda if any
  cancelAgendaNotifications(agenda.id);

  if (!agenda.hasReminder || agenda.isCompleted) {
    return;
  }

  const [year, month, day] = agenda.date.split('-').map(Number);
  const now = new Date();

  // 1. Notifikasi Jam Mulai
  if (agenda.startTime) {
    const [startH, startM] = agenda.startTime.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, startH, startM, 0);

    if (startDate > now) {
      const title = `Agenda Dimulai: ${agenda.title}`;
      const body = `Jadwal "${agenda.title}" dimulai pukul ${agenda.startTime}.`;

      if (Platform.OS === 'web') {
        const diffMs = startDate.getTime() - now.getTime();
        const timer = setTimeout(() => {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
          } else {
            console.log(`[Notifikasi Mulai] ${title}: ${body}`);
          }
        }, diffMs);

        const list = scheduledTimeouts.get(agenda.id) || [];
        list.push(timer);
        scheduledTimeouts.set(agenda.id, list);
      } else {
        try {
          const Notifications = require('expo-notifications');
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              sound: true,
            },
            trigger: {
              date: startDate,
            },
          });
        } catch (e) {
          console.warn('schedule start notification error:', e);
        }
      }
    }
  }

  // 2. Notifikasi Jam Selesai (hanya jika jam selesai diisi)
  if (agenda.endTime && agenda.endTime.trim() !== '') {
    const [endH, endM] = agenda.endTime.split(':').map(Number);
    const endDate = new Date(year, month - 1, day, endH, endM, 0);

    if (endDate > now) {
      const title = `Agenda Selesai: ${agenda.title}`;
      const body = `Waktu untuk agenda "${agenda.title}" telah berakhir pukul ${agenda.endTime}.`;

      if (Platform.OS === 'web') {
        const diffMs = endDate.getTime() - now.getTime();
        const timer = setTimeout(() => {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
          } else {
            console.log(`[Notifikasi Selesai] ${title}: ${body}`);
          }
        }, diffMs);

        const list = scheduledTimeouts.get(agenda.id) || [];
        list.push(timer);
        scheduledTimeouts.set(agenda.id, list);
      } else {
        try {
          const Notifications = require('expo-notifications');
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              sound: true,
            },
            trigger: {
              date: endDate,
            },
          });
        } catch (e) {
          console.warn('schedule end notification error:', e);
        }
      }
    }
  }
}

export function cancelAgendaNotifications(agendaId: string): void {
  const timers = scheduledTimeouts.get(agendaId);
  if (timers) {
    timers.forEach(t => clearTimeout(t));
    scheduledTimeouts.delete(agendaId);
  }
}
