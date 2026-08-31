import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert, FlatList, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { deleteVanLogEntry, getVanLogEntries, getVanLogStats, vanLogCategories } from '@tobeatraveller/shared';
import { shadow } from '../../utils/styles';

const CATEGORY_EMOJI = {
  gas_bottle: '🔥', water_fresh: '💧', water_grey: '🚿', water_black: '🚽',
  trash: '🗑️', fuel: '⛽', groceries: '🛒', laundry: '🧺',
  parking: '🅿️', overnight_stay: '🌙', maintenance: '🔧', other: '📍',
};

const EMPTY_FILTERS = { category: '', country: '', dateFrom: '', dateTo: '' };

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const then = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - then) / 86400000);
};

const VanLogScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const daysSinceLabel = (dateStr) => {
    const days = daysSince(dateStr);
    if (days == null) return null;
    if (days <= 0) return t('vanLog.today');
    if (days === 1) return t('vanLog.yesterday');
    return t('vanLog.daysAgo', { count: days });
  };

  const categoryLabel = (value) => {
    const fallback = vanLogCategories.find(c => c.value === value)?.label ?? value;
    return t(`vanLog.category.${value}`, fallback);
  };

  const fetchStats = async () => {
    try { setStats(await getVanLogStats()); } catch { /* keep previous stats */ }
  };

  const fetchEntries = async () => {
    try {
      const data = await getVanLogEntries(filters);
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setEntries([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([fetchEntries(), fetchStats()]).finally(() => setLoading(false));
    }, [filters])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEntries(), fetchStats()]);
    setRefreshing(false);
  };

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleDelete = (entry) => {
    Alert.alert(
      t('vanLog.deleteConfirmTitle'),
      t('vanLog.deleteConfirmDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVanLogEntry(entry.id);
              fetchEntries();
              fetchStats();
            } catch (err) {
              Alert.alert(t('errors.somethingWrong'), err?.message || t('vanLog.deleteError'));
            }
          },
        },
      ]
    );
  };

  const categoryTotals = stats?.byCategory ?? [];
  const countryTotals = stats?.byCountry ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('vanLog.title')}</Text>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate('VanLogEntryForm')}
          >
            <Text style={styles.newBtnText}>+ {t('vanLog.addEntry')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {stats && (categoryTotals.length > 0 || countryTotals.length > 0) && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={styles.statLabelTotal}>{t('vanLog.totalSpent')}</Text>
              <Text style={styles.statValueTotal}>{stats.totalAmount.toFixed(2)}</Text>
            </View>
            {categoryTotals.map(c => (
              <View key={`cat-${c.category}`} style={styles.statCard}>
                <Text style={styles.statLabel}>{CATEGORY_EMOJI[c.category] ?? '📍'} {categoryLabel(c.category)}</Text>
                <Text style={styles.statValue}>{c.total.toFixed(2)}</Text>
                {c.lastDate && <Text style={styles.statMeta}>{daysSinceLabel(c.lastDate)}</Text>}
              </View>
            ))}
            {countryTotals.map(c => (
              <View key={`country-${c.country}`} style={styles.statCard}>
                <Text style={styles.statLabel}>{c.country}</Text>
                <Text style={styles.statValue}>{c.total.toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <TouchableOpacity
            style={[styles.chip, filters.category === '' && styles.chipActive]}
            onPress={() => updateFilter('category', '')}
          >
            <Text style={[styles.chipLabel, filters.category === '' && styles.chipLabelActive]}>
              {t('vanLog.allCategories')}
            </Text>
          </TouchableOpacity>
          {vanLogCategories.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.chip, filters.category === cat.value && styles.chipActive]}
              onPress={() => updateFilter('category', filters.category === cat.value ? '' : cat.value)}
            >
              <Text style={styles.chipEmoji}>{CATEGORY_EMOJI[cat.value] ?? '📍'}</Text>
              <Text style={[styles.chipLabel, filters.category === cat.value && styles.chipLabelActive]}>
                {categoryLabel(cat.value)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Country chips */}
        {countryTotals.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            <TouchableOpacity
              style={[styles.chip, filters.country === '' && styles.chipActive]}
              onPress={() => updateFilter('country', '')}
            >
              <Text style={[styles.chipLabel, filters.country === '' && styles.chipLabelActive]}>
                {t('vanLog.allCountries')}
              </Text>
            </TouchableOpacity>
            {countryTotals.map(({ country }) => (
              <TouchableOpacity
                key={country}
                style={[styles.chip, filters.country === country && styles.chipActive]}
                onPress={() => updateFilter('country', filters.country === country ? '' : country)}
              >
                <Text style={[styles.chipLabel, filters.country === country && styles.chipLabelActive]}>
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Date range */}
        <View style={styles.dateRow}>
          <TextInput
            style={styles.dateInput}
            value={filters.dateFrom}
            onChangeText={v => updateFilter('dateFrom', v)}
            placeholder={t('vanLog.dateFromLabel')}
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            style={styles.dateInput}
            value={filters.dateTo}
            onChangeText={v => updateFilter('dateTo', v)}
            placeholder={t('vanLog.dateToLabel')}
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
          />
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilters}>{t('common.reset')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={loading && !entries.length
          ? Array.from({ length: 4 }, (_, i) => ({ id: `sk-${i}`, _skeleton: true }))
          : entries
        }
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#E8743B" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🚐</Text>
              <Text style={styles.emptyTitle}>
                {hasActiveFilters ? t('vanLog.noEntriesFiltered') : t('vanLog.noEntries')}
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={styles.emptyLink}>{t('common.reset')}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => item._skeleton ? (
          <View style={[styles.entry, styles.entrySkeleton]} />
        ) : (
          <View style={styles.entry}>
            <View style={styles.entryMain}>
              <View style={styles.entryTopRow}>
                <Text style={styles.entryCategory}>
                  {CATEGORY_EMOJI[item.category] ?? '📍'} {categoryLabel(item.category)}
                </Text>
                <Text style={styles.entryDate}>
                  {item.entryDate}
                  {item.entryDate && daysSinceLabel(item.entryDate) ? ` · ${daysSinceLabel(item.entryDate)}` : ''}
                </Text>
              </View>
              {item.title ? <Text style={styles.entryTitle}>{item.title}</Text> : null}
              {item.location?.name ? (
                <Text style={styles.entryLocation}>
                  📍 {item.location.name}{item.location.country ? `, ${item.location.country}` : ''}
                </Text>
              ) : null}
              {item.notes ? <Text style={styles.entryNotes} numberOfLines={2}>{item.notes}</Text> : null}
            </View>
            <View style={styles.entrySide}>
              {item.amount != null && (
                <Text style={styles.entryAmount}>{item.amount.toFixed(2)} {item.currency || ''}</Text>
              )}
              <View style={styles.entryActions}>
                <TouchableOpacity
                  style={styles.entryActionBtn}
                  onPress={() => navigation.navigate('VanLogEntryForm', { entry: item })}
                >
                  <Ionicons name="pencil-outline" size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.entryActionBtn} onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
    ...shadow(2, 0.05, 6, 2),
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
  },
  backBtn: { marginRight: 10, padding: 4 },
  backText: { fontSize: 20, color: '#374151' },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: '#111827' },
  newBtn: {
    backgroundColor: '#E8743B', borderRadius: 999,
    paddingVertical: 7, paddingHorizontal: 14,
  },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  statsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  statCard: {
    backgroundColor: '#f9fafb', borderRadius: 12,
    borderWidth: 1, borderColor: '#e5e7eb',
    paddingVertical: 8, paddingHorizontal: 12, minWidth: 96,
  },
  statCardTotal: { backgroundColor: '#FFF0E8', borderColor: '#E8743B' },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  statLabelTotal: { fontSize: 11, color: '#C45A22', fontWeight: '700' },
  statValue: { fontSize: 15, color: '#111827', fontWeight: '800', marginTop: 2 },
  statValueTotal: { fontSize: 15, color: '#E8743B', fontWeight: '800', marginTop: 2 },
  statMeta: { fontSize: 10, color: '#9ca3af', marginTop: 2 },

  chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 5, paddingHorizontal: 10,
    borderRadius: 999, borderWidth: 1.5, borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  chipActive: { borderColor: '#E8743B', backgroundColor: '#FFF0E8' },
  chipEmoji: { fontSize: 12 },
  chipLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  chipLabelActive: { color: '#E8743B', fontWeight: '600' },

  dateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 2,
  },
  dateInput: {
    flex: 1, borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10,
    backgroundColor: '#f9fafb', paddingVertical: 8, paddingHorizontal: 10,
    fontSize: 13, color: '#111827',
  },
  clearFilters: { fontSize: 12, color: '#dc2626', fontWeight: '600' },

  list: { padding: 12, gap: 10 },

  entry: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e5e7eb',
    padding: 12, gap: 10,
  },
  entrySkeleton: { height: 76, backgroundColor: '#f3f4f6', borderColor: '#f3f4f6' },
  entryMain: { flex: 1 },
  entryTopRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  entryCategory: { fontSize: 13, fontWeight: '700', color: '#111827' },
  entryDate: { fontSize: 11, color: '#9ca3af' },
  entryTitle: { fontSize: 13, color: '#374151', marginTop: 4 },
  entryLocation: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  entryNotes: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  entrySide: { alignItems: 'flex-end', justifyContent: 'space-between' },
  entryAmount: { fontSize: 14, fontWeight: '800', color: '#111827' },
  entryActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  entryActionBtn: { padding: 2 },

  empty: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 15, color: '#6b7280', textAlign: 'center' },
  emptyLink: { fontSize: 14, color: '#E8743B', fontWeight: '600', marginTop: 10 },
});

export default VanLogScreen;
