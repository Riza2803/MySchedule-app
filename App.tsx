import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from './src/theme/tokens';
import { AgendaItem, Category, AgendaFilter, NavTab } from './src/types';
import {
  initDatabase,
  getAgendas,
  addAgenda,
  updateAgenda,
  toggleAgendaCompletion,
  deleteAgenda,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getUserName,
  setUserNameSetting,
} from './src/db/database';
import { triggerHaptic } from './src/utils/haptics';
import {
  scheduleAgendaNotifications,
  cancelAgendaNotifications,
  requestNotificationPermission,
  setNotificationListener,
  triggerTestNotification,
  startAlarmEngine,
  updateAlarmAgendas,
  initServiceWorker,
} from './src/utils/notifications';

// Components
import { TopBar } from './src/components/TopBar';
import { HeroSummaryCard } from './src/components/HeroSummaryCard';
import { DateStrip } from './src/components/DateStrip';
import { FilterBar } from './src/components/FilterBar';
import { AgendaItemRow } from './src/components/AgendaItemRow';
import { FloatingNavDock } from './src/components/FloatingNavDock';
import { AddAgendaModal } from './src/components/AddAgendaModal';
import { NotificationModal } from './src/components/NotificationModal';
import { CategoryModal } from './src/components/CategoryModal';
import { ProfileModal } from './src/components/ProfileModal';
import { NotificationBanner } from './src/components/NotificationBanner';
import { OnboardingModal } from './src/components/OnboardingModal';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentFilter, setCurrentFilter] = useState<AgendaFilter>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [currentTab, setCurrentTab] = useState<NavTab>('today');

  // Modals
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [bannerNotif, setBannerNotif] = useState<{ title: string; body: string } | null>(null);
  const [onboardingVisible, setOnboardingVisible] = useState(false);

  const refreshAgendas = async () => {
    const all = await getAgendas();
    setAllAgendas(all);
    updateAlarmAgendas(all);
    const dateParam = currentTab === 'today' ? selectedDate : undefined;
    const filtered = await getAgendas(dateParam, selectedCategoryId, currentFilter);
    setAgendas(filtered);
  };

  useEffect(() => {
    async function setup() {
      await initDatabase();
      initServiceWorker();
      setNotificationListener((title, body) => {
        setBannerNotif({ title, body });
      });
      await requestNotificationPermission();

      // Cek apakah pengguna baru pertama kali membuka aplikasi
      const savedName = await getUserName();
      if (savedName && savedName.trim()) {
        setUserName(savedName);
        setOnboardingVisible(false);
      } else {
        setOnboardingVisible(true);
      }

      const loadedCats = await getCategories();
      setCategories(loadedCats);
      const all = await getAgendas();
      setAllAgendas(all);
      const filtered = await getAgendas(selectedDate, selectedCategoryId, currentFilter);
      setAgendas(filtered);
      startAlarmEngine(all);
      setLoading(false);
    }
    setup();
  }, []);

  useEffect(() => {
    if (!loading) {
      const dateParam = currentTab === 'today' ? selectedDate : undefined;
      getAgendas(dateParam, selectedCategoryId, currentFilter).then(setAgendas);
    }
  }, [selectedDate, selectedCategoryId, currentFilter, currentTab]);

  const datesWithItems = useMemo(() => {
    const set = new Set<string>();
    for (const a of allAgendas) {
      set.add(a.date);
    }
    return set;
  }, [allAgendas]);

  // Today specific metrics for Hero Card
  const todayAgendas = useMemo(() => {
    return allAgendas.filter(a => a.date === selectedDate);
  }, [allAgendas, selectedDate]);

  const completedTodayCount = useMemo(() => {
    return todayAgendas.filter(a => a.isCompleted).length;
  }, [todayAgendas]);

  const allCompletedCount = useMemo(() => {
    return allAgendas.filter(a => a.isCompleted).length;
  }, [allAgendas]);

  const hasUnreadNotification = useMemo(() => {
    return allAgendas.some(a => a.hasReminder && !a.isCompleted && a.date === getTodayString());
  }, [allAgendas]);

  // Actions
  const handleToggleComplete = async (id: string, nextStatus: boolean) => {
    await toggleAgendaCompletion(id, nextStatus);
    const target = allAgendas.find(a => a.id === id);
    if (target) {
      if (nextStatus) {
        cancelAgendaNotifications(id);
      } else {
        await scheduleAgendaNotifications({ ...target, isCompleted: false });
      }
    }
    await refreshAgendas();
  };

  const handleDeleteItem = async (id: string) => {
    cancelAgendaNotifications(id);
    await deleteAgenda(id);
    await refreshAgendas();
  };

  const handleSaveAgenda = async (
    data: Omit<AgendaItem, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    let savedItem: AgendaItem;
    if (existingId) {
      savedItem = {
        ...data,
        id: existingId,
        createdAt: new Date().toISOString(),
      };
      await updateAgenda(savedItem);
    } else {
      savedItem = await addAgenda(data);
    }
    await scheduleAgendaNotifications(savedItem);
    await refreshAgendas();
  };

  const handleOpenEdit = (item: AgendaItem) => {
    setEditingItem(item);
    setAddModalVisible(true);
  };

  // Category Actions
  const handleAddCategory = async (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    await addCategory(newCat);
    const loaded = await getCategories();
    setCategories(loaded);
  };

  const handleUpdateCategory = async (cat: Category) => {
    await updateCategory(cat);
    const loaded = await getCategories();
    setCategories(loaded);
    await refreshAgendas();
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    const loaded = await getCategories();
    setCategories(loaded);
    if (selectedCategoryId === id) {
      setSelectedCategoryId('all');
    }
    await refreshAgendas();
  };

  const handleTestNotification = async (): Promise<string> => {
    const res = await triggerTestNotification();
    return res.statusMessage;
  };

  const handleCompleteOnboarding = async (name: string) => {
    setUserName(name);
    await setUserNameSetting(name);
    setOnboardingVisible(false);
  };

  const handleTabSelect = (tab: NavTab) => {
    if (tab === 'today') {
      setCurrentTab('today');
      setSelectedDate(getTodayString());
    } else if (tab === 'schedule') {
      setCurrentTab('schedule');
    } else if (tab === 'categories') {
      setCategoryModalVisible(true);
    } else if (tab === 'profile') {
      setProfileModalVisible(true);
    }
  };

  const selectedDateLabel =
    currentTab === 'schedule'
      ? 'Seluruh Kalender'
      : selectedDate === getTodayString()
      ? 'Hari Ini'
      : selectedDate;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentPrimary} />
        <Text style={styles.loadingText}>Menyiapkan agenda MySchedule...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <TopBar
        userName={userName}
        hasUnreadNotification={hasUnreadNotification}
        onPressNotification={() => setNotifModalVisible(true)}
        onPressProfile={() => setProfileModalVisible(true)}
      />

      {/* Main List & Header */}
      <FlatList
        data={agendas}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Hero Summary Card */}
            <HeroSummaryCard
              totalAgendas={currentTab === 'schedule' ? allAgendas.length : todayAgendas.length}
              completedAgendas={currentTab === 'schedule' ? allCompletedCount : completedTodayCount}
              selectedDateLabel={selectedDateLabel}
              onPressViewAll={() => handleTabSelect(currentTab === 'schedule' ? 'today' : 'schedule')}
            />

            {/* Horizontal Date Selector (Tampil saat mode Hari Ini / Filter Tanggal) */}
            {currentTab === 'today' ? (
              <DateStrip
                selectedDate={selectedDate}
                onSelectDate={d => setSelectedDate(d)}
                datesWithItems={datesWithItems}
              />
            ) : (
              <View style={styles.allScheduleNotice}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.allScheduleNoticeText}>
                  Menampilkan seluruh agenda kalender (semua tanggal)
                </Text>
              </View>
            )}

            {/* Filter Bar */}
            <FilterBar
              currentFilter={currentFilter}
              onChangeFilter={setCurrentFilter}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            {/* Section Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                {currentTab === 'schedule'
                  ? `Seluruh Jadwal Agenda (${agendas.length})`
                  : `Daftar Agenda ${selectedDateLabel} (${agendas.length})`}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const cat = categories.find(c => c.id === item.categoryId);
          return (
            <AgendaItemRow
              item={item}
              category={cat}
              onToggleComplete={handleToggleComplete}
              onPressItem={handleOpenEdit}
              onDeleteItem={handleDeleteItem}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-clear-outline" size={32} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada agenda</Text>
            <Text style={styles.emptySubtitle}>
              Tidak ada agenda terjadwal pada filter atau tanggal terpilih.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => {
                triggerHaptic('medium');
                setEditingItem(null);
                setAddModalVisible(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Tambah agenda baru"
            >
              <Ionicons name="add" size={16} color={colors.textOnDark} style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddButtonText}>Tambah Agenda</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<View style={{ height: 110 }} />}
      />

      {/* Floating Bottom Navigation Dock & Detached FAB */}
      <FloatingNavDock
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        onPressAdd={() => {
          setEditingItem(null);
          setAddModalVisible(true);
        }}
      />

      {/* Modals */}
      <AddAgendaModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveAgenda}
        initialDate={selectedDate}
        categories={categories}
        editingItem={editingItem}
      />

      <NotificationModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        agendas={allAgendas}
        onTestNotification={handleTestNotification}
      />

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        categories={categories}
        agendas={allAgendas}
        onSelectCategoryFilter={catId => setSelectedCategoryId(catId)}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        userName={userName}
        onUpdateUserName={handleCompleteOnboarding}
        agendas={allAgendas}
      />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        visible={onboardingVisible}
        onSaveName={handleCompleteOnboarding}
      />

      {/* Floating In-App Notification Banner */}
      {bannerNotif && (
        <NotificationBanner
          title={bannerNotif.title}
          body={bannerNotif.body}
          onDismiss={() => setBannerNotif(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  allScheduleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceSage,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.button,
    gap: 6,
  },
  allScheduleNoticeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  emptyAddButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textOnDark,
  },
});
