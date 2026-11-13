import { Platform } from 'react-native';
import { AgendaItem } from '../types';

let scheduledTimeouts: Map<string, any[]> = new Map();
let activeNotificationListener: ((title: string, body: string) => void) | null = null;

export function setNotificationListener(listener: ((title: string, body: string) => void) | null) {
  activeNotificationListener = listener;
}

export function playNotificationSound() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Two-tone pleasant chime (D5 -> A5)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
      } catch (e) {
        console.warn('requestPermission web error:', e);
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

function fireAlarm(title: string, body: string) {
  playNotificationSound();

  if (activeNotificationListener) {
    activeNotificationListener(title, body);
  }

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
      } catch (e) {
        console.warn('Web notification dispatch error:', e);
      }
    }
  }
}

export async function scheduleAgendaNotifications(agenda: AgendaItem): Promise<void> {
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
      const body = `Jadwal "${agenda.title}" dimulai sekarang (${agenda.startTime}).`;

      if (Platform.OS === 'web') {
        const diffMs = startDate.getTime() - now.getTime();
        const timer = setTimeout(() => {
          fireAlarm(title, body);
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
      const body = `Waktu untuk agenda "${agenda.title}" telah berakhir (${agenda.endTime}).`;

      if (Platform.OS === 'web') {
        const diffMs = endDate.getTime() - now.getTime();
        const timer = setTimeout(() => {
          fireAlarm(title, body);
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

export async function triggerTestNotification(): Promise<{
  webNotificationAllowed: boolean;
  statusMessage: string;
}> {
  const title = 'Uji Coba Pengingat';
  const body = 'Pengingat berhasil dipicu. Audio alarm dan pemberitahuan aktif.';

  let webAllowed = false;
  let statusMessage = '';

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        webAllowed = permission === 'granted';
        statusMessage = webAllowed
          ? 'Izin browser aktif (Desktop/PWA)'
          : 'Izin browser ditolak atau terbatas oleh browser mobile';
      } catch {
        statusMessage = 'Browser membatasi Web Notification API di koneksi HTTP';
      }
    } else {
      statusMessage = 'Browser mobile tidak mendukung Web Notification di tab biasa';
    }
  } else {
    try {
      const Notifications = require('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // trigger immediately
      });
      statusMessage = 'Notifikasi sistem native dipicu';
    } catch (e) {
      console.warn('Native test error:', e);
    }
  }

  // Trigger in-app chime and banner
  fireAlarm(title, body);

  return {
    webNotificationAllowed: webAllowed,
    statusMessage,
  };
}
