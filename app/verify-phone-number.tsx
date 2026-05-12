import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const VerifyPhoneNumberScreen = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else if (key === 'call') {
      if (phoneNumber.length < 10) {
        Alert.alert('Invalid', 'Please enter a valid phone number');
        return;
      }
      // Navigate to OTP verification screen
      router.push({
        pathname: '/verify-otp',
        params: { phoneNumber },
      });
    } else {
      if (phoneNumber.length < 15) {
        setPhoneNumber(phoneNumber + key);
      }
    }
  };

  const handleSendCode = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid', 'Please enter a valid phone number');
      return;
    }
    router.push({
      pathname: '/verify-otp',
      params: { phoneNumber },
    });
  };

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Verify Your Phone Number</Text>

        {/* Instruction */}
        <Text style={styles.instruction}>Enter your phone number:</Text>

        {/* Phone Input Field */}
        <TextInput
          style={styles.phoneInput}
          value={phoneNumber}
          placeholder="+63 9XX XXX XXXX"
          placeholderTextColor="#CCC"
          editable={false}
          keyboardType="phone-pad"
        />

        {/* Security Message */}
        <Text style={styles.securityMessage}>
          Verifying your identity help us protect your account
        </Text>

        {/* Shield Icon */}
        <View style={styles.shieldContainer}>
          <MaterialIcons name="verified-user" size={48} color="#1565C0" />
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          style={styles.sendCodeButton}
          onPress={handleSendCode}
          activeOpacity={0.8}
        >
          <Text style={styles.sendCodeButtonText}>Send Code</Text>
        </TouchableOpacity>

        {/* Custom Keypad */}
        <View style={styles.keypadContainer}>
          {/* Keypad Buttons */}
          <View style={styles.keypad}>
            {keypadButtons.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((button) => (
                  <TouchableOpacity
                    key={button}
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress(button)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadButtonText}>{button}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Backspace and Call Buttons */}
            <View style={styles.keypadRow}>
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => handleKeyPress('backspace')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="backspace" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.keypadButton, styles.callButton]}
                onPress={() => handleKeyPress('call')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="call" size={24} color="white" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => handleKeyPress('x')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  phoneInput: {
    borderWidth: 2,
    borderColor: '#1565C0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    fontWeight: '500',
  },
  securityMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  shieldContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sendCodeButton: {
    backgroundColor: '#A8CCEB',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendCodeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  keypad: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  keypadButton: {
    width: (width - 48 - 24 - 36) / 3,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keypadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: (width - 48 - 24 - 36) / 3,
  },
  callButtonText: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
});

export default VerifyPhoneNumberScreen;
