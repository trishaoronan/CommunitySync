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

type DocumentRoute =
  | "/BarangayClearanceForm"
  | "/BusinessPermitForm"
  | "/BlotterIncidentReportForm"
  | "/BurialAssistanceForm"
  | "/CertificateOfResidencyForm"
  | "/CertificateOfIndigencyForm"
  | "/CertificateOfGoodMoralForm"
  | "/CertificateOfSoloParentForm"
  | "/BarangayIDForm"
  | "/CertificateOfLowIncomeForm"
  | "/CertificateOfNoDerogatoryRecordForm"
  | "/CertificateOfNonEmploymentForm"
  | "/other-document";

type DocumentOption = {
  label: string;
  route: DocumentRoute;
  fullWidth?: boolean;
};

const documentOptions: DocumentOption[] = [
  { label: "Barangay Clearance", route: "/BarangayClearanceForm" },
  { label: "Business Permit", route: "/BusinessPermitForm" },
  { label: "Blotter Report", route: "/BlotterIncidentReportForm" },
  { label: "Burial Assistance", route: "/BurialAssistanceForm" },
  { label: "Certificate of Residency", route: "/CertificateOfResidencyForm" },
  { label: "Certificate of Indigency", route: "/CertificateOfIndigencyForm" },
  { label: "Good Moral", route: "/CertificateOfGoodMoralForm" },
  { label: "Solo Parent", route: "/CertificateOfSoloParentForm" },
  { label: "Barangay ID", route: "/BarangayIDForm" },
  { label: "Certificate of Low Income", route: "/CertificateOfLowIncomeForm" },
  {
    label: "No Derogatory",
    route: "/CertificateOfNoDerogatoryRecordForm",
  },
  {
    label: "Non Employment Certificate",
    route: "/CertificateOfNonEmploymentForm",
  },
  { label: "Other Document", route: "/other-document", fullWidth: true },
];

const DocumentForm = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("request");

  const handlePress = (route: DocumentRoute) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request A Document</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Select a document to start your request
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {documentOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[styles.card, option.fullWidth && styles.cardFull]}
              onPress={() => handlePress(option.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
          onPress={() => {
            setActiveTab("settings");
            router.push("/settings");
          }}
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
    backgroundColor: "#F6F6F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F6F6F2",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  subtitle: {
    textAlign: "center",
    color: "#5A5A5A",
    fontSize: 13,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFF1B3",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  cardFull: {
    width: "62%",
    alignSelf: "center",
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F1F1F",
    textAlign: "center",
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
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

export default DocumentForm;
