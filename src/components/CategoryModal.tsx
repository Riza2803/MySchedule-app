import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
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
  onAddCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#1F241E',
  '#5A6E58',
  '#D4973B',
  '#D96B52',
  '#4A6B82',
  '#7A5C8A',
  '#3E6B5C',
  '#9C6343',
];

const PRESET_ICONS = [
  'briefcase-outline',
  'person-outline',
  'wallet-outline',
  'fitness-outline',
  'book-outline',
  'cart-outline',
  'home-outline',
  'heart-outline',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  categories,
  agendas,
  onSelectCategoryFilter,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  const [errorText, setErrorText] = useState('');

  const openAddForm = () => {
    triggerHaptic('light');
    setEditingId(null);
    setNameInput('');
    setSelectedColor(PRESET_COLORS[1]);
    setSelectedIcon(PRESET_ICONS[0]);
    setErrorText('');
    setIsEditing(true);
  };

  const openEditForm = (cat: Category) => {
    triggerHaptic('light');
    setEditingId(cat.id);
    setNameInput(cat.name);
    setSelectedColor(cat.color);
    setSelectedIcon(cat.icon);
    setErrorText('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      setErrorText('Nama kategori tidak boleh kosong.');
      triggerHaptic('heavy');
      return;
    }

    triggerHaptic('success');
    if (editingId) {
      await onUpdateCategory({
        id: editingId,
        name: nameInput.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
    } else {
      await onAddCategory({
        name: nameInput.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = (cat: Category) => {
    triggerHaptic('medium');
    if (categories.length <= 1) {
      if (Platform.OS === 'web') {
        window.alert('Harus menyisakan minimal satu kategori.');
      } else {
        Alert.alert('Peringatan', 'Harus menyisakan minimal satu kategori.');
      }
      return;
    }

    const confirmMsg = `Hapus kategori "${cat.name}"? Agenda dengan kategori ini akan dialihkan ke kategori default.`;
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onDeleteCategory(cat.id);
      }
    } else {
      Alert.alert('Konfirmasi Hapus', confirmMsg, [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => onDeleteCategory(cat.id),
        },
      ]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>
                {isEditing ? (editingId ? 'Ubah Kategori' : 'Kategori Baru') : 'Kelola Kategori'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditing ? 'Tentukan nama, warna, dan ikon' : 'Tambah, ubah, atau hapus kategori'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                triggerHaptic('light');
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  onClose();
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Tutup kategori"
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            /* Form Tambah / Edit Kategori */
            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nama Kategori *</Text>
                <TextInput
                  style={[styles.input, errorText ? styles.inputError : null]}
                  placeholder="Misal: Proyek Lepas"
                  placeholderTextColor={colors.textTertiary}
                  value={nameInput}
                  onChangeText={t => {
                    setNameInput(t);
                    if (errorText) setErrorText('');
                  }}
                />
                {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
              </View>

              {/* Color Presets */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Pilih Warna Aksen</Text>
                <View style={styles.presetColorRow}>
                  {PRESET_COLORS.map(c => {
                    const isSelected = selectedColor === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorCircle, { backgroundColor: c }]}
                        onPress={() => {
                          triggerHaptic('selection');
                          setSelectedColor(c);
                        }}
                      >
                        {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Icon Presets */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Pilih Ikon</Text>
                <View style={styles.presetIconRow}>
                  {PRESET_ICONS.map(ic => {
                    const isSelected = selectedIcon === ic;
                    return (
                      <TouchableOpacity
                        key={ic}
                        style={[
                          styles.iconChoiceBtn,
                          isSelected && styles.iconChoiceBtnActive,
                        ]}
                        onPress={() => {
                          triggerHaptic('selection');
                          setSelectedIcon(ic);
                        }}
                      >
                        <Ionicons
                          name={ic as any}
                          size={20}
                          color={isSelected ? colors.textOnDark : colors.textPrimary}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.formActionRow}>
                <TouchableOpacity
                  style={styles.cancelFormBtn}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelFormBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveFormBtn} onPress={handleSave}>
                  <Text style={styles.saveFormBtnText}>Simpan</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          ) : (
            /* Daftar Kategori */
            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* Tombol Tambah Kategori Baru */}
              <TouchableOpacity
                style={styles.addCategoryCardBtn}
                onPress={openAddForm}
                accessibilityRole="button"
                accessibilityLabel="Tambah kategori baru"
              >
                <View style={styles.addIconCircle}>
                  <Ionicons name="add" size={20} color={colors.textPrimary} />
                </View>
                <Text style={styles.addCategoryCardText}>Tambah Kategori Baru</Text>
              </TouchableOpacity>

              {categories.map(cat => {
                const catAgendas = agendas.filter(a => a.categoryId === cat.id);
                const completedCount = catAgendas.filter(a => a.isCompleted).length;

                return (
                  <View key={cat.id} style={styles.catCard}>
                    {/* Klik baris untuk memfilter */}
                    <TouchableOpacity
                      style={styles.catCardMain}
                      onPress={() => {
                        triggerHaptic('selection');
                        onSelectCategoryFilter(cat.id);
                        onClose();
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Pilih filter ${cat.name}`}
                    >
                      <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
                        <Ionicons name={cat.icon as any} size={20} color={colors.textOnDark} />
                      </View>
                      <View style={styles.catInfo}>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <Text style={styles.catStats}>
                          {catAgendas.length} agenda ({completedCount} selesai)
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Tombol Aksi Edit & Hapus */}
                    <View style={styles.catActionRow}>
                      <TouchableOpacity
                        style={styles.catActionButton}
                        onPress={() => openEditForm(cat)}
                        accessibilityRole="button"
                        accessibilityLabel={`Ubah kategori ${cat.name}`}
                      >
                        <Ionicons name="pencil-outline" size={17} color={colors.textSecondary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.catActionButton}
                        onPress={() => handleDelete(cat)}
                        accessibilityRole="button"
                        accessibilityLabel={`Hapus kategori ${cat.name}`}
                      >
                        <Ionicons name="trash-outline" size={17} color={colors.priorityHigh} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              <View style={{ height: 30 }} />
            </ScrollView>
          )}
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
  addCategoryCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceSage,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radii.row,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addCategoryCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 12,
    marginBottom: 10,
  },
  catCardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  catActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catActionButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
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
  presetColorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetIconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconChoiceBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconChoiceBtnActive: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.bgHeroDark,
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.sm,
  },
  cancelFormBtn: {
    flex: 1,
    height: 46,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelFormBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveFormBtn: {
    flex: 2,
    height: 46,
    borderRadius: radii.pill,
    backgroundColor: colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveFormBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnDark,
  },
});
