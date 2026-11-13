import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface DateItem {
  fullDate: string; // YYYY-MM-DD
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  hasItems: boolean;
}

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  datesWithItems?: Set<string>;
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  datesWithItems = new Set(),
}) => {
  const scrollViewRef = useRef<any>(null);

  // Generate 14 days around today (-3 to +10 days)
  const generateDates = (): DateItem[] => {
    const list: DateItem[] = [];
    const today = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = -3; i <= 10; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${day}`;

      const isToday = i === 0;

      list.push({
        fullDate,
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        isToday,
        hasItems: datesWithItems.has(fullDate),
      });
    }
    return list;
  };

  const dates = generateDates();

  useEffect(() => {
    // shortcut: center active item approximately by index offset
    const activeIndex = dates.findIndex(d => d.fullDate === selectedDate);
    if (activeIndex > 2 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: (activeIndex - 2) * 58, animated: true });
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map(item => {
          const isSelected = item.fullDate === selectedDate;

          return (
            <TouchableOpacity
              key={item.fullDate}
              style={[
                styles.datePill,
                isSelected && styles.datePillActive,
                item.isToday && !isSelected && styles.datePillToday,
              ]}
              onPress={() => {
                triggerHaptic('selection');
                onSelectDate(item.fullDate);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${item.dayName} tanggal ${item.dayNumber}`}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dayNameText,
                  isSelected && styles.dayNameActive,
                  item.isToday && !isSelected && styles.dayNameToday,
                ]}
              >
                {item.dayName}
              </Text>

              <Text
                style={[
                  styles.dayNumberText,
                  isSelected && styles.dayNumberActive,
                  item.isToday && !isSelected && styles.dayNumberToday,
                ]}
              >
                {item.dayNumber}
              </Text>

              <View style={styles.dotContainer}>
                {item.hasItems && (
                  <View style={[styles.itemDot, isSelected && styles.itemDotActive]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    gap: 8,
  },
  datePill: {
    width: 50,
    height: 68,
    borderRadius: radii.datePill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  datePillToday: {
    borderColor: colors.accentSage,
  },
  datePillActive: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.bgHeroDark,
  },
  dayNameText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNameToday: {
    color: colors.accentSage,
    fontWeight: '600',
  },
  dayNameActive: {
    color: 'rgba(245, 243, 239, 0.75)',
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayNumberToday: {
    color: colors.textPrimary,
  },
  dayNumberActive: {
    color: colors.textOnDark,
  },
  dotContainer: {
    height: 6,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDot: {
    width: 4,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSage,
  },
  itemDotActive: {
    backgroundColor: colors.bgSurface,
  },
});
