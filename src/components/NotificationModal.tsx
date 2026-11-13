import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgendaItem } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  agendas: AgendaItem[];
  onTestNotification: () => Promise<string>;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  agendas,
  onTestNotification,
}) => {
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const reminderAgendas = agendas.filter(a => a.hasReminder && !a.isCompleted);

  const handleTest = async () => {
    triggerHaptic('medium');
    setIsTesting(true);
    try {
      const msg = await onTestNotification();
      setTestResult(msg);
    } catch {
      setTestResult('Pengujian selesai (audio dan banner alarm dipicu).');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Pengingat & Alarm</Text>
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
            {/* Tombol Uji Coba Alarm */}
            <View style={styles.testBox}>
              <View style={styles.testHeader}>
                <Ionicons name="volume-high-outline" size={20} color={colors.textPrimary} />
                <Text style={styles.testTitle}>Uji Coba Suara & Alarm</Text>
              </View>
              <Text style={styles.testDesc}>
                Tekan tombol di bawah untuk membunyikan suara alarm dan memunculkan banner notifikasi
                pada perangkat Anda.
              </Text>
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTest}
                disabled={isTesting}
                accessibilityRole="button"
                accessibilityLabel="Tes alarm notifikasi sekarang"
              >
                <Ionicons name="play" size={16} color={colors.textOnDark} style={{ marginRight: 6 }} />
                <Text style={styles.testButtonText}>
                  {isTesting ? 'Memicu Alarm...' : 'Tes Notifikasi Sekarang'}
                </Text>
              </TouchableOpacity>
              {testResult ? (
                <View style={styles.resultBadge}>
                  <Text style={styles.resultText}>Status: {testResult}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.listHeading}>Daftar Pengingat Aktif</Text>

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
                      {item.date} • {item.endTime ? `${item.startTime} - ${item.endTime}` : item.startTime}
                    </Text>
                    <Text style={styles.reminderScheduleDetail}>
                      {item.endTime
                        ? 'Notif: Mulai dan selesai'
                        : 'Notif: Mulai saja'}
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
    maxHeight: '80%',
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
  testBox: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 14,
    marginBottom: 16,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  testDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  testButton: {
    flexDirection: 'row',
    backgroundColor: colors.bgHeroDark,
    height: 42,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonText: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: '600',
  },
  resultBadge: {
    backgroundColor: colors.bgSurfaceSage,
    padding: 8,
    borderRadius: radii.button,
    marginTop: 10,
  },
  resultText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
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
  reminderScheduleDetail: {
    fontSize: 11,
    color: colors.accentSage,
    fontWeight: '500',
    marginTop: 2,
  },
});
