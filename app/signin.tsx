import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

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

    // Navigate to resident dashboard after successful sign in
    router.replace({
      pathname: "/resident-dashboard",
      params: { toast: "login" },
    });
  };

  const handleCreateAccount = () => {
    router.back();
  };

  return (
    <LinearGradient colors={["#EEF4FD", "#FDFFED"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#8BA3D1" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CommunitySync</Text>
        </View>

        {/* Sign In Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.signInTitle}>Sign In</Text>
          <Text style={styles.welcomeBackText}>Welcome Back, SyncMates!</Text>
          <Text style={styles.subtitleText}>Request Document Today!</Text>
        </View>

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Helper Text and Forgot Password */}
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

        {/* Sign In Button */}
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

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <MaterialIcons name="verified" size={16} color="#4A90E2" />
          <Text style={styles.securityText}>
            Secured login powered by CommunitySynс
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>🍎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Create Account Link */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createLink}>Create one</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 163, 209, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A90E2",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  signInTitle: {
    fontSize: 32,
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
  buttonGradient: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
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
  socialButtonText: {
    fontSize: 28,
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
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
