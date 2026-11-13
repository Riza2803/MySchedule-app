import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgendaItem } from '../types';
import { colors, spacing, radii } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  agendas: AgendaItem[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  userName,
  onUpdateUserName,
  agendas,
}) => {
  const [nameInput, setNameInput] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);

  const completedCount = agendas.filter(a => a.isCompleted).length;
  const totalCount = agendas.length;
  const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      triggerHaptic('success');
      onUpdateUserName(nameInput.trim());
      setIsEditing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Profil & Pengaturan</Text>
              <Text style={styles.headerSubtitle}>Kelola identitas dan preferensi lokal</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Tutup profil"
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* User Card */}
            <View style={styles.userCard}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {userName.charAt(0).toUpperCase() || 'R'}
                </Text>
              </View>

              {isEditing ? (
                <View style={styles.editNameCol}>
                  <TextInput
                    style={styles.nameTextInput}
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="Nama Anda"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}>
                    <Text style={styles.saveNameBtnText}>Simpan</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.nameDisplayRow}>
                  <View>
                    <Text style={styles.nameTitle}>{userName}</Text>
                    <Text style={styles.appTitleBadge}>Pengguna MySchedule</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      triggerHaptic('light');
                      setIsEditing(true);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Edit nama pengguna"
                  >
                    <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Productivity Stats */}
            <Text style={styles.sectionHeading}>Statistik Produktivitas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalCount}</Text>
                <Text style={styles.statLabel}>Total Agenda</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{completedCount}</Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{rate}%</Text>
                <Text style={styles.statLabel}>Rasio Tuntas</Text>
              </View>
            </View>

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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.hero,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 16,
    marginBottom: spacing.md,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.bgHeroDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  nameDisplayRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  appTitleBadge: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editNameCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameTextInput: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radii.button,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.textPrimary,
  },
  saveNameBtn: {
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
  },
  saveNameBtnText: {
    color: colors.textOnDark,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.row,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 16,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoItemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
});
