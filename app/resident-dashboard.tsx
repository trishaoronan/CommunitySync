import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Document {
  id: string;
  title: string;
  dateRequested: string;
  dateGiven: string;
}

interface Activity {
  id: string;
  title: string;
  type: 'payment' | 'request';
  document: string;
  amount?: string;
  status: 'pending' | 'completed';
  date: string;
  time: string;
}

const ResidentDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);
  const [currentDownloadingDoc, setCurrentDownloadingDoc] = useState<string | null>(null);

  const documents: Document[] = [
    {
      id: '1',
      title: 'Barangay Clearance',
      dateRequested: 'January 6, 2026',
      dateGiven: 'January 15, 2026',
    },
    {
      id: '2',
      title: 'Business Permit',
      dateRequested: 'January 6, 2026',
      dateGiven: 'January 15, 2026',
    },
  ];

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

  const handleDownloadDocument = (docTitle: string) => {
    setCurrentDownloadingDoc(docTitle);
    setIsLoading(true);
    setDownloadProgress(0);
  };

  const handleNavigateFromDownloadComplete = () => {
    setIsDownloadComplete(false);
    setDownloadProgress(0);
    setCurrentDownloadingDoc(null);
  };

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Payment Submitted',
      type: 'payment',
      document: 'Barangay Clearance',
      amount: 'P50.00',
      status: 'pending',
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
  ];

  // Show loading screen if downloading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Image
              source={require('@/assets/pics/loading.png')}
              style={styles.loadingImage}
              resizeMode="contain"
            />
            <Text style={styles.loadingText}>Downloading {currentDownloadingDoc}...</Text>
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
      </SafeAreaView>
    );
  }

  // Show download complete screen
  if (isDownloadComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.downloadCompleteContainer}>
          <View style={styles.downloadCompleteContent}>
            <Text style={styles.downloadCompleteTitle}>Download Complete</Text>
            <Image
              source={require('@/assets/pics/download .png')}
              style={styles.downloadCompleteImage}
              resizeMode="contain"
            />
            <Text style={styles.downloadCompleteSubtitle}>{currentDownloadingDoc} is ready</Text>
            <Text style={styles.downloadCompleteMessage}>
              Check your files to view the PDF
            </Text>
            <Text style={styles.downloadCompleteMessage}>
              Thank you for using CommunitySync.
            </Text>
            <TouchableOpacity
              style={styles.backButton2}
              onPress={handleNavigateFromDownloadComplete}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#FFF9C4', '#B2DFDB', '#80DEEA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Notification Bell Icon */}
          <TouchableOpacity
            style={styles.bellIconButton}
            onPress={() => router.push('/notifications')}
          >
            <Image
              source={require('@/assets/pics/notifs.png')}
              style={styles.bellIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={require('../assets/pics/cat.png')}
                style={styles.profileImage}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>Stephanie Kim</Text>
                <MaterialIcons name="verified" size={20} color="#1976D2" />
              </View>
              <Text style={styles.profileEmail}>stephaniekim@gmail.com</Text>
              <View style={styles.residenceTag}>
                <Text style={styles.residenceText}>Verified Resident</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
          >
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/request-document')}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require('../assets/pics/document.png')}
                  style={styles.quickActionIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>Request{'\n'}Document</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/transaction-history')}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require('../assets/pics/transaction.png')}
                  style={styles.quickActionIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>Transaction{'\n'}History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => {
                setActiveTab('request');
                router.push('/track-request');
              }}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require('../assets/pics/track-request.png')}
                  style={[styles.quickActionIcon, styles.trackRequestIcon]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.quickActionText}>Track{'\n'}Request</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/help-center')}
            >
              <View style={styles.quickActionIconContainer}>
                <Image
                  source={require('../assets/pics/chatbot.png')}
                  style={styles.quickActionIcon}
                />
              </View>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* My Documents Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Documents</Text>
            <TouchableOpacity onPress={() => router.push('/transaction-history')}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="chevron-right" size={20} color="#1976D2" />
            </TouchableOpacity>
          </View>

          {documents.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentIconContainer}>
                <View style={styles.documentIcon}>
                  <View style={styles.documentIconInner}>
                    <MaterialIcons name="description" size={24} color="#FFF" />
                    <View style={styles.documentCheckmark}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentDate}>
                  Date Requested: {doc.dateRequested}
                </Text> 
                <Text style={styles.documentDate}>
                  Date Given: {doc.dateGiven}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownloadDocument(doc.title)}
              >
                <MaterialIcons name="download" size={16} color="#333" />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/activity-history')}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="chevron-right" size={20} color="#1976D2" />
            </TouchableOpacity>
          </View>

          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View
                style={[
                  styles.activityIconContainer,
                  {
                    backgroundColor:
                      activity.type === 'payment' ? '#FFE0B2' : '#B2DFDB',
                  },
                ]}
              >
                <View style={styles.activityIconInner}>
                  <MaterialIcons
                    name={activity.type === 'payment' ? 'account-balance-wallet' : 'description'}
                    size={26}
                    color={activity.type === 'payment' ? '#FF6F00' : '#00897B'}
                  />
                </View>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDocument}>
                  {activity.document}
                  {activity.amount && ` • ${activity.amount}`}
                </Text>
                <Text style={styles.activityDateTime}>
                  {activity.date} • {activity.time}
                </Text>
              </View>
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
                      color: activity.status === 'pending' ? '#1565C0' : '#2E7D32',
                    },
                  ]}
                >
                  {activity.status.charAt(0).toUpperCase() +
                    activity.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <LinearGradient
        colors={['#80DEEA', '#81C784', '#FFF9C4']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomNavigationGradient}
      >
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === 'home' && styles.navItemActive,
            ]}
            onPress={() => setActiveTab('home')}
          >
            <MaterialIcons
              name="home"
              size={24}
              color={activeTab === 'home' ? '#1565C0' : '#666'}
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
            style={[
              styles.navItem,
              activeTab === 'request' && styles.navItemActive,
            ]}
            onPress={() => {
              setActiveTab('request');
              router.push('/track-request');
            }}
          >
            <MaterialIcons
              name="description"
              size={24}
              color={activeTab === 'request' ? '#1565C0' : '#666'}
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
            style={[
              styles.navItem,
              activeTab === 'profile' && styles.navItemActive,
            ]}
            onPress={() => {
              setActiveTab('profile');
              router.push('/profile');
            }}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={activeTab === 'profile' ? '#1565C0' : '#666'}
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
            style={[
              styles.navItem,
              activeTab === 'settings' && styles.navItemActive,
            ]}
            onPress={() => {
              setActiveTab('settings');
              router.push('/settings');
            }}
          >
            <MaterialIcons
              name="settings"
              size={24}
              color={activeTab === 'settings' ? '#1565C0' : '#666'}
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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bellIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
  bellIconImage: {
    width: 24,
    height: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  profileEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  residenceTag: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  residenceText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
  },
  quickActionsScroll: {
    paddingHorizontal: 12,
  },
  quickActionCard: {
    width: 100,
    marginHorizontal: 8,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  trackRequestIcon: {
    width: 62,
    height: 62,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Sections
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },

  // Documents
  documentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  documentIconContainer: {
    marginRight: 12,
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FBC02D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  documentIconInner: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  documentCheckmark: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Activity
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  activityIconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDocument: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  activityDateTime: {
    fontSize: 11,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Bottom Navigation
  bottomNavigationGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {},
  navLabel: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#1565C0',
    fontWeight: '600',
  },

  bottomPadding: {
    height: 80,
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
});

export default ResidentDashboard;
