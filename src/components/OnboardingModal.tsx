import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, shadows } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface OnboardingModalProps {
  visible: boolean;
  onSaveName: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onSaveName,
}) => {
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setErrorText('Nama tidak boleh kosong.');
      triggerHaptic('heavy');
      return;
    }
    triggerHaptic('success');
    onSaveName(name.trim());
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.card, shadows.card]}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles-outline" size={26} color={colors.textOnDark} />
          </View>

          <Text style={styles.welcomeTitle}>Selamat Datang di MySchedule</Text>
          <Text style={styles.welcomeSubtitle}>
            Aplikasi pengatur agenda dan pengingat jadwal harian berbasis luring.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Siapa nama panggilan Anda?</Text>
            <TextInput
              style={[styles.input, errorText ? styles.inputError : null]}
              placeholder="Masukkan nama Anda"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={t => {
                setName(t);
                if (errorText) setErrorText('');
              }}
              autoFocus
            />
            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Mulai gunakan aplikasi"
          >
            <Text style={styles.submitBtnText}>Mulai Gunakan MySchedule</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 36, 30, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.bgCanvas,
    borderRadius: radii.hero,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.bgHeroDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  formGroup: {
    width: '100%',
    marginBottom: 18,
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
    fontSize: 15,
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
  submitBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.accentPrimary,
    borderRadius: radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: colors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
  },
});
