import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginCredentialsScreen = () => {
  const router = useRouter();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditPhone = () => {
    // TODO: Navigate to edit phone screen
    alert('Edit phone - Coming soon');
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    alert('Change password - Coming soon');
  };

  const handleBiometricToggle = () => {
    setIsBiometricEnabled(!isBiometricEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login Credentials</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Credentials Card */}
        <View style={styles.credentialsCard}>
          {/* Phone Number Section */}
          <View style={styles.credentialRow}>
            <View style={styles.credentialLeft}>
              <Text style={styles.credentialLabel}>Phone Number:</Text>
              <Text style={styles.credentialValue}>+63 91X XXX XXXX</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPhone}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Password Section */}
          <View style={styles.credentialRow}>
            <View style={styles.credentialLeft}>
              <Text style={styles.credentialLabel}>Password</Text>
              <Text style={styles.credentialValue}>••••••••••••</Text>
            </View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangePassword}
              activeOpacity={0.7}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Biometric Login Section */}
          <View style={styles.biometricRow}>
            <View style={styles.biometricLeft}>
              <Text style={styles.credentialLabel}>Biometric Login</Text>
            </View>
            <Switch
              value={isBiometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#DDD', true: '#A8CCEB' }}
              thumbColor={isBiometricEnabled ? '#1565C0' : '#FFF'}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  credentialsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  credentialLeft: {
    flex: 1,
  },
  credentialLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  credentialValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  editButton: {
    backgroundColor: '#A8CCEB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
  },
  changeButton: {
    backgroundColor: '#A8CCEB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 8,
  },
  biometricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  biometricLeft: {
    flex: 1,
  },
});

export default LoginCredentialsScreen;
