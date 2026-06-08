import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import RegistrationFlow from "./registration";

const { width, height } = Dimensions.get("window");

// ============ SPLASH SCREEN COMPONENT ============
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [splashState, setSplashState] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade-in and scale animation
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer1 = setTimeout(() => setSplashState(1), 1500);

    // Pulse/bounce effect
    const timer2 = setTimeout(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1800);

    // Background transition animation
    const timer3 = setTimeout(() => {
      setSplashState(2);
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }, 3000);

    // Final fade out and complete
    const timer4 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete());
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete, scaleAnim, opacityAnim, rotateAnim, bgAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "15deg"],
  });

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#FFF9B1"],
  });

  return (
    <Animated.View
      style={[
        styles.splashContainer,
        {
          backgroundColor: splashState === 0 ? "#FFFFFF" : bgColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.splashLogoContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }, { rotate }],
          },
        ]}
      >
        <Image
          source={require("@/assets/pics/logo-communitysync.png")}
          style={styles.splashLogo}
          contentFit="contain"
        />
        {/* Glow effect background */}
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

// ============ ONBOARDING SCREEN COMPONENT ============
interface OnboardingSlide {
  id: string;
  headline: string;
  description: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    headline: "Public Service, Redefined.",
    description:
      "Skip the lines and manage your barangay documents with a single tap. Your community is now at your fingertips.",
  },
  {
    id: "2",
    headline: "Stay Synced with Your Barangay.",
    description:
      "Empowering residents through digital connection. Get real-time updates and participate in building a better Pulong Buhangin together.",
  },
  {
    id: "3",
    headline: "Your Community, Your App.",
    description:
      "Fast, secure, and reliable. Bridging the gap between the barangay hall and your home for a more seamless experience.",
  },
];

const OnboardingScreen = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlide(currentIndex);
  };

  const handleSlidePress = () => {
    if (currentSlide === onboardingSlides.length - 1) {
      onGetStarted();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentSlide + 1,
        animated: true,
      });
    }
  };

  const renderSlide = ({
    item,
    index,
  }: {
    item: OnboardingSlide;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.slide}
      onPress={handleSlidePress}
      activeOpacity={0.8}
    >
      <View style={styles.slideYellowSection}>
        <Text style={styles.slideHeadline}>{item.headline}</Text>
        <Image
          source={
            index === 0
              ? require("@/assets/pics/splashscreen1.png")
              : index === 1
                ? require("@/assets/pics/splashscreen2.png")
                : require("@/assets/pics/splashscreen3.png")
          }
          style={styles.illustrationImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.slideContentSection}>
        <Text style={styles.slideDescription}>{item.description}</Text>

        <View style={styles.footerContainer}>
          <View style={styles.paginationDots}>
            {onboardingSlides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      dotIndex === currentSlide ? "#333" : "#CCCCCC",
                    width: dotIndex === currentSlide ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {currentSlide === onboardingSlides.length - 1 && (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={onGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.onboardingContainer}>
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
        scrollEnabled={false}
      />
    </View>
  );
};

// ============ WELCOME SCREEN COMPONENT ============
const WelcomeScreen = ({
  onSignIn,
  onCreateAccount,
}: {
  onSignIn: () => void;
  onCreateAccount: () => void;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#EEF4FD", "#FDFFED"]} style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.neighborText}>Neighbor!</Text>
              <Text style={styles.subtitle}>
                Let&apos;s get you connected to your community
              </Text>
            </View>

            <View style={styles.heroContainer}>
              <Image
                source={require("@/assets/pics/welcome-neigbhor.png")}
                style={styles.heroImage}
                contentFit="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={onCreateAccount}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#6BB1F2", "#4A90E2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Create an Account →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={onSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// ============ SIGN IN SCREEN COMPONENT ============
const SignInScreen = ({
  onBack,
  onSignInSuccess,
}: {
  onBack: () => void;
  onSignInSuccess: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setAuthError("Email and password are required.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (!data.session) {
      setAuthError("Unable to sign in. Please try again.");
      return;
    }

    if (onSignInSuccess) {
      onSignInSuccess();
    }
  };

  return (
    <LinearGradient colors={["#EEF4FD", "#FDFFED"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#8BA3D1" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/pics/logo-communitysync.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.signInTitle}>Sign In</Text>
          <Text style={styles.welcomeBackText}>Welcome Back, SyncMates!</Text>
          <Text style={styles.subtitleText}>Request Document Today!</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email:</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="mail-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#AAA"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (authError) {
                  setAuthError(null);
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password:</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="lock-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#AAA"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (authError) {
                  setAuthError(null);
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.visibilityIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.helperContainer}>
          <View style={styles.helperTextWrapper}>
            <MaterialIcons name="lock" size={14} color="#4A90E2" />
            <Text style={styles.helperText}>Must be at least 8 characters</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {authError && <Text style={styles.errorText}>{authError}</Text>}

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6BB1F2", "#4A90E2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <MaterialIcons name="verified" size={16} color="#4A90E2" />
          <Text style={styles.securityText}>
            Secured login powered by CommunitySynс
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/pics/ios.png")}
              style={styles.socialIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/pics/google.png")}
              style={styles.socialIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/pics/facebook.png")}
              style={styles.socialIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.createLink}>Create one</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
};

// ============ MAIN APP FLOW COMPONENT ============
export default function AppFlow() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState("Splash");

  const handleSplashComplete = () => {
    setCurrentScreen("Onboarding");
  };

  const handleGetStarted = () => {
    setCurrentScreen("Welcome");
  };

  const handleSignIn = () => {
    setCurrentScreen("SignIn");
  };

  const handleCreateAccount = () => {
    setCurrentScreen("Registration");
  };

  const handleRegistrationComplete = (formData: any) => {
    setCurrentScreen("SignIn");
  };

  const handleRegistrationBack = () => {
    setCurrentScreen("Welcome");
  };

  const handleBackFromSignIn = () => {
    setCurrentScreen("Welcome");
  };

  const handleSignInSuccess = () => {
    // Navigate to resident dashboard
    router.replace({
      pathname: "/resident-dashboard",
      params: { toast: "login" },
    });
  };

  if (currentScreen === "Splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === "Onboarding") {
    return <OnboardingScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === "Welcome") {
    return (
      <WelcomeScreen
        onSignIn={handleSignIn}
        onCreateAccount={handleCreateAccount}
      />
    );
  }

  if (currentScreen === "Registration") {
    return (
      <RegistrationFlow
        onComplete={handleRegistrationComplete}
        onBack={handleRegistrationBack}
      />
    );
  }

  if (currentScreen === "SignIn") {
    return (
      <SignInScreen
        onBack={handleBackFromSignIn}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }
}

// ============ STYLES ============
const styles = StyleSheet.create({
  // Splash Styles
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 200,
    height: 150,
  },
  glowCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#4A90E2",
    opacity: 0.15,
    zIndex: -1,
  },

  // Onboarding Styles
  onboardingContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
    backgroundColor: "#FFFFFF",
  },
  slideYellowSection: {
    width: "100%",
    height: height * 0.5,
    backgroundColor: "#FFFBE6",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  illustrationImage: {
    width: "85%",
    height: "72%",
    marginTop: 0,
  },
  slideContentSection: {
    width: "100%",
    height: height * 0.5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  slideHeadline: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  slideDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 0,
    gap: 4,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  getStartedButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // Common Container Styles
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  contentWrapper: {
    gap: 24,
  },

  // Logo Styles
  logoContainer: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logo: {
    width: 110,
    height: 40,
  },

  // Welcome Screen Styles
  headerContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    paddingRight: 20,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "600",
    color: "#2D3E50",
    lineHeight: 56,
    marginBottom: 0,
    textAlign: "left",
  },
  neighborText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#4A90E2",
    lineHeight: 56,
    marginBottom: 12,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 15,
    color: "#8BA3D1",
    lineHeight: 22,
    textAlign: "left",
    fontWeight: "500",
  },
  heroContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F0F4F9",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  createAccountButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 0,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signInLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90E2",
  },
  footerText: {
    fontSize: 13,
    color: "#666666",
  },

  // Back Button
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 163, 209, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  // Sign In Screen Styles
  signInTitle: {
    fontSize: 40,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 4,
  },
  welcomeBackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3E50",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: "#888",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3E50",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E8F3",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  visibilityIcon: {
    marginLeft: 10,
    padding: 4,
  },
  helperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  helperTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  helperText: {
    fontSize: 12,
    color: "#4A90E2",
    marginLeft: 4,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  forgotPasswordLink: {
    fontSize: 12,
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  signInButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: "#4A90E2",
    marginLeft: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D8E8",
  },
  dividerText: {
    fontSize: 12,
    color: "#888",
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E8F3",
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
  createAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 13,
    color: "#666",
  },
  createLink: {
    fontSize: 13,
    color: "#4A90E2",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
