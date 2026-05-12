import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

interface DocumentType {
  id: string;
  name: string;
}

const RequestDocumentScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('request');

  const documents: DocumentType[] = [
    { id: '1', name: 'Barangay Clearance' },
    { id: '2', name: 'Business Permit' },
    { id: '3', name: 'Blotter/Incident Report' },
    { id: '4', name: 'Burial Assistance Application' },
    { id: '5', name: 'Certificate of Residency' },
    { id: '6', name: 'Certificate of Indigency' },
    { id: '7', name: 'Certificate of Good Moral Character' },
    { id: '8', name: 'Certificate of Solo Parent' },
    { id: '9', name: 'Barangay ID' },
    { id: '10', name: 'Certificate of Low Income' },
    { id: '11', name: 'Certificate of No Derogatory Record' },
    { id: '12', name: 'Certificate of Non-Employment' },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleDocumentSelect = (documentName: string) => {
    router.push({
      pathname: '/document-form',
      params: { documentName },
    });
  };

  const renderDocumentItem = ({ item }: { item: DocumentType }) => (
    <TouchableOpacity
      style={styles.documentButton}
      onPress={() => handleDocumentSelect(item.name)}
    >
      <Text style={styles.documentButtonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request A Document</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="#FFA500" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Select a document to start your request</Text>
      </View>

      {/* Document Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />

        {/* Other Document Button - Centered */}
        <View style={styles.otherDocumentContainer}>
          <TouchableOpacity
            style={styles.otherDocumentButton}
            onPress={() => handleDocumentSelect('Other Barangay Documents')}
          >
            <Text style={styles.documentButtonText}>Other Barangay Documents</Text>
          </TouchableOpacity>
        </View>

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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  documentButton: {
    width: itemWidth,
    backgroundColor: '#FFFACD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  documentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  otherDocumentContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  otherDocumentButton: {
    width: itemWidth,
    backgroundColor: '#FFFACD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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

export default RequestDocumentScreen;
