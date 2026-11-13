import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgendaItem, Category } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface AgendaItemRowProps {
  item: AgendaItem;
  category?: Category;
  onToggleComplete: (id: string, nextStatus: boolean) => void;
  onPressItem: (item: AgendaItem) => void;
  onDeleteItem: (id: string) => void;
}

export const AgendaItemRow: React.FC<AgendaItemRowProps> = ({
  item,
  category,
  onToggleComplete,
  onPressItem,
  onDeleteItem,
}) => {
  const getPriorityColor = () => {
    if (item.priority === 'high') return colors.priorityHigh;
    if (item.priority === 'medium') return colors.priorityMedium;
    return colors.priorityLow;
  };

  const getPriorityLabel = () => {
    if (item.priority === 'high') return 'Prioritas Tinggi';
    if (item.priority === 'medium') return 'Prioritas Sedang';
    return 'Prioritas Rendah';
  };

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          triggerHaptic('light');
          onPressItem(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Agenda ${item.title}`}
        activeOpacity={0.7}
      >
        {/* Checkbox toggle status */}
        <TouchableOpacity
          style={styles.checkboxTouch}
          onPress={() => {
            triggerHaptic('medium');
            onToggleComplete(item.id, !item.isCompleted);
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.isCompleted }}
          accessibilityLabel={item.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
          activeOpacity={0.6}
        >
          <View style={[styles.checkboxCircle, item.isCompleted && styles.checkboxCompleted]}>
            {item.isCompleted && <Ionicons name="checkmark" size={14} color={colors.textOnDark} />}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.titleText, item.isCompleted && styles.titleCompleted]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </View>

          {item.description ? (
            <Text
              style={[styles.descriptionText, item.isCompleted && styles.descriptionCompleted]}
              numberOfLines={1}
            >
              {item.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <Text style={styles.timeText}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.metaDivider}>•</Text>
            <View style={styles.categoryBadge}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: category?.color || colors.accentSage },
                ]}
              />
              <Text style={styles.categoryName}>{category?.name || 'Umum'}</Text>
            </View>

            {item.hasReminder && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Ionicons name="alarm-outline" size={12} color={colors.textSecondary} />
              </>
            )}
          </View>
        </View>

        {/* Priority and actions */}
        <View style={styles.rightActions}>
          <View
            style={[styles.priorityPill, { borderColor: getPriorityColor() }]}
            accessibilityLabel={getPriorityLabel()}
          >
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              triggerHaptic('selection');
              onDeleteItem(item.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Hapus agenda ${item.title}`}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  checkboxTouch: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: '#B8B9B2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.bgHeroDark,
  },
  contentCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 4,
  },
  descriptionCompleted: {
    color: colors.textTertiary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  metaDivider: {
    fontSize: 10,
    color: colors.textTertiary,
    marginHorizontal: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
    marginRight: 4,
  },
  categoryName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityPill: {
    padding: 3,
    borderWidth: 1,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
