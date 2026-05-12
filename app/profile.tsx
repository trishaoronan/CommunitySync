import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  age: string;
  gender: string;
  civilStatus: string;
  email: string;
  contactNumber: string;
  address: string;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Stephanie',
    lastName: 'Kim',
    birthday: 'September 4, 2004',
    age: '21',
    gender: 'Female',
    civilStatus: 'Single',
    email: 'stephaniekim@gmail.com',
    contactNumber: '0922-323-9218',
    address: '7632 Bagong Bario Sta.Maria Bulacan',
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSaveProfile = () => {
    if (!editData.firstName || !editData.lastName || !editData.email || !editData.contactNumber || !editData.address) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setProfileData(editData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Avatar Container */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/pics/cat.png')}
            style={styles.avatar}
          />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Top Section - Name and Address */}
          <View style={styles.topSection}>
            <Text style={styles.label}>Fullname:</Text>
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  placeholder="First Name"
                  value={editData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholderTextColor="#CCC"
                />
                <TextInput
                  style={styles.editInput}
                  placeholder="Last Name"
                  value={editData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholderTextColor="#CCC"
                />
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{profileData.firstName} {profileData.lastName}</Text>
                <MaterialIcons name="verified" size={18} color="#1976D2" />
              </View>
            )}

            {!isEditing && (
              <Text style={styles.addressText}>
                Pulong Buhangin Sta. Maria Bulacan
              </Text>
            )}
            <View style={styles.divider} />
          </View>

          {/* Grid Section - Birthday, Age, Gender, Civil Status */}
          <View style={styles.gridSection}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Birthday</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editGridInput}
                  value={editData.birthday}
                  onChangeText={(value) => handleInputChange('birthday', value)}
                  placeholderTextColor="#CCC"
                />
              ) : (
                <Text style={styles.gridValue}>{profileData.birthday}</Text>
              )}
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Age</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editGridInput}
                  value={editData.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  placeholderTextColor="#CCC"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.gridValue}>{profileData.age}</Text>
              )}
            </View>
          </View>

          <View style={styles.gridSection}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Gender</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editGridInput}
                  value={editData.gender}
                  onChangeText={(value) => handleInputChange('gender', value)}
                  placeholderTextColor="#CCC"
                />
              ) : (
                <Text style={styles.gridValue}>{profileData.gender}</Text>
              )}
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Civil Status</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editGridInput}
                  value={editData.civilStatus}
                  onChangeText={(value) => handleInputChange('civilStatus', value)}
                  placeholderTextColor="#CCC"
                />
              ) : (
                <Text style={styles.gridValue}>{profileData.civilStatus}</Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Bottom Section - Email, Contact, Address */}
          <View style={styles.bottomSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editFullInput}
                  value={editData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholderTextColor="#CCC"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{profileData.email}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Contact Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editFullInput}
                  value={editData.contactNumber}
                  onChangeText={(value) => handleInputChange('contactNumber', value)}
                  placeholderTextColor="#CCC"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{profileData.contactNumber}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Complete Address:</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editFullInput, { minHeight: 60 }]}
                  value={editData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  placeholderTextColor="#CCC"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>{profileData.address}</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancelEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <MaterialIcons name="edit" size={16} color="#333" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
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
          onPress={() => {
            setActiveTab('request');
            router.push('/request-document');
          }}
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
          onPress={() => setActiveTab('profile')}
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
    backgroundColor: '#F5F5F5',
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
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  // Avatar Container
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: '#F0F0F0',
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  // Top Section
  topSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 4,
    fontWeight: '500',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },

  // Edit Row
  editRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
  },
  editFullInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginTop: 4,
    marginBottom: 8,
  },

  // Grid Section
  gridSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridColumn: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 4,
    fontWeight: '500',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  editGridInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginRight: 6,
  },

  // Bottom Section
  bottomSection: {
    marginTop: 12,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },

  // Edit Profile Button
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#FFEB3B',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  // Button Row (Save/Cancel)
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FFEB3B',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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

export default ProfileScreen;
