import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavTab } from '../types';
import { colors, radii, shadows } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface FloatingNavDockProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onPressAdd: () => void;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  currentTab,
  onSelectTab,
  onPressAdd,
}) => {
  const tabs: { id: NavTab; iconOutline: any; iconSolid: any; label: string }[] = [
    { id: 'today', iconOutline: 'sunny-outline', iconSolid: 'sunny', label: 'Hari Ini' },
    { id: 'schedule', iconOutline: 'calendar-outline', iconSolid: 'calendar', label: 'Kalender' },
    { id: 'categories', iconOutline: 'grid-outline', iconSolid: 'grid', label: 'Kategori' },
    { id: 'profile', iconOutline: 'person-outline', iconSolid: 'person', label: 'Profil' },
  ];

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      {/* 1. Navigation Pill */}
      <View style={[styles.navPill, shadows.subtle]}>
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => {
                triggerHaptic('selection');
                onSelectTab(tab.id);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.iconSolid : tab.iconOutline}
                size={22}
                color={isActive ? colors.textPrimary : colors.textTertiary}
              />
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Detached FAB */}
      <TouchableOpacity
        style={[styles.fabButton, shadows.card]}
        onPress={() => {
          triggerHaptic('medium');
          onPressAdd();
        }}
        accessibilityRole="button"
        accessibilityLabel="Tambah agenda baru"
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color={colors.textOnDark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  navPill: {
    flex: 1,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tabButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 16,
    height: 2.5,
    borderRadius: radii.pill,
    backgroundColor: colors.accentPrimary,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.bgHeroDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
