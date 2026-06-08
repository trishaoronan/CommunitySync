import { useDocumentRequests } from "@/hooks/use-document-requests";
import {
    formatDisplayDate,
    formatDisplayTime,
    formatDocumentType,
    formatRequestStatus,
} from "@/lib/documentRequests";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ActivityItem {
  id: string;
  title: string;
  document: string;
  status: string | null;
  date: string;
  time: string;
}

const ActivityHistoryScreen = () => {
  const router = useRouter();
  const { requests, isLoading, error } = useDocumentRequests();

  const activities: ActivityItem[] = requests.map((request) => ({
    id: request.id,
    title: "Requested A Document",
    document: formatDocumentType(request.document_type),
    status: request.request_status,
    date: formatDisplayDate(request.created_at),
    time: formatDisplayTime(request.created_at),
  }));

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Activity List */}
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#1976D2" />
            <Text style={styles.loadingText}>Loading activity...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You have no recent activity yet.
            </Text>
          </View>
        ) : (
          activities.map((activity) => {
            const statusColors = getStatusColors(activity.status);
            return (
              <View key={activity.id} style={styles.activityCard}>
                {/* Icon Container */}
                <View style={styles.activityIconContainer}>
                  <MaterialIcons name="description" size={32} color="#00695C" />
                </View>

                {/* Content */}
                <View style={styles.activityContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColors.background },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusColors.text },
                        ]}
                      >
                        {formatRequestStatus(activity.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.documentName}>{activity.document}</Text>

                  <View style={styles.detailsRow}>
                    <Text style={styles.dateTime}>
                      {activity.date}
                      {activity.time ? ` • ${activity.time}` : ""}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#B2E0D8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  documentName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  amount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  separator: {
    fontSize: 12,
    color: "#999",
  },
  dateTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
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
    borderRadius: 14,
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
    marginTop: 12,
    textAlign: "center",
  },
});

export default ActivityHistoryScreen;
