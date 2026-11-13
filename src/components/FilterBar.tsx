import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AgendaFilter, Category } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface FilterBarProps {
  currentFilter: AgendaFilter;
  onChangeFilter: (filter: AgendaFilter) => void;
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onChangeFilter,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const filterTabs: { id: AgendaFilter; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'pending', label: 'Tertunda' },
    { id: 'completed', label: 'Selesai' },
  ];

  return (
    <View style={styles.container}>
      {/* Segmented Filter */}
      <View style={styles.segmentedContainer}>
        {filterTabs.map(tab => {
          const isActive = currentFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.segmentItem, isActive && styles.segmentItemActive]}
              onPress={() => {
                triggerHaptic('selection');
                onChangeFilter(tab.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${tab.label}`}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategoryId === 'all' && styles.categoryChipActive,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onSelectCategory('all');
          }}
          accessibilityRole="button"
          accessibilityLabel="Tampilkan semua kategori"
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategoryId === 'all' && styles.categoryChipTextActive,
            ]}
          >
            Semua Kategori
          </Text>
        </TouchableOpacity>

        {categories.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipActive,
              ]}
              onPress={() => {
                triggerHaptic('selection');
                onSelectCategory(cat.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Filter kategori ${cat.name}`}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurfaceMuted,
    borderRadius: radii.pill,
    padding: 3,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
  },
  categoryChipActive: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.bgHeroDark,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.textOnDark,
    fontWeight: '600',
  },
});
