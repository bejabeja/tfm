import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectAuthUser, selectIsAuthenticated, selectMe } from '@tobeatraveller/shared';
import { shadow } from '../../utils/styles';

// The emoji itself is the icon (in the colored badge), so titles here are
// plain text, mirroring the web subscription page.
const PREMIUM_FEATURES = [
  { key: 'subscription.featureVanLogTitle', descriptionKey: 'subscription.featureVanLogDesc', emoji: '🚐', color: '#E8743B' },
  { key: 'subscription.featureSuppliesTitle', descriptionKey: 'subscription.featureSuppliesDesc', emoji: '🛒', color: '#2E86AB' },
  { key: 'subscription.featurePackingChecklistTitle', descriptionKey: 'subscription.featurePackingChecklistDesc', emoji: '🎒', color: '#6B4C9A' },
  { key: 'subscription.featureLifeDiaryTitle', descriptionKey: 'subscription.featureLifeDiaryDesc', emoji: '📖', color: '#C2447B' },
  { key: 'subscription.featureAiItineraries', descriptionKey: 'subscription.featureAiItinerariesDesc', emoji: '✨', color: '#1A535C' },
];

const PLANS = [
  {
    id: 'monthly',
    nameKey: 'subscription.monthlyPlanName',
    priceKey: 'subscription.monthlyPriceAmount',
    periodKey: 'subscription.monthlyPricePeriod',
  },
  {
    id: 'annual',
    nameKey: 'subscription.annualPlanName',
    priceKey: 'subscription.annualPriceAmount',
    periodKey: 'subscription.annualPricePeriod',
    badgeKey: 'subscription.annualBadge',
    highlighted: true,
  },
];

const SubscriptionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const meDetail = useSelector(selectMe);
  const authUser = useSelector(selectAuthUser);
  const user = meDetail ?? authUser;
  const isPremium = !!user?.isPremium;

  const handleSubscribeClick = () => Alert.alert(t('subscription.comingSoonToast'));
  const handleTrialClick = () => {
    if (isAuthenticated) {
      handleSubscribeClick();
    } else {
      navigation.navigate('Register');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('nav.subscription')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Ionicons name="sparkles" size={40} color="#E8743B" style={styles.heroIcon} />
          <Text style={styles.title}>{t('subscription.title')}</Text>
          <Text style={styles.subtitle}>{t('subscription.subtitle')}</Text>

          {!isPremium && (
            <TouchableOpacity style={styles.trialBtn} onPress={handleTrialClick}>
              <Text style={styles.trialBtnText}>{t('subscription.ctaFreeTrial')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {isPremium ? (
          <View style={styles.alreadyPremium}>
            <Ionicons name="checkmark-circle" size={36} color="#16a34a" style={styles.alreadyPremiumIcon} />
            <Text style={styles.alreadyPremiumTitle}>{t('subscription.alreadyPremiumTitle')}</Text>
            <Text style={styles.alreadyPremiumDesc}>{t('subscription.alreadyPremiumDesc')}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.featuresTitle}>{t('subscription.featuresTitle')}</Text>
            <View style={styles.features}>
              {PREMIUM_FEATURES.map(({ key, descriptionKey, emoji, color }) => (
                <View key={key} style={styles.feature}>
                  <View style={[styles.featureIconBadge, { backgroundColor: `${color}1A` }]}>
                    <Text style={styles.featureEmoji}>{emoji}</Text>
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{t(key)}</Text>
                    <Text style={styles.featureDesc}>{t(descriptionKey)}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.plans}>
              {PLANS.map((plan) => (
                <View
                  key={plan.id}
                  style={[styles.plan, plan.highlighted && styles.planHighlighted]}
                >
                  {plan.badgeKey && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{t(plan.badgeKey)}</Text>
                    </View>
                  )}
                  <Text style={styles.planName}>{t(plan.nameKey)}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{t(plan.priceKey)}</Text>
                    <Text style={styles.planPeriod}>{t(plan.periodKey)}</Text>
                  </View>

                  {isAuthenticated ? (
                    <TouchableOpacity style={styles.planCta} onPress={handleSubscribeClick}>
                      <Text style={styles.planCtaText}>{t('subscription.ctaSubscribe')}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.planCta} onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.planCtaText}>{t('subscription.ctaCreateAccount')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <Text style={styles.disclaimer}>{t('subscription.disclaimer')}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
    ...shadow(2, 0.05, 6, 2),
  },
  headerBack: { padding: 8, marginRight: 4 },
  headerBackText: { fontSize: 20, color: '#374151' },
  headerTitle: {
    flex: 1, fontSize: 17, fontWeight: '700',
    color: '#111827', textAlign: 'center',
  },
  headerSpacer: { width: 44 },

  scroll: { padding: 16, gap: 14 },

  hero: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  heroIcon: { marginBottom: 12 },
  title: {
    fontSize: 24, fontWeight: '800', color: '#111827',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, color: '#6b7280', textAlign: 'center',
    lineHeight: 20, paddingHorizontal: 8,
  },
  trialBtn: {
    backgroundColor: '#E8743B', borderRadius: 999,
    paddingVertical: 13, paddingHorizontal: 24,
    marginTop: 20,
  },
  trialBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  alreadyPremium: {
    alignItems: 'center', backgroundColor: '#f0fdf4',
    borderRadius: 16, padding: 28, marginTop: 8,
  },
  alreadyPremiumIcon: { marginBottom: 8 },
  alreadyPremiumTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 6 },
  alreadyPremiumDesc: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 19 },

  featuresTitle: {
    fontSize: 15, fontWeight: '700', color: '#111827',
    textAlign: 'center', marginTop: 12,
  },
  features: { gap: 14, marginTop: 4 },
  feature: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    ...shadow(2, 0.05, 6, 2),
  },
  featureIconBadge: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  featureEmoji: { fontSize: 24 },
  featureText: { flex: 1, gap: 2 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  featureDesc: { fontSize: 12.5, color: '#6b7280', lineHeight: 17 },

  plans: { gap: 12, marginTop: 16 },
  plan: {
    position: 'relative', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16,
    padding: 20, alignItems: 'center',
  },
  planHighlighted: {
    borderWidth: 2, borderColor: '#E8743B',
    ...shadow(4, 0.1, 10, 4),
  },
  planBadge: {
    position: 'absolute', top: -11,
    backgroundColor: '#E8743B', borderRadius: 999,
    paddingVertical: 4, paddingHorizontal: 12,
  },
  planBadgeText: {
    color: '#fff', fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  planName: {
    fontSize: 12, fontWeight: '700', color: '#E8743B',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  planPrice: { fontSize: 30, fontWeight: '800', color: '#111827' },
  planPeriod: { fontSize: 13, color: '#6b7280', marginLeft: 6 },
  planCta: {
    backgroundColor: '#E8743B', borderRadius: 999,
    paddingVertical: 12, paddingHorizontal: 28, width: '100%', alignItems: 'center',
  },
  planCtaText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  disclaimer: {
    fontSize: 12, color: '#9ca3af', textAlign: 'center',
    marginTop: 6, lineHeight: 17,
  },
});

export default SubscriptionScreen;
