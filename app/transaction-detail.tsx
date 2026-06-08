import {
    buildReferenceNumber,
    formatDisplayDate,
    formatDocumentType,
    formatPaymentStatus,
    formatRequestStatus,
} from "@/lib/documentRequests";
import { supabase } from "@/lib/supabase";
import type { DocumentRequest } from "@/types/database";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const parseRequestDetails = (value: unknown) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, any>;
    } catch {
      return {};
    }
  }
  if (typeof value === "object") {
    return value as Record<string, any>;
  }
  return {};
};

const formatFieldLabel = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatPreviewValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getRequestStatusColor = (status: string) => {
  switch (status) {
    case "released":
    case "completed":
    case "approved":
      return "#10B981";
    case "rejected":
      return "#EF4444";
    case "pending":
    default:
      return "#F59E0B";
  }
};

const getRequestStatusIcon = (status: string) => {
  switch (status) {
    case "released":
    case "completed":
    case "approved":
      return "check-circle";
    case "rejected":
      return "cancel";
    case "pending":
    default:
      return "schedule";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "#10B981";
    case "pending":
      return "#F59E0B";
    case "unpaid":
    case "failed":
    case "refunded":
    default:
      return "#9CA3AF";
  }
};

export default function TransactionDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestIdParam =
    params.requestId ?? params.request_id ?? params.id ?? params.requestId;
  const requestId = Array.isArray(requestIdParam)
    ? requestIdParam[0]
    : requestIdParam;

  const [requestData, setRequestData] = useState<DocumentRequest | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRequest = async () => {
      if (!requestId) return;

      setIsRequestLoading(true);

      const { data, error } = await supabase
        .from("document_requests")
        .select(
          "id, document_type, request_status, payment_status, request_details, released_pdf_url, created_at",
        )
        .eq("id", requestId)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setRequestError(
          error?.message || "Unable to load this request. Please try again.",
        );
        setRequestData(null);
        setIsRequestLoading(false);
        return;
      }

      setRequestError(null);
      setRequestData(data as DocumentRequest);
      setIsRequestLoading(false);
    };

    void loadRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const requestDetails = parseRequestDetails(
    requestData?.request_details ?? params.requestDetails,
  );
  const requestStatusParam = (params.requestStatus as string) || "";
  const paymentStatusParam = (params.paymentStatus as string) || "";

  const documentTitle = requestData?.document_type
    ? formatDocumentType(requestData.document_type)
    : (params.name as string) || "Business Permit";
  const requestStatus =
    (requestData?.request_status ?? requestStatusParam) || "";
  const paymentStatus =
    (requestData?.payment_status ?? paymentStatusParam) || "";
  const paymentStatusLabel = paymentStatus
    ? formatPaymentStatus(paymentStatus)
    : "Unpaid";
  const referenceNumber = requestData?.id
    ? buildReferenceNumber(requestData.id)
    : (params.refNumber as string) || "REQ-2026-1234";
  const paymentDate = requestData?.created_at
    ? formatDisplayDate(requestData.created_at)
    : (params.dateRequested as string) || "March 15, 2026";
  const amountPaid = (params.amount as string) || "50.00";
  const recipient =
    (params.recipient as string) || "Pulong Buhangin, Santa Maria";
  const releasedPdfUrl =
    requestData?.released_pdf_url || (params.releasedPdfUrl as string) || "";

  const canDownload =
    Boolean(releasedPdfUrl) &&
    ["released", "completed"].includes(requestStatus);

  const handleDownloadPDF = async () => {
    if (!releasedPdfUrl) {
      Alert.alert(
        "Document not ready",
        "No released document is available yet.",
      );
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(releasedPdfUrl);
      if (!canOpen) {
        Alert.alert("Unable to open file", "Please try again later.");
        return;
      }

      await Linking.openURL(releasedPdfUrl);
    } catch (error) {
      console.error(error);
      Alert.alert("Download failed", "Unable to open the document link.");
    }
  };

  const handleTrackRequest = () => {
    const resolvedRequestId = requestId || requestData?.id;

    if (resolvedRequestId) {
      router.push({
        pathname: "/track-request-detail",
        params: {
          requestId: resolvedRequestId,
          title: documentTitle,
          referenceNumber,
          dateRequested: paymentDate,
          status: requestStatus,
          paymentStatus,
        },
      });
      return;
    }

    router.push("/track-request");
  };

  const statusBadgeColor = getRequestStatusColor(requestStatus || "pending");
  const paymentBadgeColor = getPaymentStatusColor(paymentStatus || "unpaid");
  const statusText = formatRequestStatus(requestStatus);

  const previewEntries = Object.entries(requestDetails || {});

  return (
    <LinearGradient colors={["#EEF4FD", "#FDFFED"]} style={styles.background}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isPreviewModalVisible}
        onRequestClose={() => setIsPreviewModalVisible(false)}
      >
        <LinearGradient
          colors={["#EEF4FD", "#FDFFED"]}
          style={styles.background}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsPreviewModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#2D3E50" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Form Preview</Text>
              <View style={styles.closeButton} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.previewCard}>
                <Text style={styles.previewCardTitle}>{documentTitle}</Text>
                <Text style={styles.previewCardSubtitle}>
                  Submitted Information
                </Text>
              </View>

              <View style={styles.formFieldsContainer}>
                {previewEntries.length === 0 ? (
                  <View style={styles.emptyPreview}>
                    <Text style={styles.emptyPreviewText}>
                      No submitted details available.
                    </Text>
                  </View>
                ) : (
                  previewEntries.map(([key, value]) => (
                    <View key={key} style={styles.formFieldPreview}>
                      <Text style={styles.formFieldLabel}>
                        {formatFieldLabel(key)}
                      </Text>
                      <Text style={styles.formFieldValue}>
                        {formatPreviewValue(value)}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </Modal>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#2D3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isRequestLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color="#1976D2" />
              <Text style={styles.loadingText}>Loading request...</Text>
            </View>
          ) : null}

          {requestError ? (
            <View style={styles.errorState}>
              <Text style={styles.errorText}>{requestError}</Text>
            </View>
          ) : null}

          <View style={styles.mainCard}>
            <Text style={styles.documentTitle}>{documentTitle}</Text>

            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusBadgeColor },
                ]}
              >
                <MaterialIcons
                  name={getRequestStatusIcon(requestStatus || "pending")}
                  size={16}
                  color="white"
                />
                <Text style={styles.badgeText}>{statusText}</Text>
              </View>
            </View>

            <View style={styles.paymentSummaryBox}>
              <Text style={styles.paymentMethodText}>
                {paymentStatus
                  ? `Payment Status: ${paymentStatusLabel}`
                  : "Payment Status: Unpaid"}
              </Text>
              <Text style={styles.referenceText}>
                Ref No. {referenceNumber}
              </Text>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.detailsSectionTitle}>
                Transaction Details
              </Text>
              <View style={styles.detailsDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Date</Text>
                <Text style={styles.detailValue}>{paymentDate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Paid</Text>
                <Text style={styles.detailValue}>₱ {amountPaid}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: `${paymentBadgeColor}20` },
                  ]}
                >
                  <MaterialIcons
                    name={
                      paymentStatus === "paid" ? "check-circle" : "schedule"
                    }
                    size={14}
                    color={paymentBadgeColor}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: paymentBadgeColor },
                    ]}
                  >
                    {paymentStatusLabel}
                  </Text>
                </View>
              </View>

              <View style={[styles.detailRow, styles.lastDetailRow]}>
                <Text style={styles.detailLabel}>Recipient</Text>
                <Text style={styles.detailValue}>{recipient}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={handleTrackRequest}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#A5D6FF", "#8FC8FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.trackButtonGradient}
                >
                  <Text style={styles.trackButtonText}>Track Request</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  !canDownload && styles.downloadButtonDisabled,
                ]}
                onPress={canDownload ? handleDownloadPDF : undefined}
                disabled={!canDownload}
                activeOpacity={canDownload ? 0.8 : 1}
              >
                <MaterialIcons
                  name="download"
                  size={20}
                  color={canDownload ? "#4A5568" : "#9CA3AF"}
                />
                <Text
                  style={[
                    styles.downloadButtonText,
                    !canDownload && styles.downloadButtonTextDisabled,
                  ]}
                >
                  {canDownload ? "Download Document" : "Document Not Yet Released"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerSection}>
              <TouchableOpacity onPress={() => setIsPreviewModalVisible(true)}>
                <Text style={styles.previewLink}>Show Preview</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
    color: "#2D3E50",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingState: {
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  loadingText: {
    fontSize: 12,
    color: "#6B7280",
  },
  errorState: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    textAlign: "center",
  },
  mainCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  documentTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  paymentSummaryBox: {
    backgroundColor: "#FFFACD",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 13,
    color: "#666",
  },
  detailsSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3E50",
    marginBottom: 12,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  lastDetailRow: {
    marginBottom: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A202C",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  trackButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  trackButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3E50",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    backgroundColor: "white",
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },
  downloadButtonDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    opacity: 0.75,
  },
  downloadButtonTextDisabled: {
    color: "#9CA3AF",
  },
  footerSection: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    textAlign: "center",
  },
  previewLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3E50",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  previewCard: {
    backgroundColor: "#FFFACD",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  previewCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  previewCardSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
  },
  formFieldsContainer: {
    gap: 12,
  },
  formFieldPreview: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  formFieldValue: {
    fontSize: 14,
    color: "#111827",
  },
  emptyPreview: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  emptyPreviewText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
