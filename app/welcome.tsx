import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push('/signin');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#EEF4FD', '#FDFFED']} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentWrapper}>
            {/* Welcome Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.neighborText}>Neighbor!</Text>
              <Text style={styles.subtitle}>Let's get you connected to your community</Text>
            </View>

            {/* Hero Image */}
            <View style={styles.heroContainer}>
              <MaterialCommunityIcons name="account-multiple" size={120} color="#4A90E2" />
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6BB1F2', '#4A90E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Create an Account →</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  contentWrapper: {
    gap: 24,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
  headerContainer: {
    marginBottom: 0,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D3E50',
    lineHeight: 40,
    marginBottom: 4,
  },
  neighborText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#8BA3D1',
    lineHeight: 18,
    textAlign: 'center',
  },
  heroContainer: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  createAccountButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 0,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#666666',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
