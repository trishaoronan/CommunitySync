import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  completed: boolean;
  isActive: boolean;
}

const TrackRequestDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract params with defaults
  const documentName = (params.title as string) || 'Barangay Clearance';
  const referenceNumber = (params.referenceNumber as string) || 'REQ-2026-1234';
  const dateRequested = (params.dateRequested as string) || 'March 15, 2026';
  const applicantName = (params.applicantName as string) || 'Stephanie Kim';
  const paymentMethod = (params.paymentMethod as string) || 'Paid via Gcash';
  const estimatedCompletion = (params.estimatedCompletion as string) || '2 - 3 Days';

  // Timeline Steps - define which are completed and which are active
  const timelineSteps: TimelineStep[] = [
    {
      id: 'submitted',
      title: 'Submitted',
      description: '',
      timestamp: 'March 15, 2026 | 3:46 PM',
      icon: 'check-circle',
      completed: true,
      isActive: false,
    },
    {
      id: 'paid',
      title: 'Paid',
      description: '',
      timestamp: 'March 15, 2026 | 3:46 PM',
      icon: 'check-circle',
      completed: true,
      isActive: false,
    },
    {
      id: 'under-review',
      title: 'Under Review',
      description: 'Your document is being review',
      timestamp: '',
      icon: 'search',
      completed: false,
      isActive: true,
    },
    {
      id: 'ready-download',
      title: 'Ready for Download',
      description: '',
      timestamp: 'March 15, 2026 | 3:46 PM',
      icon: 'download',
      completed: false,
      isActive: false,
    },
    {
      id: 'complete',
      title: 'Complete',
      description: '',
      timestamp: 'March 15, 2026 | 3:46 PM',
      icon: 'check-circle',
      completed: false,
      isActive: false,
    },
  ];

  const getIconColor = (step: TimelineStep): string => {
    if (step.completed) return '#4CAF50';
    if (step.isActive) return '#FF6F3C';
    return '#CCCCCC';
  };

  const getStepOpacity = (step: TimelineStep): number => {
    if (step.completed || step.isActive) return 1;
    return 0.5;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Request</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Summary Card - Yellow */}
        <View style={styles.summaryCardWrapper}>
          <LinearGradient
            colors={['#FFFACD', '#FFF9C4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryIconContainer}>
              <View style={styles.summaryIcon}>
                <MaterialIcons name="description" size={28} color="#FFA500" />
              </View>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>{documentName}</Text>
              <Text style={styles.summaryDetail}>Ref No. {referenceNumber}</Text>
              <Text style={styles.summaryDate}>{dateRequested}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {timelineSteps.map((step, index) => (
            <View
              key={step.id}
              style={[styles.timelineItem, { opacity: getStepOpacity(step) }]}
            >
              {/* Icon Circle */}
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIconCircle,
                    {
                      backgroundColor: getIconColor(step),
                    },
                  ]}
                >
                  {step.icon === 'check-circle' && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                  {step.icon === 'search' && (
                    <MaterialIcons
                      name="search"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                  {step.icon === 'download' && (
                    <MaterialIcons
                      name="download"
                      size={20}
                      color="#FFF"
                      weight="bold"
                    />
                  )}
                </View>

                {/* Vertical Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      {
                        backgroundColor: step.completed ? '#4CAF50' : '#E0E0E0',
                      },
                    ]}
                  />
                )}
              </View>

              {/* Step Content */}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{step.title}</Text>
                {step.description && (
                  <Text style={styles.timelineDescription}>
                    {step.description}
                  </Text>
                )}
                {step.timestamp && (
                  <Text style={styles.timelineTimestamp}>{step.timestamp}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Applicant:</Text>
            <Text style={styles.detailValue}>{applicantName}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment:</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Completion:</Text>
            <View style={styles.completionValueContainer}>
              <Text style={styles.detailValue}>{estimatedCompletion}</Text>
              <MaterialIcons
                name="event"
                size={16}
                color="#999"
                style={styles.calendarIcon}
              />
            </View>
          </View>
        </View>

        {/* Contact Barangay Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.contactButtonWrapper}
            onPress={() => router.push('/help-center')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFE082', '#FFD54F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>Contact Barangay</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },

  // Summary Card
  summaryCardWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  summaryIconContainer: {
    marginRight: 12,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  summaryDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  summaryDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },

  // Timeline
  timelineContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 50,
  },
  timelineIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectorLine: {
    width: 3,
    height: 60,
    marginTop: -4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  timelineDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#BDBDBD',
    fontWeight: '500',
  },

  // Details Card
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  completionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  calendarIcon: {
    marginLeft: 6,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },

  // Button Container
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  contactButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFD54F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});

export default TrackRequestDetailScreen;
