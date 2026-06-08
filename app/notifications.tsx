import { useNotifications } from '@/hooks/use-notifications';
import type { Notification, NotificationType } from '@/types/database';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type FilterKey = 'all' | 'request' | 'payments' | 'announcements';

type NotificationStyle = {
  icon: string;
  backgroundColor: string;
  textColor: string;
};

const TYPE_STYLES: Record<NotificationType, NotificationStyle> = {
  request: {
    icon: 'description',
    backgroundColor: '#E3F2FD',
    textColor: '#1976D2',
  },
  payment: {
    icon: 'account-balance-wallet',
    backgroundColor: '#FFF3E0',
    textColor: '#FF9800',
  },
  announcement: {
    icon: 'notifications-active',
    backgroundColor: '#FFEBEE',
    textColor: '#C62828',
  },
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const NotificationsScreen = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { notifications, isLoading, markAsRead, markAllRead } = useNotifications();

  const getFiltered = () => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'payments') return notifications.filter((n) => n.type === 'payment');
    if (activeFilter === 'request') return notifications.filter((n) => n.type === 'request');
    if (activeFilter === 'announcements') return notifications.filter((n) => n.type === 'announcement');
    return notifications;
  };

  const handlePress = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    const requestId = notification.metadata?.request_id as string | undefined;
    if (requestId && (notification.type === 'request' || notification.type === 'payment')) {
      router.push({
        pathname: '/track-request-detail',
        params: { requestId },
      });
    }
  };

  const filteredNotifications = getFiltered();

  return (
    <LinearGradient colors={['#EEF4FD', '#FDFFED']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={markAllRead} style={styles.backButton}>
            <MaterialIcons name="done-all" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.filterContent}
          >
            {(['all', 'request', 'payments', 'announcements'] as FilterKey[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === filter && styles.filterTabTextActive,
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsContent}
        >
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#1565C0" />
            </View>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.request;
              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.is_read && styles.notificationCardUnread,
                  ]}
                  onPress={() => handlePress(notification)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: style.backgroundColor }]}
                  >
                    <MaterialIcons name={style.icon as any} size={24} color={style.textColor} />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationDescription}>{notification.body}</Text>
                  </View>

                  <Text style={styles.timestamp}>{formatTimestamp(notification.created_at)}</Text>

                  {!notification.is_read ? <View style={styles.unreadDot} /> : null}
                </TouchableOpacity>
              );
            })
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
  notificationCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#1565C0',
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
  unreadDot: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1565C0',
  },

  // Empty / Loading State
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
