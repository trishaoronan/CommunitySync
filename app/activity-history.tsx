import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Activity {
  id: string;
  title: string;
  type: 'payment' | 'request';
  document: string;
  amount: string;
  status: 'pending' | 'completed';
  date: string;
  time: string;
}

const ActivityHistoryScreen = () => {
  const router = useRouter();

  // Extended activity list
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Payment Submitted',
      type: 'payment',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'completed',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
    {
      id: '2',
      title: 'Requested A Document',
      type: 'request',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'completed',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
    {
      id: '3',
      title: 'Payment Submitted',
      type: 'payment',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'pending',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
    {
      id: '4',
      title: 'Requested A Document',
      type: 'request',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'pending',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
    {
      id: '5',
      title: 'Payment Submitted',
      type: 'payment',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'pending',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
    {
      id: '6',
      title: 'Requested A Document',
      type: 'request',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'pending',
      date: 'January 15, 2026',
      time: '4:00 PM',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Activity List */}
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            {/* Icon Container */}
            <View
              style={[
                styles.activityIconContainer,
                {
                  backgroundColor:
                    activity.type === 'payment' ? '#D1C4E9' : '#B2E0D8',
                },
              ]}
            >
              {activity.type === 'payment' ? (
                <MaterialIcons
                  name="payment"
                  size={32}
                  color={activity.type === 'payment' ? '#512DA8' : '#00695C'}
                />
              ) : (
                <MaterialIcons
                  name="description"
                  size={32}
                  color="#00695C"
                />
              )}
            </View>

            {/* Content */}
            <View style={styles.activityContent}>
              <View style={styles.titleRow}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        activity.status === 'pending' ? '#90CAF9' : '#A5D6A7',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          activity.status === 'pending' ? '#1565C0' : '#2E7D32',
                      },
                    ]}
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.documentName}>{activity.document}</Text>

              <View style={styles.detailsRow}>
                <Text style={styles.amount}>{activity.amount}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.dateTime}>
                  {activity.date} • {activity.time}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  documentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  separator: {
    fontSize: 12,
    color: '#999',
  },
  dateTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
});

export default ActivityHistoryScreen;
