import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgendaItem } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  agendas: AgendaItem[];
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  agendas,
}) => {
  const reminderAgendas = agendas.filter(a => a.hasReminder && !a.isCompleted);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Pengingat Aktif</Text>
              <Text style={styles.headerSubtitle}>
                {reminderAgendas.length} alarm jadwal menunggu konfirmasi
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Tutup jendela notifikasi"
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {reminderAgendas.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={40} color={colors.textTertiary} />
                <Text style={styles.emptyTitle}>Tidak ada pengingat tertunda</Text>
                <Text style={styles.emptySubtitle}>
                  Semua agenda dengan alarm telah selesai atau belum disetel.
                </Text>
              </View>
            ) : (
              reminderAgendas.map(item => (
                <View key={item.id} style={styles.reminderCard}>
                  <View style={styles.bellCircle}>
                    <Ionicons name="alarm" size={18} color={colors.accentAlert} />
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitleText}>{item.title}</Text>
                    <Text style={styles.reminderTimeText}>
                      {item.date} • {item.startTime} - {item.endTime}
                    </Text>
                  </View>
                </View>
              ))
            )}
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 14,
    marginBottom: 10,
  },
  bellCircle: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reminderTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
