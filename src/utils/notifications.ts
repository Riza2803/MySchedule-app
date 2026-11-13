import { Platform, AppState, AppStateStatus } from 'react-native';
import { AgendaItem } from '../types';

let activeNotificationListener: ((title: string, body: string) => void) | null = null;
let notifiedEvents = new Set<string>();
let activeAgendasList: AgendaItem[] = [];
let tickerInterval: any = null;

export function setNotificationListener(listener: ((title: string, body: string) => void) | null) {
  activeNotificationListener = listener;
}

export function playNotificationSound() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Loud, clear two-tone alarm chime
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18); // A5
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
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

export function fireAlarm(title: string, body: string) {
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

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Pemeriksaan berkala (Heartbeat Ticker)
export function checkAlarms() {
  const now = new Date();
  const todayStr = getTodayString();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const item of activeAgendasList) {
    if (!item.hasReminder || item.isCompleted || item.date !== todayStr) {
      continue;
    }

    // 1. Cek Jam Mulai
    if (item.startTime) {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const startMinutes = sh * 60 + sm;
      const startKey = `${item.id}-start-${item.date}`;

      // Picu alarm jika waktu saat ini sama atau lewat maksimal 3 menit
      if (currentMinutes >= startMinutes && currentMinutes <= startMinutes + 3) {
        if (!notifiedEvents.has(startKey)) {
          notifiedEvents.add(startKey);
          fireAlarm(`Agenda Dimulai: ${item.title}`, `Jadwal "${item.title}" dimulai sekarang (${item.startTime}).`);
        }
      }
    }

    // 2. Cek Jam Selesai (hanya jika jam selesai diisi)
    if (item.endTime && item.endTime.trim() !== '') {
      const [eh, em] = item.endTime.split(':').map(Number);
      const endMinutes = eh * 60 + em;
      const endKey = `${item.id}-end-${item.date}`;

      if (currentMinutes >= endMinutes && currentMinutes <= endMinutes + 3) {
        if (!notifiedEvents.has(endKey)) {
          notifiedEvents.add(endKey);
          fireAlarm(`Agenda Selesai: ${item.title}`, `Batas waktu agenda "${item.title}" berakhir (${item.endTime}).`);
        }
      }
    }
  }
}

// Inisialisasi loop pemantau alarm
export function startAlarmEngine(agendas: AgendaItem[]) {
  activeAgendasList = agendas;

  if (tickerInterval) {
    clearInterval(tickerInterval);
  }

  // Jalankan pemeriksaan setiap 2 detik
  tickerInterval = setInterval(() => {
    checkAlarms();
  }, 2000);

  // Jalankan juga saat tab aktif kembali
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkAlarms();
      }
    });
  }

  AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
      checkAlarms();
    }
  });

  // Periksa langsung sekarang
  checkAlarms();
}

export function updateAlarmAgendas(agendas: AgendaItem[]) {
  activeAgendasList = agendas;
  checkAlarms();
}

export async function scheduleAgendaNotifications(agenda: AgendaItem): Promise<void> {
  // Update list dan cek langsung
  const idx = activeAgendasList.findIndex(a => a.id === agenda.id);
  if (idx !== -1) {
    activeAgendasList[idx] = agenda;
  } else {
    activeAgendasList.push(agenda);
  }

  checkAlarms();

  // Native notification scheduling for Android / iOS APK
  if (Platform.OS !== 'web' && agenda.hasReminder && !agenda.isCompleted) {
    try {
      const Notifications = require('expo-notifications');
      const [year, month, day] = agenda.date.split('-').map(Number);
      const now = new Date();

      if (agenda.startTime) {
        const [sh, sm] = agenda.startTime.split(':').map(Number);
        const startDate = new Date(year, month - 1, day, sh, sm, 0);
        if (startDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Agenda Dimulai: ${agenda.title}`,
              body: `Jadwal "${agenda.title}" dimulai sekarang (${agenda.startTime}).`,
              sound: true,
            },
            trigger: { date: startDate },
          });
        }
      }

      if (agenda.endTime && agenda.endTime.trim() !== '') {
        const [eh, em] = agenda.endTime.split(':').map(Number);
        const endDate = new Date(year, month - 1, day, eh, em, 0);
        if (endDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Agenda Selesai: ${agenda.title}`,
              body: `Batas waktu agenda "${agenda.title}" berakhir (${agenda.endTime}).`,
              sound: true,
            },
            trigger: { date: endDate },
          });
        }
      }
    } catch (e) {
      console.warn('Native schedule error:', e);
    }
  }
}

export function cancelAgendaNotifications(agendaId: string): void {
  activeAgendasList = activeAgendasList.filter(a => a.id !== agendaId);
  notifiedEvents.delete(`${agendaId}-start-${getTodayString()}`);
  notifiedEvents.delete(`${agendaId}-end-${getTodayString()}`);
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
          : 'Izin browser terbatas (in-app banner & suara aktif)';
      } catch {
        statusMessage = 'Browser membatasi Web Notification di koneksi HTTP (in-app alarm aktif)';
      }
    } else {
      statusMessage = 'Browser mobile tidak mendukung push HTTP (in-app banner & suara aktif)';
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
        trigger: null,
      });
      statusMessage = 'Notifikasi sistem native dipicu';
    } catch (e) {
      console.warn('Native test error:', e);
    }
  }

  fireAlarm(title, body);

  return {
    webNotificationAllowed: webAllowed,
    statusMessage,
  };
}
