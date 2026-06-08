import {
    DocumentFormShell,
    createDefaultValues,
} from "@/components/document-forms/DocumentFormShell";
import {
    createDocumentRequest,
    uploadRequestAttachment,
} from "@/lib/documentRequests";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const fields = [
  {
    name: "complainantName",
    label: "Complainant Name",
    placeholder: "Enter the complainant name",
    required: true,
  },
  {
    name: "incidentDateTime",
    label: "Incident Date & Time",
    placeholder: "MM/DD/YYYY - HH:MM",
    required: true,
  },
  {
    name: "incidentLocation",
    label: "Incident Location",
    placeholder: "Enter the exact location",
    required: true,
    multiline: true,
    numberOfLines: 2,
    type: "textarea" as const,
  },
  {
    name: "incidentNarrative",
    label: "Detailed Narrative / Description",
    placeholder: "Describe the incident in detail",
    required: true,
    multiline: true,
    numberOfLines: 5,
    type: "textarea" as const,
  },
  {
    name: "respondentName",
    label: "Respondent Name (if known)",
    placeholder: "Enter respondent name if known",
    required: false,
  },
];

const initialValues = createDefaultValues(fields);

const BlotterIncidentReportForm = () => {
  const router = useRouter();
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [evidenceFileUri, setEvidenceFileUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickEvidence = async () => {
    try {
      setUploading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is required to upload incident evidence.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        const fileName =
          asset.fileName || asset.uri.split("/").pop() || "evidence-file";
        setEvidenceFileName(fileName);
        setEvidenceFileUri(asset.uri);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      if (!evidenceFileUri) {
        Alert.alert("Missing Upload", "Please upload an evidence file.");
        return;
      }

      const uploadResult = await uploadRequestAttachment({
        fileUri: evidenceFileUri,
        fileName: evidenceFileName,
        folder: "blotter-incident-report",
      });

      if (uploadResult.error || !uploadResult.publicUrl) {
        console.error(uploadResult.error);
        Alert.alert(
          "Upload Failed",
          uploadResult.error?.message ||
            "Unable to upload your evidence file. Please try again.",
        );
        return;
      }

      const complainantParts = values.complainantName.trim().split(/\s+/);
      const firstName = complainantParts.shift() || "";
      const lastName = complainantParts.length
        ? complainantParts.join(" ")
        : firstName;
      const requestDetails = {
        ...values,
        uploadedEvidenceUrl: uploadResult.publicUrl,
      };

      const { data, error } = await createDocumentRequest({
        documentType: "Blotter/Incident Report",
        requestDetails,
        userId: uploadResult.userId ?? undefined,
      });

      if (error || !data) {
        Alert.alert(
          "Submission Failed",
          "Unable to save your request. Please try again.",
        );
        return;
      }

      router.push({
        pathname: "/payment",
        params: {
          documentName: "Blotter/Incident Report",
          requestId: data.id,
          firstName,
          lastName,
          completeAddress: values.incidentLocation,
          formData: JSON.stringify(requestDetails),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocumentFormShell
      title="Request Blotter / Incident Report"
      subtitle="Record an incident or complaint with its own dedicated data structure."
      documentHint="This screen captures separate incident report data for backend storage and case tracking."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Proceed to Payment"
      beforeSubmit={() => ({
        valid: Boolean(evidenceFileUri),
        message: "Please upload at least one evidence file before submitting.",
      })}
      extraContent={
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Evidence Upload</Text>
          <Text style={styles.sectionDescription}>
            Upload photos, videos, or documents that support the incident
            report.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickEvidence}
            disabled={uploading}
          >
            <MaterialIcons name="upload" size={20} color="#0F4C5C" />
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Select Evidence File"}
            </Text>
          </TouchableOpacity>
          {evidenceFileName ? (
            <View style={styles.fileRow}>
              <MaterialIcons name="check-circle" size={18} color="#15803D" />
              <Text style={styles.fileName}>{evidenceFileName}</Text>
            </View>
          ) : null}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  uploadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#9AD0D4",
    backgroundColor: "#E6F4F1",
    paddingVertical: 14,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F4C5C",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  fileName: {
    fontSize: 13,
    color: "#15803D",
    fontWeight: "600",
    flexShrink: 1,
  },
});

export default BlotterIncidentReportForm;
