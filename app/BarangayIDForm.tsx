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
    name: "completeAddress",
    label: "Complete Address",
    placeholder: "Enter your complete address",
    required: true,
    multiline: true,
    numberOfLines: 3,
    type: "textarea" as const,
    readOnly: true,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    placeholder: "MM/DD/YYYY",
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
    name: "purposeOfRequest",
    label: "Purpose of Request",
    placeholder: "Why do you need the ID?",
    required: true,
    multiline: true,
    numberOfLines: 3,
    type: "textarea" as const,
  },
];

const baseInitialValues = createDefaultValues(fields);

const BarangayIDForm = () => {
  const router = useRouter();
  const [proofName, setProofName] = useState("");
  const [proofUri, setProofUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initialValues, isLoading: isProfileLoading } =
    useProfilePrefill(baseInitialValues);

  const handlePickProof = async () => {
    try {
      setUploading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is required to upload your proof of identity or residency.",
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
        setProofName(
          asset.fileName || asset.uri.split("/").pop() || "proof-document",
        );
        setProofUri(asset.uri);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      if (!proofUri) {
        Alert.alert("Missing Upload", "Please upload a valid proof document.");
        return;
      }

      const uploadResult = await uploadRequestAttachment({
        fileUri: proofUri,
        fileName: proofName,
        folder: "barangay-id",
      });

      if (uploadResult.error || !uploadResult.publicUrl) {
        console.error(uploadResult.error);
        Alert.alert(
          "Upload Failed",
          uploadResult.error?.message ||
            "Unable to upload your proof document. Please try again.",
        );
        return;
      }

      const [firstName = "", ...rest] = values.fullName.trim().split(/\s+/);
      const requestDetails = {
        ...values,
        uploadedProofUrl: uploadResult.publicUrl,
      };

      const { data, error } = await createDocumentRequest({
        documentType: "Barangay ID",
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
          documentName: "Barangay ID",
          requestId: data.id,
          firstName,
          lastName: rest.join(" "),
          completeAddress: values.completeAddress,
          formData: JSON.stringify(requestDetails),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocumentFormShell
      title="Request Barangay ID"
      subtitle="Provide your personal details and upload proof of identity or residency."
      documentHint="This screen stores Barangay ID requests separately for backend processing."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isLoading={isProfileLoading}
      submitLabel="Proceed to Payment"
      beforeSubmit={() => ({
        valid: Boolean(proofUri),
        message: "Please upload a valid proof document before submitting.",
      })}
      extraContent={
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Proof Upload</Text>
          <Text style={styles.sectionDescription}>
            Upload a valid ID or poblador proof.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickProof}
            disabled={uploading}
          >
            <MaterialIcons name="upload" size={20} color="#0F4C5C" />
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Select Proof Document"}
            </Text>
          </TouchableOpacity>
          {proofName ? (
            <View style={styles.fileRow}>
              <MaterialIcons name="check-circle" size={18} color="#15803D" />
              <Text style={styles.fileName}>{proofName}</Text>
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

export default BarangayIDForm;
