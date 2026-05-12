import {
  CheckboxField,
  DatePickerField,
  DocumentUploadField,
  DropdownField,
  DualDocumentUploadField,
  FormSectionDivider,
  NumberInputField,
  TextAreaField,
  TextInputField,
} from '@/components/FormFields';
import {
  FormFieldConfig,
  getDocumentConfig,
} from '@/constants/documentConfigs';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const DocumentForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const documentName = (params.documentName as string) || 'Document Request';

  // Get document configuration
  const docConfig = getDocumentConfig(documentName);

  // Initialize form data dynamically based on config
  const initializeFormData = () => {
    const data: Record<string, any> = {};
    if (docConfig) {
      docConfig.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === 'checkbox') {
            data[field.name] = false;
          } else {
            data[field.name] = '';
          }
        });
      });
    }
    data.modeOfRelease = '';
    return data;
  };

  const [formData, setFormData] = useState<Record<string, any>>(
    initializeFormData()
  );
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, { name: string; uri: string }>
  >({});
  const [isUploadingID, setIsUploadingID] = useState(false);

  // Handle file upload
  const handleUploadDocument = useCallback(async (docId?: string) => {
    try {
      setIsUploadingID(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need media library permissions to upload documents.'
        );
        setIsUploadingID(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        let fileName = 'Document';

        if (asset.fileName) {
          fileName = asset.fileName;
        } else if (asset.uri) {
          const parts = asset.uri.split('/');
          fileName = parts[parts.length - 1];
        }

        const uploadKey = docId || 'validId';
        setUploadedFiles((prev) => ({
          ...prev,
          [uploadKey]: { name: fileName, uri: asset.uri },
        }));

        Alert.alert('Success', `${fileName} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setIsUploadingID(false);
    }
  }, []);

  // Validate form - check required fields
  const validateForm = useCallback(() => {
    if (!docConfig) return false;

    let allFieldsValid = true;

    docConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required) {
          const value = formData[field.name];
          if (!value || value === '' || value === false) {
            allFieldsValid = false;
          }
        }
      });
    });

    // Check if documents are uploaded
    if (docConfig.uploadSections.length > 0) {
      if (Object.keys(uploadedFiles).length === 0) {
        allFieldsValid = false;
      }
    }

    // Check mode of release
    if (!formData.modeOfRelease) {
      allFieldsValid = false;
    }

    return allFieldsValid;
  }, [formData, uploadedFiles, docConfig]);

  const handleProceed = () => {
    if (!validateForm()) {
      Alert.alert(
        'Incomplete Form',
        'Please complete all required fields and upload necessary documents.'
      );
      return;
    }

    // Navigate to payment screen with form data as params
    router.push({
      pathname: '/payment',
      params: {
        documentName: documentName,
        formData: JSON.stringify(formData),
        modeOfRelease: formData.modeOfRelease,
      },
    });
  };

  // Render form field based on type
  const renderField = (field: FormFieldConfig) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <TextInputField
            key={field.name}
            config={field}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      case 'phone':
        return (
          <TextInputField
            key={field.name}
            config={{ ...field, keyboardType: 'phone-pad' }}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      case 'number':
        return (
          <NumberInputField
            key={field.name}
            config={field}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      case 'date':
        return (
          <DatePickerField
            key={field.name}
            config={field}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      case 'dropdown':
        return (
          <DropdownField
            key={field.name}
            config={field}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={field.name}
            config={field}
            value={value}
            isChecked={Boolean(formData[field.name])}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text === 'true' })
            }
          />
        );

      case 'textarea':
        return (
          <TextAreaField
            key={field.name}
            config={field}
            value={value}
            onChange={(text) =>
              setFormData({ ...formData, [field.name]: text })
            }
          />
        );

      default:
        return null;
    }
  };

  // Render row container for half-width fields
  const renderFieldsInRow = (fields: FormFieldConfig[]) => {
    const rows: FormFieldConfig[][] = [];
    let currentRow: FormFieldConfig[] = [];

    fields.forEach((field) => {
      currentRow.push(field);
      if (field.width === 'full' || currentRow.length === 2) {
        rows.push(currentRow);
        currentRow = [];
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows.map((row, rowIndex) => {
      if (row.length === 1 && row[0].width === 'full') {
        return (
          <View key={`row-${rowIndex}`} style={styles.fullColumn}>
            {renderField(row[0])}
          </View>
        );
      }

      return (
        <View key={`row-${rowIndex}`} style={styles.rowContainer}>
          {row.map((field) => (
            <View key={field.name} style={styles.halfColumn}>
              {renderField(field)}
            </View>
          ))}
        </View>
      );
    });
  };

  if (!docConfig) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Document configuration not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Yellow Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.documentTitle}>{documentName}</Text>
          <Text style={styles.documentDescription}>
            {docConfig.description}
          </Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Render all sections */}
          {docConfig.sections.map((section, sectionIndex) => (
            <View key={`section-${sectionIndex}`}>
              <FormSectionDivider title={section.title} />
              {renderFieldsInRow(section.fields)}
            </View>
          ))}

          {/* Document Upload Sections */}
          {docConfig.uploadSections.map((uploadSection, uploadIndex) => {
            if (uploadSection.type === 'single') {
              return (
                <DocumentUploadField
                  key={`upload-${uploadIndex}`}
                  title={uploadSection.title}
                  description={uploadSection.description}
                  uploadedFileName={uploadedFiles['validId']?.name}
                  isUploading={isUploadingID}
                  onUpload={() => handleUploadDocument('validId')}
                />
              );
            } else if (uploadSection.type === 'dual' && uploadSection.documents) {
              return (
                <DualDocumentUploadField
                  key={`upload-${uploadIndex}`}
                  title={uploadSection.title}
                  description={uploadSection.description}
                  documents={uploadSection.documents.map((doc) => ({
                    ...doc,
                    uploaded: Boolean(uploadedFiles[doc.id]),
                    fileName: uploadedFiles[doc.id]?.name,
                  }))}
                  onUpload={handleUploadDocument}
                  isUploading={isUploadingID}
                />
              );
            }
            return null;
          })}

          {/* Mode of Release */}
          <View style={styles.fullColumn}>
            <Text style={styles.sectionTitle}>Mode of Release</Text>

            <TouchableOpacity
              style={[
                styles.modeCard,
                formData.modeOfRelease === 'Pickup at the Barangay Hall' &&
                  styles.modeCardSelected,
              ]}
              onPress={() =>
                setFormData({
                  ...formData,
                  modeOfRelease: 'Pickup at the Barangay Hall',
                })
              }
            >
              <View style={styles.modeCardContent}>
                <MaterialIcons
                  name="place"
                  size={28}
                  color={
                    formData.modeOfRelease === 'Pickup at the Barangay Hall'
                      ? '#1976D2'
                      : '#666'
                  }
                />
                <View style={styles.modeCardText}>
                  <Text
                    style={[
                      styles.modeCardTitle,
                      formData.modeOfRelease === 'Pickup at the Barangay Hall' &&
                        styles.modeCardTitleSelected,
                    ]}
                  >
                    Pickup at the Barangay Hall
                  </Text>
                  <Text style={styles.modeCardSubtitle}>
                    Collect document in person
                  </Text>
                </View>
              </View>
              {formData.modeOfRelease === 'Pickup at the Barangay Hall' && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeCard,
                formData.modeOfRelease === 'Download' && styles.modeCardSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, modeOfRelease: 'Download' })
              }
            >
              <View style={styles.modeCardContent}>
                <MaterialIcons
                  name="cloud-download"
                  size={28}
                  color={
                    formData.modeOfRelease === 'Download' ? '#1976D2' : '#666'
                  }
                />
                <View style={styles.modeCardText}>
                  <Text
                    style={[
                      styles.modeCardTitle,
                      formData.modeOfRelease === 'Download' &&
                        styles.modeCardTitleSelected,
                    ]}
                  >
                    Download
                  </Text>
                  <Text style={styles.modeCardSubtitle}>
                    Get digital copy via email
                  </Text>
                </View>
              </View>
              {formData.modeOfRelease === 'Download' && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            {/* Payment Notice */}
            <View style={styles.paymentNoticeContainer}>
              <Text style={styles.paymentNoticeLabel}>Payment Notice</Text>
              <Text style={styles.paymentNoticeText}>
                Send the payment to 09238412342
              </Text>
            </View>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity
            style={styles.proceedButtonContainer}
            onPress={handleProceed}
            activeOpacity={0.8}
            disabled={!validateForm()}
          >
            <LinearGradient
              colors={
                validateForm()
                  ? ['#FFD54F', '#4A90E2']
                  : ['#BDBDBD', '#9E9E9E']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentForm;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Header Card
  headerCard: {
    backgroundColor: '#FFEB3B',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  documentDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  // Form Container
  formContainer: {
    backgroundColor: '#FFFACD',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 12,
  },

  // Form Fields Layout
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  fullColumn: {
    width: '100%',
    marginBottom: 12,
  },

  // Mode Cards
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modeCardSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  modeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  modeCardText: {
    flex: 1,
  },
  modeCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modeCardTitleSelected: {
    color: '#1976D2',
  },
  modeCardSubtitle: {
    fontSize: 12,
    color: '#999',
  },

  // Payment Notice
  paymentNoticeContainer: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F0F4F8',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    borderRadius: 4,
  },
  paymentNoticeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976D2',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  paymentNoticeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Proceed Button
  proceedButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    opacity: 1,
  },
  proceedButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
