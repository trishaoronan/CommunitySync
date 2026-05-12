import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const splashImages = [
  require('../assets/pics/splashscreen1.png'),
  require('../assets/pics/splashscreen2.png'),
  require('../assets/pics/splashscreen3.png'),
];

interface OnboardingSlide {
  id: string;
  headline: string;
  description: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    headline: 'Public Service, Redefined.',
    description:
      'Skip the lines and manage your barangay documents with a single tap. Your community is now at your fingertips.',
  },
  {
    id: '2',
    headline: 'Stay Synced with Your Barangay.',
    description:
      'Empowering residents through digital connection. Get real-time updates and participate in building a better Pulong Buhangin together.',
  },
  {
    id: '3',
    headline: 'Your Community, Your App.',
    description:
      'Fast, secure, and reliable. Bridging the gap between the barangay hall and your home for a more seamless experience.',
  },
];

// Splash Screen Component
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [splashState, setSplashState] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const splashSequence = [
      { delay: 1500, nextState: 1 },
      { delay: 1500, nextState: 2 },
      { delay: 1500, nextState: 3 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    splashSequence.forEach((item, index) => {
      const timer = setTimeout(() => {
        if (index === 2) {
          // On final state, start transition to onboarding
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            onComplete();
          }, 500);
        } else {
          setSplashState(item.nextState);
        } 
      }, item.delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [fadeAnim, onComplete]);

  return (
    <Animated.View
      style={[
        styles.splashContainer,
        {
          backgroundColor:
            splashState === 2 ? '#FFFFFF' : splashState === 3 ? '#FFF9B1' : '#FFFFFF',
        },
      ]}
    >
      {splashState >= 1 && (
        <View style={styles.logoContainer}>
          {/* Placeholder Logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>CommunitySync</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

// Info Slides Component
const InfoSlides: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlide(currentIndex);
  };

  const handleGetStarted = () => {
    console.log('Navigate to Login.');
    // Navigate to the main app (tabs)
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      {/* Yellow Header Section with Headline and Image */}
      <View style={styles.slideYellowSection}>
        <Text style={styles.slideHeadline}>{item.headline}</Text>
        {/* Splash Screen Image */}
        <Image
          source={splashImages[index]}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>

      {/* White Content Section */}
      <View style={styles.slideContentSection}>
        <Text style={styles.slideDescription}>{item.description}</Text>

        {/* Pagination Dots and Button */}
        <View style={styles.footerContainer}>
          <View style={styles.paginationDots}>
            {onboardingSlides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  {
                    backgroundColor: dotIndex === currentSlide ? '#333' : '#CCCCCC',
                    width: dotIndex === currentSlide ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Get Started Button on Last Slide */}
          {currentSlide === onboardingSlides.length - 1 && (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.infoSlidesContainer}>
      <View style={styles.infoSlidesContainer}>
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

// Main Onboarding Screen
export default function OnboardingScreen() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashComplete = () => {
    setShowOnboarding(true);
  };

  if (!showOnboarding) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <View style={styles.container}>
      <InfoSlides />
    </View>
  );
}

const styles = StyleSheet.create({
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
    textAlign: 'center',
  },

  // Info Slides Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  infoSlidesContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
    backgroundColor: '#FFFFFF',
  },
  slideYellowSection: {
    width: '100%',
    height: height * 0.50,
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  splashImage: {
    width: '85%',
    height: '72%',
    marginTop: 0,
  },
  slideContentSection: {
    width: '100%',
    height: height * 0.50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  slideHeadline: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  slideDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  footerContainer: {
    marginBottom: 4,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  getStartedButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
