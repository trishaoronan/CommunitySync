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
    name: "deceasedPersonName",
    label: "Deceased Person's Name",
    placeholder: "Enter the full name",
    required: true,
  },
  {
    name: "relationshipToDeceased",
    label: "Relationship to Deceased",
    placeholder: "Enter your relationship",
    required: true,
  },
  {
    name: "dateOfDeath",
    label: "Date of Death",
    placeholder: "MM/DD/YYYY",
    required: true,
  },
  {
    name: "causeOfDeath",
    label: "Cause of Death",
    placeholder: "State the cause of death",
    required: true,
    multiline: true,
    numberOfLines: 3,
    type: "textarea" as const,
  },
];

const initialValues = createDefaultValues(fields);

const BurialAssistanceForm = () => {
  const router = useRouter();
  const [deathCertificateName, setDeathCertificateName] = useState("");
  const [deathCertificateUri, setDeathCertificateUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickDeathCertificate = async () => {
    try {
      setUploading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is required to upload the death certificate.",
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
        setDeathCertificateName(
          asset.fileName || asset.uri.split("/").pop() || "death-certificate",
        );
        setDeathCertificateUri(asset.uri);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      if (!deathCertificateUri) {
        Alert.alert("Missing Upload", "Please upload a death certificate.");
        return;
      }

      const uploadResult = await uploadRequestAttachment({
        fileUri: deathCertificateUri,
        fileName: deathCertificateName,
        folder: "burial-assistance",
      });

      if (uploadResult.error || !uploadResult.publicUrl) {
        console.error(uploadResult.error);
        Alert.alert(
          "Upload Failed",
          uploadResult.error?.message ||
            "Unable to upload the death certificate. Please try again.",
        );
        return;
      }

      const requestDetails = {
        ...values,
        uploadedDeathCertificateUrl: uploadResult.publicUrl,
      };

      const { data, error } = await createDocumentRequest({
        documentType: "Burial Assistance Application",
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
          documentName: "Burial Assistance Application",
          requestId: data.id,
          firstName: values.deceasedPersonName,
          lastName: "",
          completeAddress: values.relationshipToDeceased,
          formData: JSON.stringify(requestDetails),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocumentFormShell
      title="Request Burial Assistance"
      subtitle="Submit burial assistance details and upload a death certificate."
      documentHint="This screen stores burial assistance requests separately for backend processing."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Proceed to Payment"
      beforeSubmit={() => ({
        valid: Boolean(deathCertificateUri),
        message: "Please upload a death certificate before submitting.",
      })}
      extraContent={
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Death Certificate Upload</Text>
          <Text style={styles.sectionDescription}>
            Upload a clear copy of the death certificate.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickDeathCertificate}
            disabled={uploading}
          >
            <MaterialIcons name="upload" size={20} color="#0F4C5C" />
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Select Death Certificate"}
            </Text>
          </TouchableOpacity>
          {deathCertificateName ? (
            <View style={styles.fileRow}>
              <MaterialIcons name="check-circle" size={18} color="#15803D" />
              <Text style={styles.fileName}>{deathCertificateName}</Text>
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

export default BurialAssistanceForm;
