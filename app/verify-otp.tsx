import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const VerifyOTPScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);

  const handleBackPress = () => {
    router.back();
  };

  const handleOtpChange = (value: string, index: number) => {
    const numValue = value.replace(/[^0-9]/g, "");

    if (numValue.length > 1) {
      // Handle paste
      const otpArray = numValue.split("").slice(0, 6);
      const newOtp = [...otp];
      otpArray.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus on next available input or last input
      const nextIndex = Math.min(index + otpArray.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = numValue;
      setOtp(newOtp);

      // Move to next input if value entered
      if (numValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Invalid", "Please enter the complete 6-digit code");
      return;
    }

    // Mock verification
    Alert.alert("Success", "Phone number verified successfully!");
    router.push("/login-credentials");
  };

  const handleResend = () => {
    Alert.alert("Code Sent", "A new code has been sent to your phone");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify It&apos;s you</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Instruction */}
        <Text style={styles.instruction}>
          Enter the one-time code we sent to
        </Text>
        <Text style={styles.phoneDisplay}>{phoneNumber}</Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              placeholder="-"
              placeholderTextColor="#CCC"
              contextMenuHidden
            />
          ))}
        </View>

        {/* Didn't get a code link */}
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendLink}>Didn&apos;t get a code?</Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["*", "0", "#"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((button) => (
                <TouchableOpacity
                  key={button}
                  style={styles.keypadButton}
                  onPress={() => {
                    const emptyIndex = otp.findIndex((digit) => digit === "");
                    if (emptyIndex !== -1) {
                      handleOtpChange(button, emptyIndex);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keypadButtonText}>{button}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Control buttons */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => {
                const lastFilledIndex = otp
                  .map((digit, i) => (digit ? i : -1))
                  .filter((i) => i !== -1)
                  .pop();
                if (lastFilledIndex !== undefined) {
                  const newOtp = [...otp];
                  newOtp[lastFilledIndex] = "";
                  setOtp(newOtp);
                }
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="backspace" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.keypadButton, styles.verifyKeypadButton]}
              onPress={handleVerify}
              activeOpacity={0.7}
            >
              <MaterialIcons name="check" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => setOtp(["", "", "", "", "", ""])}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  phoneDisplay: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1565C0",
    textAlign: "center",
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: "15%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#DDD",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1565C0",
  },
  resendLink: {
    fontSize: 14,
    color: "#1565C0",
    textAlign: "center",
    marginBottom: 24,
    textDecorationLine: "underline",
  },
  verifyButton: {
    backgroundColor: "#A8CCEB",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
  },
  keypadContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  keypad: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 12,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  keypadButton: {
    width: (width - 32 - 24 - 36) / 3,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keypadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  verifyKeypadButton: {
    backgroundColor: "#1565C0",
  },
});

export default VerifyOTPScreen;
