import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Simple Localization System
type LanguageType = 'en' | 'fil';

interface Translations {
  [key: string]: {
    en: string;
    fil: string;
  };
}

const translations: Translations = {
  title: {
    en: 'Language',
    fil: 'Wika',
  },
  filipinoLanguage: {
    en: 'Filipino',
    fil: 'Filipino',
  },
  englishLanguage: {
    en: 'English',
    fil: 'Ingles',
  },
  saveChanges: {
    en: 'Save Changes',
    fil: 'I-save ang mga Pagbabago',
  },
  languageUpdated: {
    en: 'Language Updated',
    fil: 'Nag-update ang Wika',
  },
  languageChangedSuccess: {
    en: 'Your language preference has been saved.',
    fil: 'Nakatipid na ang iyong kagustuhan sa wika.',
  },
};

const t = (key: string, language: LanguageType): string => {
  return translations[key]?.[language] || key;
};

const LanguageSettingsScreen = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('en');
  const [isSaving, setIsSaving] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleLanguageSelect = (language: LanguageType) => {
    setSelectedLanguage(language);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);

    // Simulate saving to storage
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        t('languageUpdated', selectedLanguage),
        t('languageChangedSuccess', selectedLanguage),
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('title', selectedLanguage)}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Gradient Background with Globe Icon */}
      <LinearGradient
        colors={['#0a7ea4', '#FFC107']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <MaterialIcons name="public" size={80} color="#FFF" style={styles.globeIcon} />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Language Selection Card */}
        <View style={styles.selectionCard}>

          {/* Filipino Option */}
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => handleLanguageSelect('fil')}
          >
            <Text style={styles.languageText}>{t('filipinoLanguage', selectedLanguage)}</Text>
            <View
              style={[
                styles.radioButton,
                selectedLanguage === 'fil' && styles.radioButtonSelected,
              ]}
            >
              {selectedLanguage === 'fil' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* English Option */}
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text style={styles.languageText}>{t('englishLanguage', selectedLanguage)}</Text>
            <View
              style={[
                styles.radioButton,
                selectedLanguage === 'en' && styles.radioButtonSelected,
              ]}
            >
              {selectedLanguage === 'en' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? '...' : t('saveChanges', selectedLanguage)}
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  // Gradient Header
  gradientHeader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  globeIcon: {
    opacity: 0.9,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  // Selection Card
  selectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  // Language Option
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },

  // Radio Button
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  radioButtonSelected: {
    borderColor: '#0a7ea4',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0a7ea4',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default LanguageSettingsScreen;
