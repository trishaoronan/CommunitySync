import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatWithUsBubble } from "@/components/chat-with-us-bubble";

const HelpCenterScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleCallPress = async () => {
    try {
      const phoneNumber = "tel:+639238412342"; // Replace with actual support number
      const canOpen = await Linking.canOpenURL(phoneNumber);
      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        alert("Unable to open phone dialer");
      }
    } catch {
      alert("Error opening phone dialer");
    }
  };

  const handleEmailPress = async () => {
    try {
      const email = "support@communitysync.com"; // Replace with actual support email
      const emailURL = `mailto:${email}?subject=CommunitySync Support&body=Hello, I need help with...`;
      const canOpen = await Linking.canOpenURL(emailURL);
      if (canOpen) {
        await Linking.openURL(emailURL);
      } else {
        alert("Unable to open email client");
      }
    } catch {
      alert("Error opening email client");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Gradient Background */}
      <LinearGradient
        colors={["#FFFACD", "#F5F5DC", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Illustration Placeholder */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../assets/pics/help.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Main Heading */}
        <Text style={styles.mainHeading}>How can we help you today?</Text>

        {/* Contact Options */}
        <View style={styles.contactOptionsContainer}>
          {/* Chat with us */}
          <ChatWithUsBubble
            containerStyle={styles.contactOption}
            buttonStyle={styles.circleButton}
            labelStyle={styles.contactOptionText}
            imageStyle={styles.iconImage}
          />

          {/* Call us */}
          <TouchableOpacity
            style={styles.contactOption}
            onPress={handleCallPress}
            activeOpacity={0.7}
          >
            <View style={styles.circleButton}>
              <MaterialIcons name="phone" size={32} color="#5A7FA3" />
            </View>
            <Text style={styles.contactOptionText}>Call us</Text>
          </TouchableOpacity>

          {/* Email us */}
          <TouchableOpacity
            style={styles.contactOption}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.circleButton}>
              <MaterialIcons name="mail" size={32} color="#5A7FA3" />
            </View>
            <Text style={styles.contactOptionText}>Email us</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Select how you&apos;d like to contact us—we&apos;re here to help.
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFACD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 240,
    marginBottom: 30,
    width: "100%",
  },
  illustration: {
    width: 280,
    height: 220,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A3A52",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
  },
  contactOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 40,
  },
  contactOption: {
    alignItems: "center",
    flex: 1,
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  contactOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});

export default HelpCenterScreen;
