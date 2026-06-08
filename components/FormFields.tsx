import { FormFieldConfig } from "@/constants/documentConfigs";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export interface FormFieldProps {
  config: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// ==========================================
// TEXT INPUT FIELD
// ==========================================

export const TextInputField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {config.label}:
      {config.required && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={config.placeholder}
      placeholderTextColor="#CCC"
      value={value}
      onChangeText={onChange}
      keyboardType={config.keyboardType || "default"}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// ==========================================
// NUMBER INPUT FIELD
// ==========================================

export const NumberInputField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {config.label}:
      {config.required && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={config.placeholder}
      placeholderTextColor="#CCC"
      value={value}
      onChangeText={(text) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        onChange(numericValue);
      }}
      keyboardType="numeric"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// ==========================================
// DATE PICKER FIELD
// ==========================================

export const DatePickerField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {config.label}:
      {config.required && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
    <View style={[styles.dateInputWrapper, error && styles.inputError]}>
      <TextInput
        style={styles.dateInput}
        placeholder={config.placeholder || "MM/DD/YYYY"}
        placeholderTextColor="#CCC"
        value={value}
        onChangeText={onChange}
        maxLength={10}
      />
      <MaterialIcons
        name="calendar-today"
        size={20}
        color="#666"
        style={styles.calendarIcon}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// ==========================================
// DROPDOWN FIELD
// ==========================================

export const DropdownField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>
        {config.label}:
        {config.required && <Text style={styles.requiredIndicator}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.dropdownButton, error && styles.inputError]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>{value || "Select"}</Text>
        <MaterialIcons
          name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>
      {isOpen && config.options && (
        <View style={styles.dropdownMenu}>
          {config.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// ==========================================
// CHECKBOX FIELD
// ==========================================

export const CheckboxField: React.FC<
  FormFieldProps & { isChecked: boolean }
> = ({ config, isChecked, onChange, error }) => (
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => onChange(isChecked ? "false" : "true")}
  >
    <View
      style={[
        styles.checkbox,
        isChecked && styles.checkboxChecked,
        error && styles.inputError,
      ]}
    >
      {isChecked && <MaterialIcons name="check" size={16} color="#1976D2" />}
    </View>
    <Text style={styles.checkboxLabel}>{config.label}</Text>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </TouchableOpacity>
);

// ==========================================
// TEXTAREA FIELD
// ==========================================

export const TextAreaField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>
      {config.label}:
      {config.required && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
    <TextInput
      style={[styles.textarea, error && styles.inputError]}
      placeholder={config.placeholder}
      placeholderTextColor="#CCC"
      value={value}
      onChangeText={onChange}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// ==========================================
// DOCUMENT UPLOAD FIELD
// ==========================================

export interface DocumentUploadFieldProps {
  title: string;
  description?: string;
  uploadedFileName?: string;
  isUploading?: boolean;
  onUpload: () => void;
  buttonLabel?: string;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  title,
  description,
  uploadedFileName,
  isUploading,
  onUpload,
  buttonLabel,
}) => (
  <View style={styles.fullColumn}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {description ? (
      <Text style={styles.uploadDescription}>{description}</Text>
    ) : null}
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={onUpload}
      disabled={isUploading}
    >
      <MaterialIcons
        name={isUploading ? "hourglass-empty" : "upload"}
        size={20}
        color={isUploading ? "#999" : "#666"}
        style={styles.uploadIcon}
      />
      <Text style={[styles.uploadButtonText, isUploading && { color: "#999" }]}>
        {isUploading ? "Uploading..." : buttonLabel || "Tap to Upload Document"}
      </Text>
    </TouchableOpacity>

    {uploadedFileName && (
      <View style={styles.uploadSuccessMessage}>
        <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
        <Text style={styles.uploadSuccessText}>{uploadedFileName}</Text>
      </View>
    )}
  </View>
);

// ==========================================
// DUAL DOCUMENT UPLOAD FIELD
// ==========================================

export interface DualDocumentUploadProps {
  title: string;
  description: string;
  documents: {
    id: string;
    label: string;
    uploaded: boolean;
    fileName?: string;
  }[];
  onUpload: (docId: string) => void;
  isUploading?: boolean;
}

export const DualDocumentUploadField: React.FC<DualDocumentUploadProps> = ({
  title,
  description,
  documents,
  onUpload,
  isUploading,
}) => (
  <View style={styles.fullColumn}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.uploadDescription}>{description}</Text>
    {documents.map((doc) => (
      <View key={doc.id} style={{ marginBottom: 12 }}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => onUpload(doc.id)}
          disabled={isUploading}
        >
          <MaterialIcons
            name={isUploading ? "hourglass-empty" : "upload"}
            size={20}
            color={isUploading ? "#999" : "#666"}
            style={styles.uploadIcon}
          />
          <Text
            style={[styles.uploadButtonText, isUploading && { color: "#999" }]}
          >
            {isUploading ? "Uploading..." : `Tap to Upload ${doc.label}`}
          </Text>
        </TouchableOpacity>

        {doc.uploaded && doc.fileName && (
          <View style={styles.uploadSuccessMessage}>
            <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.uploadSuccessText}>{doc.fileName}</Text>
          </View>
        )}
      </View>
    ))}
  </View>
);

// ==========================================
// FORM SECTION DIVIDER
// ==========================================

export const FormSectionDivider: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  requiredIndicator: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  inputError: {
    borderColor: "#D32F2F",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },

  // Dropdown Styles
  dropdownContainer: {
    marginBottom: 12,
  },
  dropdownButton: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  dropdownButtonText: {
    fontSize: 13,
    color: "#333",
  },
  dropdownMenu: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#333",
  },

  // Date Input
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 12,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
  },
  calendarIcon: {
    marginLeft: 8,
  },

  // Textarea
  textarea: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EEE",
    fontFamily: "System",
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#E3F2FD",
    borderColor: "#1976D2",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },

  // Upload Section
  fullColumn: {
    width: "100%",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 12,
  },
  uploadDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: "#B3E5FC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  uploadSuccessMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 8,
  },
  uploadSuccessText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
});
