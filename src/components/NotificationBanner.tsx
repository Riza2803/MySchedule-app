import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, shadows } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface NotificationBannerProps {
  title: string;
  body: string;
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  title,
  body,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={[styles.banner, shadows.card]}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications" size={20} color={colors.textOnDark} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.bodyText} numberOfLines={2}>
            {body}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            triggerHaptic('light');
            onDismiss();
          }}
          accessibilityRole="button"
          accessibilityLabel="Tutup notifikasi"
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 243, 239, 0.15)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.accentAlert,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  bodyText: {
    fontSize: 12,
    color: 'rgba(245, 243, 239, 0.85)',
    marginTop: 2,
    lineHeight: 16,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
