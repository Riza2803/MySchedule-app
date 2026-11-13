import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgendaItem, Category, Priority } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface AddAgendaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<AgendaItem, 'id' | 'createdAt'>, existingId?: string) => void;
  initialDate?: string;
  categories: Category[];
  editingItem?: AgendaItem | null;
}

function getCurrentTimeString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export const AddAgendaModal: React.FC<AddAgendaModalProps> = ({
  visible,
  onClose,
  onSave,
  initialDate,
  categories,
  editingItem,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(getCurrentTimeString());
  const [endTime, setEndTime] = useState('');
  const [categoryId, setCategoryId] = useState('cat-work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [hasReminder, setHasReminder] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setDate(editingItem.date);
      setStartTime(editingItem.startTime);
      setEndTime(editingItem.endTime || '');
      setCategoryId(editingItem.categoryId);
      setPriority(editingItem.priority);
      setHasReminder(editingItem.hasReminder);
    } else {
      setTitle('');
      setDescription('');
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setStartTime(getCurrentTimeString());
      setEndTime('');
      setCategoryId(categories[0]?.id || 'cat-work');
      setPriority('medium');
      setHasReminder(true);
    }
    setErrorText('');
  }, [editingItem, visible, initialDate]);

  const handleSave = () => {
    if (!title.trim()) {
      setErrorText('Judul agenda tidak boleh kosong.');
      triggerHaptic('heavy');
      return;
    }

    triggerHaptic('success');
    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime: endTime.trim() ? endTime.trim() : undefined,
        categoryId,
        priority,
        isCompleted: editingItem ? editingItem.isCompleted : false,
        hasReminder,
      },
      editingItem?.id
    );
    onClose();
  };

  const setDateOffset = (days: number) => {
    triggerHaptic('selection');
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    setDate(`${yr}-${mo}-${dy}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {editingItem ? 'Ubah Agenda' : 'Tambah Agenda Baru'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Tutup formulir agenda"
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Judul */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Judul Agenda *</Text>
              <TextInput
                style={[styles.input, errorText ? styles.inputError : null]}
                placeholder="Misal: Rapat koordinasi proyek"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={t => {
                  setTitle(t);
                  if (errorText) setErrorText('');
                }}
              />
              {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
            </View>

            {/* Deskripsi */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Catatan Tambahan</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Rincian catatan agenda (opsional)"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Tanggal */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tanggal (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-11-13"
                placeholderTextColor={colors.textTertiary}
                value={date}
                onChangeText={setDate}
              />
              <View style={styles.quickDateRow}>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => setDateOffset(0)}
                  accessibilityRole="button"
                >
                  <Text style={styles.quickDateText}>Hari Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => setDateOffset(1)}
                  accessibilityRole="button"
                >
                  <Text style={styles.quickDateText}>Besok</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDatePill}
                  onPress={() => setDateOffset(2)}
                  accessibilityRole="button"
                >
                  <Text style={styles.quickDateText}>Lusa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Jam Mulai & Selesai */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Jam Mulai *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor={colors.textTertiary}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Jam Selesai (Opsional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10:00"
                  placeholderTextColor={colors.textTertiary}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            {/* Kategori */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Kategori</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {categories.map(cat => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChoice, isSelected && styles.categoryChoiceActive]}
                      onPress={() => {
                        triggerHaptic('selection');
                        setCategoryId(cat.id);
                      }}
                      accessibilityRole="button"
                    >
                      <View style={[styles.catColorDot, { backgroundColor: cat.color }]} />
                      <Text
                        style={[
                          styles.categoryChoiceText,
                          isSelected && styles.categoryChoiceTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Prioritas */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tingkat Prioritas</Text>
              <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as Priority[]).map(p => {
                  const isSelected = priority === p;
                  const label = p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi';
                  const color =
                    p === 'low'
                      ? colors.priorityLow
                      : p === 'medium'
                      ? colors.priorityMedium
                      : colors.priorityHigh;

                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.priorityChoice, isSelected && styles.priorityChoiceActive]}
                      onPress={() => {
                        triggerHaptic('selection');
                        setPriority(p);
                      }}
                      accessibilityRole="button"
                    >
                      <View style={[styles.priorityIndicatorDot, { backgroundColor: color }]} />
                      <Text
                        style={[
                          styles.priorityChoiceText,
                          isSelected && styles.priorityChoiceTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Pengingat Alarm */}
            <View style={styles.reminderRow}>
              <View style={styles.reminderTextCol}>
                <Text style={styles.reminderTitle}>Alarm Pengingat</Text>
                <Text style={styles.reminderSubtitle}>
                  {endTime.trim()
                    ? 'Notifikasi berbunyi saat jam mulai dan jam selesai tiba.'
                    : 'Notifikasi berbunyi saat jam mulai tiba.'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.toggleTrack, hasReminder && styles.toggleTrackActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setHasReminder(!hasReminder);
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: hasReminder }}
                accessibilityLabel="Aktifkan pengingat notifikasi"
              >
                <View style={[styles.toggleThumb, hasReminder && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Submit Action */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Simpan agenda"
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>
                {editingItem ? 'Simpan Perubahan' : 'Buat Agenda'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '85%',
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
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radii.button,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.accentAlert,
  },
  errorText: {
    fontSize: 12,
    color: colors.accentAlert,
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickDatePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
  },
  quickDateText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  catScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  categoryChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginRight: 8,
  },
  categoryChoiceActive: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.bgHeroDark,
  },
  catColorDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    marginRight: 6,
  },
  categoryChoiceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryChoiceTextActive: {
    color: colors.textOnDark,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChoice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
  },
  priorityChoiceActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.bgSurfaceSage,
  },
  priorityIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: radii.pill,
    marginRight: 6,
  },
  priorityChoiceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priorityChoiceTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radii.row,
    padding: 14,
    marginTop: 6,
  },
  reminderTextCol: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: colors.accentSage,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footerRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  submitButton: {
    height: 50,
    backgroundColor: colors.accentPrimary,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnDark,
  },
});
