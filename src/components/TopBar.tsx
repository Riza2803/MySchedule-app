import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface TopBarProps {
  userName: string;
  hasUnreadNotification: boolean;
  onPressNotification: () => void;
  onPressProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userName,
  hasUnreadNotification,
  onPressNotification,
  onPressProfile,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi,';
    if (hour < 15) return 'Selamat siang,';
    if (hour < 18) return 'Selamat sore,';
    return 'Selamat malam,';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={styles.microNote}>~ Fokus pada prioritas hari ini</Text>
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>{getGreeting()} </Text>
          <Text style={styles.nameText}>{userName}</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            triggerHaptic('light');
            onPressNotification();
          }}
          accessibilityRole="button"
          accessibilityLabel="Buka notifikasi pengingat"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          {hasUnreadNotification && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => {
            triggerHaptic('light');
            onPressProfile();
          }}
          accessibilityRole="button"
          accessibilityLabel="Buka profil pengguna"
          activeOpacity={0.7}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase() || 'R'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  leftCol: {
    flex: 1,
  },
  microNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.accentAlert,
    borderWidth: 1.5,
    borderColor: colors.bgSurfaceMuted,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.bgHeroDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnDark,
  },
});
