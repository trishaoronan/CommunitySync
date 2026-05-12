import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Notification {
  id: string;
  type: 'payment' | 'request' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  documentName?: string;
}

const NotificationsScreen = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'request' | 'payments' | 'announcements'>('all');

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'payment',
      title: 'Payment Verified',
      description: 'Your payment for Barangay Clearance has been confirmed.',
      timestamp: 'March 15 | 5:00 PM',
      icon: 'account-balance-wallet',
      backgroundColor: '#FFF3E0',
      textColor: '#FF9800',
      documentName: 'Barangay Clearance',
    },
    {
      id: '2',
      type: 'request',
      title: 'Request Approved',
      description: 'Your Barangay Clearance is ready for download.',
      timestamp: 'March 15 | 5:00 PM',
      icon: 'description',
      backgroundColor: '#E3F2FD',
      textColor: '#1976D2',
      documentName: 'Barangay Clearance',
    },
    {
      id: '3',
      type: 'request',
      title: 'Action Required',
      description: 'Please upload your proof of payment to continue.',
      timestamp: 'March 15 | 5:00 PM',
      icon: 'schedule',
      backgroundColor: '#FCE4EC',
      textColor: '#E91E63',
    },
    {
      id: '4',
      type: 'announcement',
      title: 'Barangay Announcement',
      description: 'Office will be closed on April 9 (Holiday).',
      timestamp: 'March 15 | 5:00 PM',
      icon: 'notifications-active',
      backgroundColor: '#FFEBEE',
      textColor: '#C62828',
    },
    {
      id: '5',
      type: 'request',
      title: 'Request Update',
      description: 'Your request is currently being reviewed by the barangay staff.',
      timestamp: 'March 15 | 5:00 PM',
      icon: 'update',
      backgroundColor: '#E8F5E9',
      textColor: '#2E7D32',
    },
  ];

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'payments') return notifications.filter((n) => n.type === 'payment');
    if (activeFilter === 'request') return notifications.filter((n) => n.type === 'request');
    if (activeFilter === 'announcements') return notifications.filter((n) => n.type === 'announcement');
    return notifications;
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification.type === 'payment' || (notification.type === 'request' && notification.title === 'Request Approved')) {
      // Navigate to transaction history detail
      router.push({
        pathname: '/transaction-detail',
        params: {
          name: notification.documentName || 'Document',
          status: 'completed',
          refNumber: `REQ-2026-${notification.id}234`,
          paymentMethod: 'Gcash',
          dateRequested: 'March 15, 2026',
          amount: '50.00',
          recipient: 'Pulong Buhangin, Santa Maria',
        },
      });
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <LinearGradient colors={['#EEF4FD', '#FDFFED']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.backButton} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.filterContent}
          >
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'all' && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'all' && styles.filterTabTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'request' && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter('request')}
            >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'request' && styles.filterTabTextActive,
              ]}
            >
              Request
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'payments' && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter('payments')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'payments' && styles.filterTabTextActive,
                ]}
              >
                Payments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'announcements' && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter('announcements')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === 'announcements' && styles.filterTabTextActive,
                ]}
              >
                Announcements
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Notifications List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsContent}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationCard}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.8}
              >
                {/* Icon Section */}
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: notification.backgroundColor },
                  ]}
                >
                  <MaterialIcons
                    name={notification.icon as any}
                    size={24}
                    color={notification.textColor}
                  />
                </View>

                {/* Text Section */}
                <View style={styles.textContainer}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                </View>

                {/* Timestamp */}
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-off" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

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
    paddingVertical: 16,
    backgroundColor: '#1565C0',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },

  // Filter Tabs
  filterTabsWrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    justifyContent: 'flex-start',
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1565C0',
    backgroundColor: 'white',
  },
  filterTabActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
    textAlign: 'center',
  },
  filterTabTextActive: {
    color: 'white',
  },

  // Notifications List
  notificationsContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    position: 'absolute',
    top: 16,
    right: 16,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default NotificationsScreen;
