import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentSuccessScreen = () => {
  const router = useRouter();

  const handleCheckStatus = () => {
    router.push('/track-request');
  };

  const handleBackToHome = () => {
    router.push('/resident-dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackToHome}>
          <MaterialIcons name="chevron-left" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Celebration Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/pics/boy-hooray.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Thank You Message */}
        <Text style={styles.thankYouText}>Thank you for your Request!</Text>

        {/* Additional Message */}
        <Text style={styles.subText}>
          Your payment has been submitted successfully. You can track your request below.
        </Text>
      </View>

      {/* Check Status Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.checkStatusButtonWrapper}
          onPress={handleCheckStatus}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFE082', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkStatusButton}
          >
            <Text style={styles.checkStatusButtonText}>Check Status</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  illustrationContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  thankYouText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 20,
  },
  checkStatusButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFD54F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkStatusButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkStatusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default PaymentSuccessScreen;
