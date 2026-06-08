import { useDocumentRequests } from "@/hooks/use-document-requests";
import {
    buildReferenceNumber,
    formatDisplayDate,
    formatDocumentType,
    formatRequestStatus,
} from "@/lib/documentRequests";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface RequestItem {
  id: string;
  title: string;
  referenceNumber: string;
  dateRequested: string;
  status: string | null;
}

const TrackRequestScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("request");
  const { requests, isLoading, error } = useDocumentRequests();

  const requestItems: RequestItem[] = requests.map((request) => ({
    id: request.id,
    title: formatDocumentType(request.document_type),
    referenceNumber: buildReferenceNumber(request.id),
    dateRequested: formatDisplayDate(request.created_at),
    status: request.request_status,
  }));

  const handleBackPress = () => {
    router.back();
  };

  const handleRequestCardPress = (request: RequestItem) => {
    router.push({
      pathname: "/track-request-detail",
      params: {
        requestId: request.id,
        title: request.title,
        referenceNumber: request.referenceNumber,
        dateRequested: request.dateRequested,
        status: request.status,
      },
    });
  };

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

  const renderRequestCard = ({ item }: { item: RequestItem }) => {
    const statusColors = getStatusColors(item.status);

    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => handleRequestCardPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="description" size={28} color="#FFA500" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.requestTitle}>{item.title}</Text>
          <Text style={styles.referenceNumber}>{item.referenceNumber}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.dateRequested}>{item.dateRequested}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors.background },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {formatRequestStatus(item.status)}
              </Text>
            </View>
          </View>
        </View>

        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (error) {
      return null;
    }

    if (isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color="#1976D2" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No requests submitted yet.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Request</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Request List */}
      <FlatList
        data={requestItems}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flex: 1,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  requestCard: {
    backgroundColor: "#FFFACD",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  referenceNumber: {
    fontSize: 12,
    color: "#C4A000",
    fontWeight: "500",
    marginBottom: 2,
  },
  dateRequested: {
    fontSize: 12,
    color: "#999",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  loadingState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
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

export default TrackRequestScreen;
