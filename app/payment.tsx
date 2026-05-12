import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface UploadedFile {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
}

interface PaymentFormState {
  paymentOption: 'cash' | 'gcash' | '';
  receiptUpload: UploadedFile | null;
  referenceNumber: string;
}

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract form data from params
  const firstName = (params.firstName as string) || 'Stephanie';
  const lastName = (params.lastName as string) || 'Kim';
  const contactNumber = (params.contactNumber as string) || '09123456789';
  const completeAddress =
    (params.completeAddress as string) || 'Santa Maria, Bulacan, Central Luzon, 3022';
  const documentName = (params.documentName as string) || 'Barangay Clearance';

  const [paymentData, setPaymentData] = useState<PaymentFormState>({
    paymentOption: '',
    receiptUpload: null,
    referenceNumber: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Validation: G-Cash receipt and reference number required if G-Cash selected
  const isFormValid =
    paymentData.paymentOption !== '' &&
    (paymentData.paymentOption === 'cash' ||
      (paymentData.paymentOption === 'gcash' &&
        paymentData.receiptUpload &&
        paymentData.referenceNumber.trim() !== ''));

  const handleUploadReceipt = async () => {
    try {
      setIsUploading(true);
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to upload files.');
        setIsUploading(false);
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Extract filename from URI or use default
        let fileName = 'Receipt';
        if (asset.fileName) {
          fileName = asset.fileName;
        } else if (asset.uri) {
          const parts = asset.uri.split('/');
          fileName = parts[parts.length - 1];
        }

        const uploadedFile: UploadedFile = {
          name: fileName,
          uri: asset.uri,
          mimeType: asset.mimeType || 'image/jpeg',
          size: asset.fileSize || 0,
        };

        setPaymentData({ ...paymentData, receiptUpload: uploadedFile });
        console.log('File uploaded:', uploadedFile);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      alert('Error selecting file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitPayment = () => {
    if (!isFormValid) {
      alert('Please complete all required fields');
      return;
    }

    const paymentSummary = {
      fullName: `${firstName} ${lastName}`,
      contactNumber,
      address: completeAddress,
      document: documentName,
      paymentMethod: paymentData.paymentOption === 'cash' ? 'Cash at Barangay Hall' : 'G-Cash',
      referenceNumber: paymentData.referenceNumber,
      receiptFile: paymentData.receiptUpload?.name || 'N/A',
      timestamp: new Date().toISOString(),
    };

    alert(
      `Payment Submitted Successfully!\n\n${JSON.stringify(
        paymentSummary,
        null,
        2
      )}`
    );

    // TODO: Submit payment to backend
    // After successful submission, navigate to success screen
    router.push('/payment-success');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#C5E1A5', '#FFF9C4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Main Payment Card */}
          <View style={styles.paymentCard}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="person" size={20} color="#333" />
                  <Text style={styles.infoText}>
                    {firstName} {lastName}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="phone" size={20} color="#333" />
                  <Text style={styles.infoText}>{contactNumber}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={20} color="#333" />
                  <Text style={styles.infoText}>{completeAddress}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <MaterialIcons name="edit" size={16} color="#1976D2" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Type of Document Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type of Document</Text>
              <View style={styles.documentTypeCard}>
                <Text style={styles.documentTypeText}>{documentName}</Text>
              </View>
            </View>

            {/* Choose Payment Option Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose payment option</Text>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() =>
                  setPaymentData({ ...paymentData, paymentOption: 'cash' })
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    paymentData.paymentOption === 'cash' &&
                      styles.radioCircleSelected,
                  ]}
                >
                  {paymentData.paymentOption === 'cash' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Cash at the Barangay Hall</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() =>
                  setPaymentData({ ...paymentData, paymentOption: 'gcash' })
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    paymentData.paymentOption === 'gcash' &&
                      styles.radioCircleSelected,
                  ]}
                >
                  {paymentData.paymentOption === 'gcash' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>G-Cash</Text>
              </TouchableOpacity>
            </View>

            {/* Proof of Payment Section (G-Cash only) */}
            {paymentData.paymentOption === 'gcash' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Proof of Payment</Text>
                <Text style={styles.proofSubText}>
                  Upload your Gcash Receipt
                </Text>
                <Text style={styles.paymentDetails}>
                  Pay here: COMMUNITYSYNC - 09123456890
                </Text>

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUploadReceipt}
                  disabled={isUploading}
                >
                  <MaterialIcons
                    name={isUploading ? 'hourglass-empty' : 'cloud-upload'}
                    size={20}
                    color={isUploading ? '#999' : '#1976D2'}
                  />
                  <Text style={[styles.uploadButtonText, isUploading && { color: '#999' }]}>
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Text>
                </TouchableOpacity>

                {paymentData.receiptUpload && (
                  <View style={styles.uploadedIndicator}>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#4CAF50"
                    />
                    <View style={styles.uploadedTextContainer}>
                      <Text style={styles.uploadedText}>File uploaded</Text>
                      <Text style={styles.uploadedFileName}>{paymentData.receiptUpload.name}</Text>
                      {paymentData.receiptUpload.size && (
                        <Text style={styles.uploadedFileSize}>
                          ({(paymentData.receiptUpload.size / 1024).toFixed(2)} KB)
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.referenceNumberContainer}>
                  <Text style={styles.label}>Reference Number</Text>
                  <TextInput
                    style={styles.referenceInput}
                    placeholder="Enter reference number"
                    placeholderTextColor="#CCC"
                    value={paymentData.referenceNumber}
                    onChangeText={(text) =>
                      setPaymentData({ ...paymentData, referenceNumber: text })
                    }
                  />
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitPayment}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Submit Payment</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  gradientContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  // Personal Information
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
  },

  // Type of Document
  documentTypeCard: {
    backgroundColor: '#B3E5FC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#01579B',
    textAlign: 'center',
  },

  // Radio Buttons
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976D2',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  // Proof of Payment (G-Cash)
  proofSubText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  paymentDetails: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 14,
    backgroundColor: '#FFFDE7',
    padding: 10,
    borderRadius: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
  },
  uploadedIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 10,
  },
  uploadedTextContainer: {
    flex: 1,
  },
  uploadedText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  uploadedFileName: {
    fontSize: 11,
    color: '#1B5E20',
    fontWeight: '500',
    marginTop: 4,
  },
  uploadedFileSize: {
    fontSize: 10,
    color: '#558B2F',
    marginTop: 2,
  },
  referenceNumberContainer: {
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  referenceInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#0D3B66',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },

  bottomPadding: {
    height: 20,
  },
});

export default PaymentScreen;
