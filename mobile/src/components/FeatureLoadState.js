import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Shown instead of a feature's normal empty state when the list failed to
// load, so a 403 (premium required) doesn't look like "you have no entries".
const FeatureLoadState = ({ status, onRetry }) => {
  const { t } = useTranslation();

  if (status === 'premium') {
    return (
      <View style={styles.container}>
        <Ionicons name="lock-closed-outline" size={40} color="#E8743B" />
        <Text style={styles.title}>{t('premium.requiredTitle')}</Text>
        <Text style={styles.desc}>{t('premium.requiredDesc')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={40} color="#9ca3af" />
      <Text style={styles.title}>{t('premium.loadErrorDesc')}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text style={styles.retry}>{t('common.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 32 },
  title: { fontSize: 15, color: '#374151', fontWeight: '600', textAlign: 'center', marginTop: 12 },
  desc: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  retry: { fontSize: 14, color: '#E8743B', fontWeight: '600', marginTop: 10 },
});

export default FeatureLoadState;
