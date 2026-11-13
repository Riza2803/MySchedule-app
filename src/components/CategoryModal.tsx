import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, AgendaItem } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  agendas: AgendaItem[];
  onSelectCategoryFilter: (categoryId: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  categories,
  agendas,
  onSelectCategoryFilter,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Kategori Agenda</Text>
              <Text style={styles.headerSubtitle}>Pengelompokan jadwal dan produktivitas</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Tutup kategori"
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {categories.map(cat => {
              const catAgendas = agendas.filter(a => a.categoryId === cat.id);
              const completedCount = catAgendas.filter(a => a.isCompleted).length;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.catCard}
                  onPress={() => {
                    triggerHaptic('selection');
                    onSelectCategoryFilter(cat.id);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Kategori ${cat.name}`}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
                    <Ionicons name={cat.icon as any} size={20} color={colors.textOnDark} />
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catStats}>
                      {catAgendas.length} total agenda ({completedCount} selesai)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 36, 30, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.bgCanvas,
    borderTopLeftRadius: radii.hero,
    borderTopRightRadius: radii.hero,
    maxHeight: '75%',
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.borderHairline,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  catStats: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
