import {
    DocumentFormShell,
    createDefaultValues,
} from "@/components/document-forms/DocumentFormShell";
import { CIVIL_STATUS_OPTIONS } from "@/constants/formOptions";
import { useProfilePrefill } from "@/hooks/use-profile-prefill";
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
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
    readOnly: true,
  },
  {
    name: "civilStatus",
    label: "Civil Status",
    required: true,
    type: "select" as const,
    options: CIVIL_STATUS_OPTIONS,
    readOnly: true,
  },
  {
    name: "numberOfMinorChildren",
    label: "Number of Minor Children",
    placeholder: "Enter number of children",
    required: true,
    keyboardType: "numeric" as const,
  },
  {
    name: "maritalStatus",
    label: "Marital Status",
    placeholder: "Separated, Widowed, Solo Parent, etc.",
    required: true,
    type: "select" as const,
    options: [
      { label: "Separated", value: "Separated" },
      { label: "Widowed", value: "Widowed" },
      { label: "Single Parent", value: "Single Parent" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    name: "employmentStatus",
    label: "Employment Status",
    placeholder: "Employed, Unemployed, Informal, etc.",
    required: true,
    type: "select" as const,
    options: [
      { label: "Employed", value: "Employed" },
      { label: "Unemployed", value: "Unemployed" },
      { label: "Informal Work", value: "Informal Work" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    name: "reasonForSoloParentStatus",
    label: "Reason for Solo Parent Status",
    placeholder: "Explain the reason",
    required: true,
    multiline: true,
    numberOfLines: 3,
    type: "textarea" as const,
  },
];

const baseInitialValues = createDefaultValues(fields);

const CertificateOfSoloParentForm = () => {
  const router = useRouter();
  const [supportingDocName, setSupportingDocName] = useState("");
  const [supportingDocUri, setSupportingDocUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initialValues, isLoading: isProfileLoading } =
    useProfilePrefill(baseInitialValues);

  const handlePickSupportDoc = async () => {
    try {
      setUploading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is required to upload supporting documents.",
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
        setSupportingDocName(
          asset.fileName || asset.uri.split("/").pop() || "supporting-document",
        );
        setSupportingDocUri(asset.uri);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      if (!supportingDocUri) {
        Alert.alert("Missing Upload", "Please upload a supporting document.");
        return;
      }

      const uploadResult = await uploadRequestAttachment({
        fileUri: supportingDocUri,
        fileName: supportingDocName,
        folder: "certificate-solo-parent",
      });

      if (uploadResult.error || !uploadResult.publicUrl) {
        console.error(uploadResult.error);
        Alert.alert(
          "Upload Failed",
          uploadResult.error?.message ||
            "Unable to upload the supporting document. Please try again.",
        );
        return;
      }

      const [firstName = "", ...rest] = values.fullName.trim().split(/\s+/);
      const requestDetails = {
        ...values,
        uploadedSupportingDocUrl: uploadResult.publicUrl,
      };

      const { data, error } = await createDocumentRequest({
        documentType: "Certificate of Solo Parent",
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
          documentName: "Certificate of Solo Parent",
          requestId: data.id,
          firstName,
          lastName: rest.join(" "),
          completeAddress: "",
          formData: JSON.stringify(requestDetails),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocumentFormShell
      title="Request Solo Parent Certificate"
      subtitle="Provide household and solo-parent details with a supporting document."
      documentHint="This screen stores solo parent requests separately for backend processing."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isLoading={isProfileLoading}
      submitLabel="Proceed to Payment"
      beforeSubmit={() => ({
        valid: Boolean(supportingDocUri),
        message: "Please upload a supporting document before submitting.",
      })}
      extraContent={
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Supporting Document Upload</Text>
          <Text style={styles.sectionDescription}>
            Upload a supporting document such as proof of household status.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickSupportDoc}
            disabled={uploading}
          >
            <MaterialIcons name="upload" size={20} color="#0F4C5C" />
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Select Supporting Document"}
            </Text>
          </TouchableOpacity>
          {supportingDocName ? (
            <View style={styles.fileRow}>
              <MaterialIcons name="check-circle" size={18} color="#15803D" />
              <Text style={styles.fileName}>{supportingDocName}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  sectionDescription: { fontSize: 13, color: "#475569", lineHeight: 18 },
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
  uploadButtonText: { fontSize: 14, fontWeight: "700", color: "#0F4C5C" },
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

export default CertificateOfSoloParentForm;
