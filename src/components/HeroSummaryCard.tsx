import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface HeroSummaryCardProps {
  totalAgendas: number;
  completedAgendas: number;
  selectedDateLabel: string;
  onPressViewAll: () => void;
}

export const HeroSummaryCard: React.FC<HeroSummaryCardProps> = ({
  totalAgendas,
  completedAgendas,
  selectedDateLabel,
  onPressViewAll,
}) => {
  const percentage = totalAgendas > 0 ? Math.round((completedAgendas / totalAgendas) * 100) : 0;
  const remaining = totalAgendas - completedAgendas;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.statusDot} />
          <Text style={styles.badgeText}>Ringkasan {selectedDateLabel}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            triggerHaptic('light');
            onPressViewAll();
          }}
          accessibilityRole="button"
          accessibilityLabel="Lihat seluruh daftar jadwal"
        >
          <Text style={styles.detailsText}>Lihat Kalender</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(245, 243, 239, 0.85)" />
        </TouchableOpacity>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.completedCount}>{completedAgendas} Selesai </Text>
        <Text style={styles.totalCount}>/ {totalAgendas} Agenda</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerNote}>
          {totalAgendas === 0
            ? 'Belum ada agenda pada tanggal ini.'
            : remaining === 0
            ? 'Semua agenda tuntas dikerjakan.'
            : `${remaining} agenda menunggu diselesaikan (${percentage}% progres).`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 243, 239, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSage,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textOnDark,
    letterSpacing: 0.2,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  detailsText: {
    fontSize: 12,
    color: 'rgba(245, 243, 239, 0.85)',
    marginRight: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  completedCount: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  totalCount: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(245, 243, 239, 0.7)',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.pill,
  },
  footerRow: {
    marginTop: 2,
  },
  footerNote: {
    fontSize: 12,
    color: 'rgba(245, 243, 239, 0.75)',
    lineHeight: 16,
  },
});
