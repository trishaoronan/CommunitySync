import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SettingsItem {
  id: string;
  label: string;
  icon: string;
  iconType: "material" | "ionicon";
}

const SettingsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");

  const accountSettings: SettingsItem[] = [
    { id: "1", label: "Edit Profile", icon: "edit", iconType: "material" },
    {
      id: "2",
      label: "Verify Phone Number",
      icon: "call",
      iconType: "material",
    },
    { id: "3", label: "My Request", icon: "description", iconType: "material" },
    {
      id: "4",
      label: "Login Credentials",
      icon: "vpn-key",
      iconType: "material",
    },
  ];

  const privacySettings: SettingsItem[] = [
    { id: "5", label: "Change Password", icon: "lock", iconType: "material" },
    {
      id: "6",
      label: "Biometric Login",
      icon: "fingerprint",
      iconType: "material",
    },
    {
      id: "7",
      label: "Privacy Policy",
      icon: "privacy-tip",
      iconType: "material",
    },
    {
      id: "8",
      label: "Data & Storage",
      icon: "cloud-download",
      iconType: "material",
    },
  ];

  const generalSettings: SettingsItem[] = [
    { id: "9", label: "Language", icon: "public", iconType: "material" },
    {
      id: "10",
      label: "Terms & Conditions",
      icon: "description",
      iconType: "material",
    },
    { id: "11", label: "About", icon: "info", iconType: "material" },
  ];

  const handleSettingPress = (label: string) => {
    switch (label) {
      case "Edit Profile":
        router.push("/profile");
        break;
      case "Verify Phone Number":
        router.push("/verify-phone-number");
        break;
      case "My Request":
        router.push("/transaction-history");
        break;
      case "Login Credentials":
        router.push("/login-credentials");
        break;
      case "Change Password":
        router.push("/change-password");
        break;
      case "Biometric Login":
        router.push("/biometric-login");
        break;
      case "Data & Storage":
        router.push("/data-storage");
        break;
      case "Privacy Policy":
        router.push("/privacy-policy");
        break;
      case "Terms & Conditions":
        router.push("/terms-and-conditions");
        break;
      case "Language":
        router.push("/language-settings");
        break;
      case "About":
        router.push("/about");
        break;
      default:
        alert(`${label} - Coming Soon`);
    }
  };

  const handleSignout = () => {
    alert("Sign Out");
    // TODO: Clear user data and navigate to welcome screen
    router.push("/flow");
  };

  const renderIcon = (icon: string, iconType: string) => {
    if (iconType === "material") {
      return <MaterialIcons name={icon as any} size={24} color="#333" />;
    }
    return <Ionicons name={icon as any} size={24} color="#333" />;
  };

  const renderSettingItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => handleSettingPress(item.label)}
    >
      <View style={styles.settingItemContent}>
        {renderIcon(item.icon, item.iconType)}
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: SettingsItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < items.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Settings Card */}
        <View style={styles.settingsCard}>
          {/* Account Settings Section */}
          {renderSection("Account Settings", accountSettings)}

          <View style={styles.sectionDivider} />

          {/* Privacy & Security Section */}
          {renderSection("Privacy & Security", privacySettings)}

          <View style={styles.sectionDivider} />

          {/* General Section */}
          {renderSection("General", generalSettings)}

          <View style={styles.sectionDivider} />

          {/* Signout Button */}
          <TouchableOpacity style={styles.signoutItem} onPress={handleSignout}>
            <View style={styles.settingItemContent}>
              <View style={styles.signoutIconContainer}>
                <MaterialIcons name="logout" size={24} color="#FFF" />
              </View>
              <Text style={styles.signoutLabel}>Signout</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === "home" && styles.navItemActive]}
          onPress={() => {
            setActiveTab("home");
            router.push("/resident-dashboard");
          }}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === "home" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "request" && styles.navItemActive,
          ]}
          onPress={() => {
            setActiveTab("request");
            router.push("/document-form");
          }}
        >
          <MaterialIcons
            name="description"
            size={24}
            color={activeTab === "request" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "request" && styles.navLabelActive,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "profile" && styles.navItemActive,
          ]}
          onPress={() => {
            setActiveTab("profile");
            router.push("/profile");
          }}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={activeTab === "profile" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile" && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "settings" && styles.navItemActive,
          ]}
          onPress={() => setActiveTab("settings")}
        >
          <MaterialIcons
            name="settings"
            size={24}
            color={activeTab === "settings" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "settings" && styles.navLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Settings Card
  settingsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  // Section
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sectionContent: {},
  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },

  // Setting Item
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },

  // Signout Button
  signoutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#E53935",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  signoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  signoutLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 12,
  },

  // Bottom Navigation
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: "#1976D2",
  },
  navLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#1976D2",
    fontWeight: "600",
  },
});

export default SettingsScreen;
