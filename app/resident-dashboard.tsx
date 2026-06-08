import { useDocumentRequests } from "@/hooks/use-document-requests";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatDocumentType,
    formatRequestStatus,
} from "@/lib/documentRequests";
import { supabase } from "@/lib/supabase";
import type { DocumentRequest, Profile } from "@/types/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

interface ActivityItem {
  id: string;
  title: string;
  document: string;
  status: string | null;
  date: string;
  time: string;
}

type DashboardProfile = Profile;

const ResidentDashboard = () => {
  const router = useRouter();
  const { toast } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  const {
    requests,
    isLoading: isFetchingRequests,
    error: requestError,
  } = useDocumentRequests();
  const [hasShownToast, setHasShownToast] = useState(false);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsProfileLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (!isMounted) return;

      if (sessionError || !sessionData.session) {
        console.error("Dashboard profile fetch — no session:", sessionError);
        setProfile(null);
        setIsProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error("Profile Fetch Error:", error);
        setProfile(null);
      } else {
        setProfile(data as DashboardProfile);
      }

      setIsProfileLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const toastValue = Array.isArray(toast) ? toast[0] : toast;
    if (toastValue && !hasShownToast) {
      const isSignup = toastValue === "signup";
      Toast.show({
        type: "success",
        text1: isSignup ? "Welcome" : "Welcome back",
        text2: isSignup ? "Your account is ready." : "Signed in successfully.",
      });
      setHasShownToast(true);
    }
  }, [toast, hasShownToast]);

  const getStatusColors = (status: string | null | undefined) => {
    switch (status) {
      case "approved":
      case "released":
      case "completed":
        return { background: "#C8E6C9", text: "#2E7D32" };
      case "rejected":
        return { background: "#FFCDD2", text: "#C62828" };
      case "pending":
      default:
        return { background: "#FFE0B2", text: "#EF6C00" };
    }
  };

  const profileName =
    profile?.full_name?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  const headerName = isProfileLoading
    ? "Loading..."
    : profileName || "Resident";
  const headerEmail = isProfileLoading ? "" : (profile?.email ?? "");

  const recentActivities: ActivityItem[] = requests
    .slice(0, 2)
    .map((request) => ({
      id: request.id,
      title: "Requested Document",
      document: formatDocumentType(request.document_type),
      status: request.request_status,
      date: formatDisplayDate(request.created_at),
      time: formatDisplayTime(request.created_at),
    }));

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        You haven&apos;t submitted any requests yet.
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/document-form")}
      >
        <Text style={styles.emptyStateButtonText}>Create New Request</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRequestItem = ({ item }: { item: DocumentRequest }) => {
    const statusColors = getStatusColors(item.request_status);
    const statusLabel = formatRequestStatus(item.request_status);

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>
            {formatDocumentType(item.document_type)}
          </Text>
          <Text style={styles.requestDate}>
            Submitted {formatDisplayDate(item.created_at)}
          </Text>
        </View>
        <View
          style={[
            styles.requestStatusBadge,
            { backgroundColor: statusColors.background },
          ]}
        >
          <Text
            style={[styles.requestStatusText, { color: statusColors.text }]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#FFF9C4", "#B2DFDB", "#80DEEA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Notification Bell Icon */}
          <TouchableOpacity
            style={styles.bellIconButton}
            onPress={() => router.push("/notifications")}
          >
            <Image
              source={require("@/assets/pics/notifs.png")}
              style={styles.bellIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={require("../assets/pics/cat.png")}
                style={styles.profileImage}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{headerName}</Text>
                <MaterialIcons name="verified" size={20} color="#1976D2" />
              </View>
              <Text style={styles.profileEmail}>{headerEmail}</Text>
              <View style={styles.residenceTag}>
                <Text style={styles.residenceText}>Verified Resident</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
          >
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push("/document-form")}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require("../assets/pics/document.png")}
                  style={styles.quickActionIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>Request{"\n"}Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push("/transaction-history")}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require("../assets/pics/transaction.png")}
                  style={styles.quickActionIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>
                Transaction{"\n"}History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => {
                setActiveTab("request");
                router.push("/track-request");
              }}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require("../assets/pics/track-request.png")}
                  style={[styles.quickActionIcon, styles.trackRequestIcon]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>Track{"\n"}Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push("/help-center")}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require("../assets/pics/chatbot.png")}
                  style={styles.quickActionIcon}
                />
              </View>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* My Requests Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Requests</Text>
          </View>

          {isFetchingRequests ? (
            <View style={styles.requestsLoading}>
              <ActivityIndicator size="small" color="#1976D2" />
              <Text style={styles.requestsLoadingText}>
                Loading requests...
              </Text>
            </View>
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              renderItem={renderRequestItem}
              scrollEnabled={false}
              ListEmptyComponent={requestError ? null : renderEmptyState}
            />
          )}

          {requestError && !isFetchingRequests && (
            <Text style={styles.requestErrorText}>{requestError}</Text>
          )}
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/activity-history")}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="chevron-right" size={20} color="#1976D2" />
            </TouchableOpacity>
          </View>

          {isFetchingRequests ? (
            <View style={styles.requestsLoading}>
              <ActivityIndicator size="small" color="#1976D2" />
              <Text style={styles.requestsLoadingText}>
                Loading activity...
              </Text>
            </View>
          ) : recentActivities.length === 0 ? (
            <View style={styles.activityEmptyState}>
              <Text style={styles.activityEmptyText}>
                No recent activity yet.
              </Text>
            </View>
          ) : (
            recentActivities.map((activity) => {
              const statusColors = getStatusColors(activity.status);
              return (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityIconContainer}>
                    <View style={styles.activityIconInner}>
                      <MaterialIcons
                        name="description"
                        size={26}
                        color="#00897B"
                      />
                    </View>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDocument}>
                      {activity.document}
                    </Text>
                    <Text style={styles.activityDateTime}>
                      {activity.date}
                      {activity.time ? ` • ${activity.time}` : ""}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors.background },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusColors.text }]}
                    >
                      {formatRequestStatus(activity.status)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <LinearGradient
        colors={["#80DEEA", "#81C784", "#FFF9C4"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomNavigationGradient}
      >
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === "home" && styles.navItemActive,
            ]}
            onPress={() => setActiveTab("home")}
          >
            <MaterialIcons
              name="home"
              size={24}
              color={activeTab === "home" ? "#1565C0" : "#666"}
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
              color={activeTab === "request" ? "#1565C0" : "#666"}
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
              color={activeTab === "profile" ? "#1565C0" : "#666"}
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
              color={activeTab === "settings" ? "#1565C0" : "#666"}
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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bellIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "flex-end",
  },
  bellIconImage: {
    width: 24,
    height: 24,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageWrapper: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 6,
  },
  profileEmail: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  residenceTag: {
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  residenceText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
  },
  quickActionsScroll: {
    paddingHorizontal: 12,
  },
  quickActionCard: {
    width: 100,
    marginHorizontal: 8,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  trackRequestIcon: {
    width: 62,
    height: 62,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: 14,
  },

  // Sections
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
  },
  requestsLoading: {
    alignItems: "center",
    paddingVertical: 12,
  },
  requestsLoadingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  requestCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: "#666",
  },
  requestStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  requestStatusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  requestErrorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  emptyState: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  emptyStateButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFF",
  },

  // Documents
  documentCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  documentIconContainer: {
    marginRight: 12,
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFEB3B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FBC02D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  documentIconInner: {
    position: "relative",
    width: 32,
    height: 32,
  },
  documentCheckmark: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  downloadButton: {
    flexDirection: "row",
    backgroundColor: "#FFEB3B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  // Activity
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B2DFDB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  activityIconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  activityDocument: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  activityDateTime: {
    fontSize: 11,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  activityEmptyState: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  activityEmptyText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  // Bottom Navigation
  bottomNavigationGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {},
  navLabel: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#1565C0",
    fontWeight: "600",
  },

  bottomPadding: {
    height: 80,
  },
});

export default ResidentDashboard;
