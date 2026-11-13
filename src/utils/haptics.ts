import { Platform } from 'react-native';

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' = 'light') {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const Haptics = require('expo-haptics');
    if (type === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === 'heavy') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (type === 'selection') {
      Haptics.selectionAsync();
    } else if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch {
    // shortcut: silent fallback if haptics hardware unavailable
  }
}
