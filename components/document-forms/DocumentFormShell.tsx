import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import type { TextInputProps } from "react-native";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type FieldOption = {
  label: string;
  value: string;
};

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: TextInputProps["keyboardType"];
  type?: "text" | "textarea" | "select";
  options?: FieldOption[];
  readOnly?: boolean;
};

type BeforeSubmitResult = {
  valid: boolean;
  message?: string;
};

type DocumentFormShellProps = {
  title: string;
  subtitle?: string;
  documentHint?: string;
  fields: FieldConfig[];
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
  beforeSubmit?: () => BeforeSubmitResult;
  extraContent?: React.ReactNode;
  isSubmitting?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

export const createDefaultValues = (fields: FieldConfig[]) =>
  fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

export const DocumentFormShell = ({
  title,
  subtitle,
  documentHint,
  fields,
  initialValues,
  onSubmit,
  submitLabel = "Submit Request",
  beforeSubmit,
  extraContent,
  isSubmitting = false,
  isLoading = false,
  loadingText = "Loading your details...",
}: DocumentFormShellProps) => {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // useState only captures the first initialValues (empty). Sync when the
  // profile prefill hook resolves and provides real data.
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required),
    [fields],
  );

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = values[field.name];
      if (!value || !value.trim()) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      Alert.alert("Incomplete Form", "Please fill in the required fields.");
      return;
    }

    if (beforeSubmit) {
      const result = beforeSubmit();
      if (!result.valid) {
        Alert.alert(
          "Missing Requirement",
          result.message || "Please try again.",
        );
        return;
      }
    }

    onSubmit(values);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color="#1976D2" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.iconSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {documentHint ? <Text style={styles.hint}>{documentHint}</Text> : null}

        <View style={styles.formCard}>
          {fields.map((field) => {
            const value = values[field.name] ?? "";
            const isTextarea = field.type === "textarea" || field.multiline;
            const isSelect = field.type === "select";
            const isReadOnly = field.readOnly === true;

            return (
              <View key={field.name} style={styles.fieldBlock}>
                <Text style={styles.label}>
                  {field.label}
                  {field.required ? " *" : ""}
                </Text>

                {isSelect ? (
                  <View style={styles.optionGrid}>
                    {(field.options || []).map((option) => {
                      const selected = value === option.value;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.optionChip,
                            selected && styles.optionChipActive,
                            isReadOnly && styles.optionChipReadOnly,
                            isReadOnly && selected && styles.optionChipActiveReadOnly,
                          ]}
                          onPress={isReadOnly ? undefined : () => handleChange(field.name, option.value)}
                          activeOpacity={isReadOnly ? 1 : 0.7}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextActive,
                              isReadOnly && styles.optionTextReadOnly,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    style={[
                      styles.input,
                      isTextarea && styles.textarea,
                      errors[field.name] && styles.inputError,
                      isReadOnly && styles.inputReadOnly,
                    ]}
                    value={value}
                    placeholder={field.placeholder}
                    placeholderTextColor="#9CA3AF"
                    onChangeText={(text) => handleChange(field.name, text)}
                    multiline={isTextarea}
                    numberOfLines={field.numberOfLines}
                    keyboardType={field.keyboardType}
                    editable={!isReadOnly}
                  />
                )}

                {errors[field.name] ? (
                  <Text style={styles.errorText}>{errors[field.name]}</Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {extraContent ? (
          <View style={styles.extraContent}>{extraContent}</View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <View style={styles.submitContent}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : null}
            <Text style={styles.submitText}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#F8F8F5",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSpacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FCA5A5",
  },
  inputReadOnly: {
    backgroundColor: "#EDEFF2",
    color: "#6B7280",
    borderColor: "#D1D5DB",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionChipActive: {
    borderColor: "#60A5FA",
    backgroundColor: "#DBEAFE",
  },
  optionChipReadOnly: {
    borderColor: "#D1D5DB",
    backgroundColor: "#EDEFF2",
  },
  optionChipActiveReadOnly: {
    borderColor: "#9CA3AF",
    backgroundColor: "#D1D5DB",
  },
  optionText: {
    fontSize: 13,
    color: "#374151",
  },
  optionTextActive: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  optionTextReadOnly: {
    color: "#6B7280",
  },
  extraContent: {
    marginTop: 16,
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingCard: {
    marginTop: 60,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  loadingText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
  },
});
