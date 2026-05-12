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

const TermsAndConditionsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleAccept = () => {
    alert('Terms and Conditions accepted');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Gradient Background with Document Icon */}
      <LinearGradient
        colors={['#0a7ea4', '#FFD700']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientSection}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="description" size={80} color="#FFF" />
        </View>
      </LinearGradient>

      {/* Legal Card */}
      <View style={styles.cardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {/* Acceptance of Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By using CommunitySync, you agree to these Terms and Conditions and any updates. If
              you do not agree, do not use the service.
            </Text>
          </View>

          {/* Service Use */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>2. Service Use</Text>
            <Text style={styles.sectionText}>
              CommunitySync is provided for barangay residents and authorized staff to request,
              track, and receive barangay documents. You must use the system only for lawful personal
              or official barangay purposes.
            </Text>
          </View>

          {/* User Responsibilities */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>3. User Responsibilities</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletText}>
                • Provide accurate and current personal information
              </Text>
              <Text style={styles.bulletText}>• Keep your login details secure</Text>
              <Text style={styles.bulletText}>• Do not share your account with others</Text>
              <Text style={styles.bulletText}>
                • Notify barangay support immediately if you suspect unauthorized access
              </Text>
            </View>
          </View>

          {/* Prohibited Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>4. Prohibited Actions</Text>
            <Text style={styles.sectionText}>You may not:</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletText}>• Submit false or misleading information</Text>
              <Text style={styles.bulletText}>• Access or modify other users' data</Text>
              <Text style={styles.bulletText}>
                • Use the system to harass, defraud, or infringe rights
              </Text>
              <Text style={styles.bulletText}>• Attempt to bypass security controls</Text>
            </View>
          </View>

          {/* Document Requests */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>5. Document Requests</Text>
            <Text style={styles.sectionText}>
              Request approvals, payments, and issuance are subject to barangay rules, availability,
              and verification. CommunitySync is not responsible for delays outside system control.
            </Text>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>6. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              All content, branding, and materials in CommunitySync belong to the barangay and its
              licensors. You may not copy, reproduce, or distribute system content without permission.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>7. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              CommunitySync is provided "as is." The barangay is not liable for incidental or
              consequential damages from system use, including errors, outages, or lost data.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>8. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              The barangay may update these Terms from time to time. Continued use after changes
              means you accept the new terms.
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>9. Contact</Text>
            <Text style={styles.sectionText}>
              For questions or concerns, contact barangay support at the provided service channels.
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Footer Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
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
    marginBottom: 20,
  },
  sectionNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
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
    marginLeft: 8,
  },
  bulletText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default TermsAndConditionsScreen;
