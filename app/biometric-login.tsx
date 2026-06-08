import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BiometricLoginScreen = () => {
  const router = useRouter();
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEnableBiometric = () => {
    setShowBiometricModal(true);
    setIsScanning(true);

    // Simulate biometric scanning
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleConfirmBiometric = () => {
    setShowBiometricModal(false);
    setIsScanning(false);
    Alert.alert("Success", "Biometric login has been enabled!");
    router.back();
  };

  const handleCancelBiometric = () => {
    setShowBiometricModal(false);
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biometric Login</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Enable Biometric login?</Text>

        {/* Images Container */}
        <View style={styles.imagesContainer}>
          {/* Biometric Icon */}
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/pics/biometric.png")}
              style={styles.biometricImage}
            />
          </View>

          {/* Password Icon */}
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/pics/password.png")}
              style={styles.passwordImage}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Biometric login allows you to log in using facial or fingerprint
          recognition. You can change this option at any point{" "}
          <Text style={styles.boldText}>
            Profile &gt; Privacy &amp; security screen
          </Text>
        </Text>

        {/* Enable Button */}
        <TouchableOpacity
          style={styles.enableButton}
          onPress={handleEnableBiometric}
          activeOpacity={0.8}
        >
          <Text style={styles.enableButtonText}>Enable</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showBiometricModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelBiometric}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.biometricModal}>
            {/* Fingerprint Icon */}
            <View style={styles.fingerprintContainer}>
              <MaterialIcons name="fingerprint" size={64} color="#1565C0" />
            </View>

            {/* Text */}
            <Text style={styles.modalTitle}>
              {isScanning ? "Scanning..." : "Touch the fingerprint sensor"}
            </Text>

            {/* Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelBiometric}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {!isScanning && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmBiometric}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginVertical: 32,
  },
  imageWrapper: {
    alignItems: "center",
  },
  biometricImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
  },
  passwordImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  boldText: {
    fontWeight: "700",
    color: "#333",
  },
  enableButton: {
    backgroundColor: "#6FA8DC",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  biometricModal: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fingerprintContainer: {
    marginBottom: 24,
  },
  scanningAnimation: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#1565C0",
    fontWeight: "600",
    textAlign: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#6FA8DC",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BiometricLoginScreen;
