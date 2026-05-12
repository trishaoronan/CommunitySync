import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleUnderstand = () => {
    alert('Privacy Policy accepted');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Gradient Background with Shield Icon */}
      <LinearGradient
        colors={['#0a7ea4', '#FFD700']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientSection}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="shield" size={80} color="#FFF" />
        </View>
      </LinearGradient>

      {/* Content Card */}
      <View style={styles.cardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.sectionText}>
              CommunitySync collects resident data including names, identification numbers, contact
              information, and document details for processing barangay document requests. This
              information is essential for verifying resident identity and eligibility for services.
            </Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.sectionText}>
              We implement industry-standard security measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction. Your data is
              encrypted and stored securely on our servers.
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletText}>• Encrypted data transmission</Text>
              <Text style={styles.bulletText}>• Secure cloud storage</Text>
              <Text style={styles.bulletText}>• Regular security assessments</Text>
              <Text style={styles.bulletText}>• Staff training on data privacy</Text>
            </View>
          </View>

          {/* Third-Party Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Third-Party Sharing</Text>
            <Text style={styles.sectionText}>
              Your personal data is only shared with authorized Barangay officials and staff who
              require access to process your requests. We do not sell, rent, or lease your personal
              information to third parties without your explicit consent.
            </Text>
          </View>

          {/* Data Retention */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your personal data only for as long as necessary to fulfill the purposes
              for which it was collected, comply with legal obligations, or resolve disputes. You
              may request deletion of your data subject to legal retention requirements.
            </Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Privacy Rights</Text>
            <Text style={styles.sectionText}>
              Under applicable laws, you have the right to:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletText}>• Access your personal data</Text>
              <Text style={styles.bulletText}>• Request correction of inaccurate data</Text>
              <Text style={styles.bulletText}>• Request deletion of your data</Text>
              <Text style={styles.bulletText}>• Withdraw consent for data processing</Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Footer Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.understandButton}
          onPress={handleUnderstand}
          activeOpacity={0.8}
        >
          <Text style={styles.understandButtonText}>I understand</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  gradientSection: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a7ea4',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  understandButton: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  understandButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default PrivacyPolicyScreen;
