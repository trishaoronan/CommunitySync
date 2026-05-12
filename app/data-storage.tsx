import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DataStorageScreen = () => {
  const router = useRouter();
  const [storageUsed, setStorageUsed] = useState(15); // MB

  const handleBackPress = () => {
    router.back();
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will free up space.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Mock cache clearing
            setStorageUsed(Math.max(0, storageUsed - 5));
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ]
    );
  };

  const handleViewDownloads = () => {
    Alert.alert('Downloaded Files', 'Viewing saved documents - Coming Soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#EEF4FD', '#FDFFED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Data and Storage</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Storage Information Card */}
        <View style={styles.storageCard}>
          {/* Card Title */}
          <Text style={styles.cardTitle}>Data & Storage</Text>

          {/* Downloaded Files Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="download" size={20} color="#1565C0" />
              <Text style={styles.sectionTitle}>Downloaded Files</Text>
            </View>
            <Text style={styles.sectionDescription}>
              View and manage saved documents
            </Text>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={handleViewDownloads}
            >
              <Text style={styles.linkText}>View Downloads →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Clear Cache Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="cleaning-services" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Clear Cache</Text>
            </View>
            <Text style={styles.sectionDescription}>Free up space</Text>
            <TouchableOpacity
              style={styles.sectionLink}
              onPress={handleClearCache}
            >
              <Text style={styles.linkText}>Clear Cache →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Storage Usage Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="storage" size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Storage Usage</Text>
            </View>
            <View style={styles.storageBar}>
              <View
                style={[
                  styles.storageProgress,
                  { width: `${Math.min((storageUsed / 100) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.storageValue}>{storageUsed} MB used</Text>
          </View>

          {/* Storage Breakdown */}
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownDot} />
              <Text style={styles.breakdownLabel}>App Cache</Text>
              <Text style={styles.breakdownSize}>~3 MB</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.breakdownLabel}>Documents</Text>
              <Text style={styles.breakdownSize}>~8 MB</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.breakdownLabel}>Media Uploads</Text>
              <Text style={styles.breakdownSize}>~4 MB</Text>
            </View>
          </View>
        </View>

        {/* Info Boxes */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <MaterialIcons name="cloud-upload" size={20} color="#1565C0" />
            <Text style={styles.infoText}>
              Images and documents are securely stored in the cloud and can be accessed anytime.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="security" size={20} color="#1565C0" />
            <Text style={styles.infoText}>
              Your data is encrypted and protected with industry-standard security measures.
            </Text>
          </View>
        </View>

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
  headerGradient: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  storageCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  sectionLink: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  storageBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  storageValue: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  breakdownContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginRight: 8,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  breakdownSize: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});

export default DataStorageScreen;
