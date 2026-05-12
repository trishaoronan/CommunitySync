import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleChangePassword = () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (!newPassword) {
      Alert.alert('Error', 'Please enter your new password');
      return;
    }
    if (!confirmPassword) {
      Alert.alert('Error', 'Please confirm your new password');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    // Mock password change
    setIsSuccess(true);
  };

  const handleBackToSettings = () => {
    router.back();
  };

  const isPasswordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isFormValid = currentPassword && newPassword && confirmPassword && isPasswordsMatch;

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Your Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.successContainer}>
          {/* Password Icon/Image */}
          <Image
            source={require('../assets/pics/password.png')}
            style={styles.passwordImage}
          />

          {/* Success Message */}
          <Text style={styles.successTitle}>Password changed successfully.</Text>
          <Text style={styles.successSubtitle}>
            You can now log in using your new password.
          </Text>

          {/* Back to Login Button */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={handleBackToSettings}
            activeOpacity={0.8}
          >
            <Text style={styles.backToLoginButtonText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Your Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Current Password<Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter current password"
              placeholderTextColor="#CCC"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showCurrentPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            New Password<Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor="#CCC"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showNewPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Confirm New Password<Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor="#CCC"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Match Warning */}
        {newPassword && confirmPassword && !isPasswordsMatch && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Passwords do not match</Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            When you change your password, you will be logged out of all other device.
          </Text>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => alert('Forgot Password - Coming Soon')}>
          <Text style={styles.forgotPasswordLink}>I forgot my password</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Change Password Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.changePasswordButton,
            !isFormValid && styles.changePasswordButtonDisabled,
          ]}
          onPress={handleChangePassword}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#E91E63',
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1565C0',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  warningBox: {
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: '#E91E63',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#FFFACD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  forgotPasswordLink: {
    fontSize: 14,
    color: '#1565C0',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  changePasswordButton: {
    backgroundColor: '#6FA8DC',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  changePasswordButtonDisabled: {
    opacity: 0.5,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  checkmarkCircle: {
    marginBottom: 24,
  },
  passwordImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
    borderRadius: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  backToLoginButton: {
    backgroundColor: '#6FA8DC',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backToLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ChangePasswordScreen;
