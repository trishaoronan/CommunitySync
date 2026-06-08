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
    name: "businessName",
    label: "Business Name",
    placeholder: "Enter your business name",
    required: true,
  },
  {
    name: "businessAddress",
    label: "Business Address",
    placeholder: "Enter the business address",
    required: true,
    multiline: true,
    numberOfLines: 3,
    type: "textarea" as const,
  },
  {
    name: "natureOfBusiness",
    label: "Nature of Business",
    placeholder: "Describe the nature of business",
    required: true,
  },
  {
    name: "ownerName",
    label: "Owner's Name",
    placeholder: "Enter the owner full name",
    required: true,
  },
  {
    name: "typeOfOwnership",
    label: "Type of Ownership",
    placeholder: "Select Sole or Corporation",
    required: true,
    type: "select" as const,
    options: [
      { label: "Sole Proprietorship", value: "Sole Proprietorship" },
      { label: "Corporation", value: "Corporation" },
    ],
  },
];

const initialValues = createDefaultValues(fields);

const BusinessPermitForm = () => {
  const router = useRouter();
  const [registrationFileName, setRegistrationFileName] = useState("");
  const [registrationFileUri, setRegistrationFileUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickRegistration = async () => {
    try {
      setUploading(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is required to upload your DTI or SEC registration.",
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
          asset.fileName || asset.uri.split("/").pop() || "registration-file";
        setRegistrationFileName(fileName);
        setRegistrationFileUri(asset.uri);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      if (!registrationFileUri) {
        Alert.alert(
          "Missing Upload",
          "Please upload your DTI or SEC registration.",
        );
        return;
      }

      const uploadResult = await uploadRequestAttachment({
        fileUri: registrationFileUri,
        fileName: registrationFileName,
        folder: "business-permit",
      });

      if (uploadResult.error || !uploadResult.publicUrl) {
        console.error(uploadResult.error);
        Alert.alert(
          "Upload Failed",
          uploadResult.error?.message ||
            "Unable to upload your registration file. Please try again.",
        );
        return;
      }

      const ownerParts = values.ownerName.trim().split(/\s+/);
      const firstName = ownerParts.shift() || "";
      const lastName = ownerParts.length ? ownerParts.join(" ") : firstName;
      const requestDetails = {
        ...values,
        uploadedRegistrationUrl: uploadResult.publicUrl,
      };

      const { data, error } = await createDocumentRequest({
        documentType: "Business Permit",
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
          documentName: "Business Permit",
          requestId: data.id,
          firstName,
          lastName,
          completeAddress: values.businessAddress,
          formData: JSON.stringify(requestDetails),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocumentFormShell
      title="Request Business Permit"
      subtitle="Use this form for business permit requests and business record storage."
      documentHint="The backend can save this as a separate Business Permit record using its own document key."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Proceed to Payment"
      beforeSubmit={() => ({
        valid: Boolean(registrationFileUri),
        message:
          "Please upload your DTI or SEC registration before submitting.",
      })}
      extraContent={
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>DTI / SEC Registration Upload</Text>
          <Text style={styles.sectionDescription}>
            Upload your registration certificate before continuing.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickRegistration}
            disabled={uploading}
          >
            <MaterialIcons name="upload" size={20} color="#0F4C5C" />
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Select Registration File"}
            </Text>
          </TouchableOpacity>
          {registrationFileName ? (
            <View style={styles.fileRow}>
              <MaterialIcons name="check-circle" size={18} color="#15803D" />
              <Text style={styles.fileName}>{registrationFileName}</Text>
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

export default BusinessPermitForm;
