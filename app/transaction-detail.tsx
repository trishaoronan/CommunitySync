import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TransactionDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const documentTitle = (params.name as string) || 'Business Permit';
  const documentStatus = (params.status as 'completed' | 'unpaid' | 'pending') || 'completed';
  const referenceNumber = (params.refNumber as string) || 'REQ-2026-1234';
  const paymentMethod = (params.paymentMethod as string) || 'Gcash';
  const paymentDate = (params.dateRequested as string) || 'March 15, 2026';
  const amountPaid = (params.amount as string) || '50.00';
  const recipient = (params.recipient as string) || 'Pulong Buhangin, Santa Maria';

  const [isDownloading, setIsDownloading] = useState(false);

  const isDownloadEnabled = documentStatus === 'completed';

  // Download progress states
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  // Sample form data based on document type
  const getFormDataPreview = () => {
    const previewData: Record<string, Record<string, any>> = {
      'Business Permit': {
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'juan.delacruz@email.com',
        contactNumber: '09123456789',
        businessName: 'JD Convenience Store',
        businessType: 'Retail Store',
        businessAddress: '123 Main St, Pulong Buhangin',
        startDate: '2024-01-15',
        modeOfRelease: 'Personal Pickup',
      },
      'Barangay Clearance': {
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        dateOfBirth: '1990-05-20',
        gender: 'Female',
        completeAddress: 'Santa Maria, Bulacan',
        purpose: 'Employment',
        modeOfRelease: 'Personal Pickup',
      },
      'Certificate of Residency': {
        firstName: 'Jose',
        lastName: 'Reyes',
        email: 'jose.reyes@email.com',
        dateOfBirth: '1985-08-10',
        gender: 'Male',
        completeAddress: '456 Oak Ave, Pulong Buhangin',
        yearsOfResidency: '5',
        modeOfRelease: 'Personal Pickup',
      },
    };

    return previewData[documentTitle] || {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      contactNumber: '09123456789',
      modeOfRelease: 'Personal Pickup',
    };
  };

  // Simulate download progress
  useEffect(() => {
    if (isLoading && downloadProgress < 100) {
      const timer = setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = prev + Math.random() * 40;
          if (newProgress >= 100) {
            return 100;
          }
          return newProgress;
        });
      }, 800);
      return () => clearTimeout(timer);
    }

    // When download reaches 100%, show complete screen
    if (downloadProgress >= 100 && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsDownloadComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, downloadProgress]);

  const handleDownloadPDF = () => {
    if (isDownloadEnabled) {
      console.log('Download started');
      setIsLoading(true);
      setDownloadProgress(0);
    } else {
      console.log('Download not enabled for this status:', documentStatus);
    }
  };

  const handleTrackRequest = () => {
    router.push('/track-request');
  };

  const handleNavigateFromDownloadComplete = () => {
    setIsDownloadComplete(false);
    setDownloadProgress(0);
  };

  const formatFieldLabel = (fieldName: string): string => {
    // Convert camelCase to Title Case with spaces
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getStatusBadgeColor = () => {
    switch (documentStatus) {
      case 'completed':
        return '#10B981';
      case 'unpaid':
        return '#F59E0B';
      case 'pending':
        return '#FFC107';
      default:
        return '#10B981';
    }
  };

  const getStatusText = () => {
    switch (documentStatus) {
      case 'completed':
        return 'Completed';
      case 'unpaid':
        return 'Unpaid';
      case 'pending':
        return 'Pending';
      default:
        return 'Completed';
    }
  };

  const getStatusIcon = () => {
    switch (documentStatus) {
      case 'completed':
        return 'check-circle';
      case 'unpaid':
        return 'schedule';
      case 'pending':
        return 'schedule';
      default:
        return 'check-circle';
    }
  };

  return (
    <LinearGradient colors={['#EEF4FD', '#FDFFED']} style={styles.background}>
      {/* Loading Screen */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Image
              source={require('@/assets/pics/loading.png')}
              style={styles.loadingImage}
              resizeMode="contain"
            />
            <Text style={styles.loadingText}>Downloading...</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${downloadProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(downloadProgress)}%</Text>
          </View>
        </View>
      )}

      {/* Download Complete Screen */}
      {isDownloadComplete && (
        <View style={styles.downloadCompleteContainer}>
          <View style={styles.downloadCompleteContent}>
            <Text style={styles.downloadCompleteTitle}>Download Complete</Text>
            <Image
              source={require('@/assets/pics/download .png')}
              style={styles.downloadCompleteImage}
              resizeMode="contain"
            />
            <Text style={styles.downloadCompleteSubtitle}>Check your files to view the PDF</Text>
            <Text style={styles.downloadCompleteMessage}>
              Thank you for using CommunitySync.
            </Text>
            <Text style={styles.downloadCompleteMessage}>
              Serving you better every day.
            </Text>
            <TouchableOpacity
              style={styles.backButton2}
              onPress={handleNavigateFromDownloadComplete}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Form Data Preview Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isPreviewModalVisible}
        onRequestClose={() => setIsPreviewModalVisible(false)}
      >
        <LinearGradient colors={['#EEF4FD', '#FDFFED']} style={styles.background}>
          <SafeAreaView style={styles.safeArea}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsPreviewModalVisible(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#2D3E50" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Form Preview</Text>
              <View style={styles.closeButton} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
              {/* Document Info */}
              <View style={styles.previewCard}>
                <Text style={styles.previewCardTitle}>{documentTitle}</Text>
                <Text style={styles.previewCardSubtitle}>Submitted Information</Text>
              </View>

              {/* Form Fields Display */}
              <View style={styles.formFieldsContainer}>
                {Object.entries(getFormDataPreview()).map(([key, value]) => (
                  <View key={key} style={styles.formFieldPreview}>
                    <Text style={styles.formFieldLabel}>{formatFieldLabel(key)}</Text>
                    <Text style={styles.formFieldValue}>{String(value)}</Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </Modal>

      {/* Normal Transaction Details Screen (shown when not loading/complete) */}
      {!isLoading && !isDownloadComplete && (
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#2D3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Document Title */}
            <Text style={styles.documentTitle}>{documentTitle}</Text>

            {/* Status Badge */}
            <View style={styles.badgeContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
                <MaterialIcons name={getStatusIcon()} size={16} color="white" />
                <Text style={styles.badgeText}>{getStatusText()}</Text>
              </View>
            </View>

            {/* Payment Summary Box */}
            <View style={styles.paymentSummaryBox}>
              <Text style={styles.paymentMethodText}>Paid Via {paymentMethod}</Text>
              <Text style={styles.referenceText}>Ref No. {referenceNumber}</Text>
            </View>

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsSectionTitle}>Transaction Details</Text>
              <View style={styles.detailsDivider} />

              {/* Detail Row: Payment Date */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Date</Text>
                <Text style={styles.detailValue}>{paymentDate}</Text>
              </View>

              {/* Detail Row: Amount Paid */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Paid</Text>
                <Text style={styles.detailValue}>₱ {amountPaid}</Text>
              </View>

              {/* Detail Row: Payment Status */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status</Text>
                <View style={[styles.statusPill, { backgroundColor: getStatusBadgeColor() + '20' }]}>
                  <MaterialIcons name={getStatusIcon()} size={14} color={getStatusBadgeColor()} />
                  <Text style={[styles.statusPillText, { color: getStatusBadgeColor() }]}>
                    {getStatusText()}
                  </Text>
                </View>
              </View>

              {/* Detail Row: Recipient */}
              <View style={[styles.detailRow, styles.lastDetailRow]}>
                <Text style={styles.detailLabel}>Recipient</Text>
                <Text style={styles.detailValue}>{recipient}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* Track Request Button */}
              <TouchableOpacity
                style={styles.trackButton}
                onPress={handleTrackRequest}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#A5D6FF', '#8FC8FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.trackButtonGradient}
                >
                  <Text style={styles.trackButtonText}>Track Request</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Download PDF Button */}
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  !isDownloadEnabled && styles.downloadButtonDisabled,
                ]}
                onPress={handleDownloadPDF}
                disabled={!isDownloadEnabled}
                activeOpacity={isDownloadEnabled ? 0.8 : 0.5}
              >
                <MaterialIcons
                  name="download"
                  size={20}
                  color={isDownloadEnabled ? '#AAA' : '#DDD'}
                />
                <Text
                  style={[
                    styles.downloadButtonText,
                    !isDownloadEnabled && styles.downloadButtonTextDisabled,
                  ]}
                >
                  {isDownloading ? 'Downloading...' : 'Download PDF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Text */}
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>You can download this document after approval.</Text>
              <TouchableOpacity onPress={() => setIsPreviewModalVisible(true)}>
                <Text style={styles.previewLink}>Show Preview</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3E50',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  documentTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  paymentSummaryBox: {
    backgroundColor: '#FFFACD',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 13,
    color: '#666',
  },
  detailsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3E50',
    marginBottom: 12,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  lastDetailRow: {
    marginBottom: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  trackButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  trackButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3E50',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: 'white',
  },
  downloadButtonDisabled: {
    borderColor: '#E8E8E8',
    opacity: 0.6,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  downloadButtonTextDisabled: {
    color: '#BBB',
  },
  footerSection: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  previewLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },

  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  loadingImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1976D2',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },

  // Download Complete Screen Styles
  downloadCompleteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  downloadCompleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  downloadCompleteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  downloadCompleteImage: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  downloadCompleteSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  downloadCompleteMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  backButton2: {
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 40,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3E50',
    flex: 1,
    textAlign: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  previewCardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  formFieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formFieldPreview: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formFieldValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
    lineHeight: 24,
  },
});
