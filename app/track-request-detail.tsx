import {
    buildReferenceNumber,
    formatDisplayDate,
    formatDisplayTime,
    formatDocumentType,
    formatPaymentStatus,
} from "@/lib/documentRequests";
import { supabase } from "@/lib/supabase";
import type { DocumentRequest } from "@/types/database";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  completed: boolean;
  isActive: boolean;
}

const buildTimelineTimestamp = (value: string | null | undefined) => {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  const dateLabel = formatDisplayDate(value);
  const timeLabel = formatDisplayTime(value);
  return timeLabel ? `${dateLabel} | ${timeLabel}` : dateLabel;
};

const TrackRequestDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestIdParam =
    params.requestId ?? params.id ?? params.request_id ?? params.requestId;
  const requestId = Array.isArray(requestIdParam)
    ? requestIdParam[0]
    : requestIdParam;

  const [requestData, setRequestData] = useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRequest = async () => {
      if (!requestId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error: requestError } = await supabase
        .from("document_requests")
        .select(
          "id, document_type, request_status, payment_status, request_details, released_pdf_url, created_at, updated_at",
        )
        .eq("id", requestId)
        .single();

      if (!isMounted) return;

      if (requestError || !data) {
        setError(
          requestError?.message ||
            "Unable to load this request. Please try again.",
        );
        setRequestData(null);
        setIsLoading(false);
        return;
      }

      setError(null);
      setRequestData(data as DocumentRequest);
      setIsLoading(false);
    };

    void loadRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const requestStatus =
    requestData?.request_status ?? ((params.status as string) || "pending");
  const paymentStatus =
    requestData?.payment_status ??
    ((params.paymentStatus as string) || "unpaid");

  const normalizedRequestStatus = requestStatus?.toLowerCase();
  const normalizedPaymentStatus = paymentStatus?.toLowerCase();

  const isPaid =
    normalizedPaymentStatus === "paid" ||
    normalizedPaymentStatus === "completed";
  const isPaymentPending = normalizedPaymentStatus === "pending";
  const isPendingStatus =
    normalizedRequestStatus === "pending" ||
    normalizedRequestStatus === "approved";
  const isRejected = normalizedRequestStatus === "rejected";
  const isReleased =
    normalizedRequestStatus === "released" ||
    normalizedRequestStatus === "completed";
  const isPendingActive = (isPendingStatus || isRejected) && !isReleased;
  const isPaidActive = !isPaid && !isPendingActive && !isReleased;

  const documentName = requestData?.document_type
    ? formatDocumentType(requestData.document_type)
    : (params.title as string) || "Barangay Clearance";
  const referenceNumber = requestData?.id
    ? buildReferenceNumber(requestData.id)
    : (params.referenceNumber as string) || "REQ-2026-1234";
  const dateRequested = requestData?.created_at
    ? formatDisplayDate(requestData.created_at)
    : (params.dateRequested as string) || "March 15, 2026";

  const requestDetails = (requestData?.request_details ?? {}) as Record<
    string,
    any
  >;
  const applicantName =
    requestDetails.fullName ||
    [requestDetails.firstName, requestDetails.lastName]
      .filter(Boolean)
      .join(" ") ||
    (params.applicantName as string) ||
    "Resident";
  const paymentMethod = paymentStatus
    ? `Payment: ${formatPaymentStatus(paymentStatus)}`
    : "Payment: Unpaid";
  const estimatedCompletion = isReleased
    ? "Completed"
    : (params.estimatedCompletion as string) || "2 - 3 Days";

  const submittedTimestamp = requestData?.created_at
    ? buildTimelineTimestamp(requestData.created_at)
    : (params.dateRequested as string) || "";
  const paidTimestamp = isPaid ? submittedTimestamp : "";
  const releasedTimestamp = isReleased
    ? buildTimelineTimestamp(requestData?.updated_at ?? requestData?.created_at)
    : "";

  const paidDescription = isPaid
    ? "Payment confirmed."
    : isPaymentPending
      ? "Payment pending confirmation."
      : "Waiting for payment.";
  const pendingDescription = isRejected
    ? "Request rejected. Please contact the barangay."
    : isReleased
      ? "Processing completed."
      : isPaid
        ? "Request pending for release."
        : "Awaiting payment before processing.";

  const timelineSteps: TimelineStep[] = [
    {
      id: "submitted",
      title: "Submitted",
      description: "Request received.",
      timestamp: submittedTimestamp,
      icon: "check-circle",
      completed: true,
      isActive: false,
    },
    {
      id: "paid",
      title: "Paid",
      description: paidDescription,
      timestamp: paidTimestamp,
      icon: "check-circle",
      completed: isPaid,
      isActive: isPaidActive,
    },
    {
      id: "pending",
      title: "Pending",
      description: pendingDescription,
      timestamp: "",
      icon: "search",
      completed: isReleased,
      isActive: isPendingActive,
    },
    {
      id: "released",
      title: "Released",
      description: isReleased
        ? "Document ready for pickup or download."
        : "Pending release.",
      timestamp: releasedTimestamp,
      icon: "download",
      completed: isReleased,
      isActive: isReleased,
    },
  ];

  const getIconColor = (step: TimelineStep): string => {
    if (step.completed) return "#4CAF50";
    if (step.isActive) return "#FF6F3C";
    return "#CCCCCC";
  };

  const getStepOpacity = (step: TimelineStep): number => {
    if (step.completed || step.isActive) return 1;
    return 0.5;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Request</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#1976D2" />
            <Text style={styles.loadingText}>Loading request...</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorState}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Summary Card - Yellow */}
        <View style={styles.summaryCardWrapper}>
          <LinearGradient
            colors={["#FFFACD", "#FFF9C4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryIconContainer}>
              <View style={styles.summaryIcon}>
                <MaterialIcons name="description" size={28} color="#FFA500" />
              </View>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>{documentName}</Text>
              <Text style={styles.summaryDetail}>
                Ref No. {referenceNumber}
              </Text>
              <Text style={styles.summaryDate}>{dateRequested}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {timelineSteps.map((step, index) => (
            <View
              key={step.id}
              style={[styles.timelineItem, { opacity: getStepOpacity(step) }]}
            >
              {/* Icon Circle */}
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIconCircle,
                    {
                      backgroundColor: getIconColor(step),
                    },
                  ]}
                >
                  {step.icon === "check-circle" && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                  {step.icon === "search" && (
                    <MaterialIcons
                      name="search"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                  {step.icon === "download" && (
                    <MaterialIcons
                      name="download"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                </View>

                {/* Vertical Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      {
                        backgroundColor: step.completed ? "#4CAF50" : "#E0E0E0",
                      },
                    ]}
                  />
                )}
              </View>

              {/* Step Content */}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{step.title}</Text>
                {step.description && (
                  <Text style={styles.timelineDescription}>
                    {step.description}
                  </Text>
                )}
                {step.timestamp && (
                  <Text style={styles.timelineTimestamp}>{step.timestamp}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Applicant:</Text>
            <Text style={styles.detailValue}>{applicantName}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment:</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Completion:</Text>
            <View style={styles.completionValueContainer}>
              <Text style={styles.detailValue}>{estimatedCompletion}</Text>
              <MaterialIcons
                name="event"
                size={16}
                color="#999"
                style={styles.calendarIcon}
              />
            </View>
          </View>
        </View>

        {/* Contact Barangay Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.contactButtonWrapper}
            onPress={() => router.push("/help-center")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FFE082", "#FFD54F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>Contact Barangay</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Download Document Button */}
          {(() => {
            const pdfUrl = requestData?.released_pdf_url ?? null;
            const canDownload = isReleased && Boolean(pdfUrl);
            return (
              <TouchableOpacity
                style={[styles.downloadButton, !canDownload && styles.downloadButtonDisabled]}
                onPress={() => { if (pdfUrl) void Linking.openURL(pdfUrl); }}
                disabled={!canDownload}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="download"
                  size={20}
                  color={canDownload ? "#FFFFFF" : "#9CA3AF"}
                />
                <Text style={[styles.downloadText, !canDownload && styles.downloadTextDisabled]}>
                  {canDownload ? "Download Document" : "Document Not Yet Released"}
                </Text>
              </TouchableOpacity>
            );
          })()}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    flex: 1,
  },
  loadingState: {
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  loadingText: {
    fontSize: 12,
    color: "#6B7280",
  },
  errorState: {
    backgroundColor: "#FEE2E2",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    textAlign: "center",
  },

  // Summary Card
  summaryCardWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  summaryIconContainer: {
    marginRight: 12,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  summaryDetail: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  summaryDate: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
  },

  // Timeline
  timelineContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: 16,
    width: 50,
  },
  timelineIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectorLine: {
    width: 3,
    height: 60,
    marginTop: -4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  timelineDescription: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: "#BDBDBD",
    fontWeight: "500",
  },

  // Details Card
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  completionValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    marginLeft: 12,
  },
  calendarIcon: {
    marginLeft: 6,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 4,
  },

  // Button Container
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  contactButtonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#FFD54F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  downloadButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F4C5C",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: "#0F4C5C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadButtonDisabled: {
    backgroundColor: "#E5E7EB",
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  downloadText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  downloadTextDisabled: {
    color: "#9CA3AF",
  },
});

export default TrackRequestDetailScreen;
