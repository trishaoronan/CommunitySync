import { MaterialIcons } from '@expo/vector-icons';
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

interface RequestedDocument {
  id: string;
  name: string;
  paymentMethod: string;
  dateRequested: string;
  status: 'completed' | 'unpaid' | 'pending';
}

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('request');

  const requestedDocuments: RequestedDocument[] = [
    {
      id: '1',
      name: 'Business Permit',
      paymentMethod: 'Paid Via Gcash',
      dateRequested: 'March 15, 2026',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Barangay Clearance',
      paymentMethod: 'Paid Via Gcash',
      dateRequested: 'March 15, 2026',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Burial Assistance',
      paymentMethod: 'Paid Via Gcash',
      dateRequested: 'March 15, 2026',
      status: 'unpaid',
    },
    {
      id: '4',
      name: 'Residency',
      paymentMethod: 'Paid Via Gcash',
      dateRequested: 'March 15, 2026',
      status: 'unpaid',
    },
    {
      id: '5',
      name: 'Indigency',
      paymentMethod: 'Paid Via Gcash',
      dateRequested: 'March 15, 2026',
      status: 'unpaid',
    },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'unpaid':
        return '#FF9800';
      case 'pending':
        return '#FFC107';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleDocumentPress = (doc: RequestedDocument) => {
    router.push({
      pathname: '/transaction-detail',
      params: {
        name: doc.name,
        status: doc.status,
        refNumber: `REQ-2026-${doc.id}234`,
        paymentMethod: doc.paymentMethod.replace('Paid Via ', ''),
        dateRequested: doc.dateRequested,
        amount: '50.00',
        recipient: 'Pulong Buhangin, Santa Maria',
      },
    });
  };

  const renderDocumentCard = (doc: RequestedDocument) => (
    <TouchableOpacity
      key={doc.id}
      style={styles.documentCard}
      onPress={() => handleDocumentPress(doc)}
      activeOpacity={0.7}
    >
      <View style={styles.documentContent}>
        <Text style={styles.documentName}>{doc.name}</Text>
        <View style={styles.documentMeta}>
          <Text style={styles.paymentMethod}>{doc.paymentMethod}</Text>
          <Text style={styles.dateRequested}>{doc.dateRequested}</Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(doc.status) },
        ]}
      >
        <MaterialIcons name="check-circle" size={16} color="#FFF" />
        <Text style={styles.statusText}>{getStatusText(doc.status)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Document List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {requestedDocuments.map((doc) => renderDocumentCard(doc))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('home');
            router.push('/resident-dashboard');
          }}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === 'home' ? '#1976D2' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'request' && styles.navItemActive]}
          onPress={() => setActiveTab('request')}
        >
          <MaterialIcons
            name="description"
            size={24}
            color={activeTab === 'request' ? '#1976D2' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'request' && styles.navLabelActive,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('profile');
            router.push('/profile');
          }}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={activeTab === 'profile' ? '#1976D2' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'profile' && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'settings' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('settings');
            router.push('/settings');
          }}
        >
          <MaterialIcons
            name="settings"
            size={24}
            color={activeTab === 'settings' ? '#1976D2' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'settings' && styles.navLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  documentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentContent: {
    flex: 1,
    marginRight: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  documentMeta: {
    marginTop: 4,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateRequested: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },

  // Bottom Navigation
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: '#1976D2',
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
});

export default TransactionHistoryScreen;
