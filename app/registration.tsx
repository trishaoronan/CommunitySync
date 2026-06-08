import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface FormData {
  // Step 1
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  civilStatus: string;
  birthday: string;
  age: string;

  // Step 2
  email: string;
  contactNumber: string;
  municipality: string;
  barangay: string;
  streetAddress: string;

  // Step 3
  password: string;
  confirmPassword: string;
  consentDPA: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  gender?: string;
  civilStatus?: string;
  birthday?: string;
  email?: string;
  contactNumber?: string;
  streetAddress?: string;
  password?: string;
  confirmPassword?: string;
  consentDPA?: string;
}

const ProgressBar = ({ step }: { step: number }) => {
  const progress = (step / 3) * 100;
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.stepLabel}>Step {step}/3</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

// ============ STEP 1: Personal Information ============
const Step1 = ({
  formData,
  setFormData,
  onNext,
  onBack,
  errors,
  setErrors,
}: {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  onNext: () => void;
  onBack: () => void;
  errors: FormErrors;
  setErrors: (data: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
}) => {
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCivilStatusDropdown, setShowCivilStatusDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);

  const parseBirthday = (value: string) => {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      return null;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!year || !month || !day) {
      return null;
    }
    return new Date(year, month - 1, day);
  };

  const handleDateChange = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedBirthday = `${year}-${month}-${day}`;

    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() < date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
    ) {
      age--;
    }

    setBirthdayDate(date);
    setFormData((prev: FormData) => ({
      ...prev,
      birthday: formattedBirthday,
      age: age.toString(),
    }));

    if (errors.birthday) {
      setErrors((prev) => ({ ...prev, birthday: undefined }));
    }
  };

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed") {
      return;
    }
    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  };

  const handleNextStep = () => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formData.gender) {
      nextErrors.gender = "Please select a gender.";
    }

    if (!formData.civilStatus) {
      nextErrors.civilStatus = "Please select a civil status.";
    }

    if (!formData.birthday) {
      nextErrors.birthday = "Birthday is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      firstName: undefined,
      lastName: undefined,
      gender: undefined,
      civilStatus: undefined,
      birthday: undefined,
    }));
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.backNav}>
          <TouchableOpacity style={styles.backNavButton} onPress={onBack} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={22} color="#2D3E50" />
          </TouchableOpacity>
        </View>

        <ProgressBar step={1} />

        <Text style={styles.screenTitle}>Tell us about yourself</Text>

        {/* First Row: First Name and Middle Name */}
        <View style={styles.rowContainer}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter First Name"
              value={formData.firstName}
              onChangeText={(text) => {
                setFormData({ ...formData, firstName: text });
                if (errors.firstName) {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }
              }}
              placeholderTextColor="#AAA"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Middle Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Middle Name"
              value={formData.middleName}
              onChangeText={(text) =>
                setFormData({ ...formData, middleName: text })
              }
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        {/* Last Name */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChangeText={(text) => {
              setFormData({ ...formData, lastName: text });
              if (errors.lastName) {
                setErrors((prev) => ({ ...prev, lastName: undefined }));
              }
            }}
            placeholderTextColor="#AAA"
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
        </View>

        {/* Gender and Civil Status */}
        <View style={styles.rowContainer}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Gender:</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            >
              <Text style={styles.dropdownText}>
                {formData.gender || "Select"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
            {showGenderDropdown && (
              <View style={styles.dropdownMenu}>
                {["Male", "Female", "Other"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData({ ...formData, gender: option });
                      if (errors.gender) {
                        setErrors((prev) => ({ ...prev, gender: undefined }));
                      }
                      setShowGenderDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
          </View>

          <View style={styles.halfColumn}>
            <Text style={styles.label}>Civil Status:</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setShowCivilStatusDropdown(!showCivilStatusDropdown)
              }
            >
              <Text style={styles.dropdownText}>
                {formData.civilStatus || "Select"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
            {showCivilStatusDropdown && (
              <View style={styles.dropdownMenu}>
                {["Single", "Married", "Widowed", "Separated"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData({ ...formData, civilStatus: option });
                      if (errors.civilStatus) {
                        setErrors((prev) => ({
                          ...prev,
                          civilStatus: undefined,
                        }));
                      }
                      setShowCivilStatusDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.civilStatus && (
              <Text style={styles.errorText}>{errors.civilStatus}</Text>
            )}
          </View>
        </View>

        {/* Birthday and Age */}
        <View style={styles.rowContainer}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Birthday:</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={
                  formData.birthday ? styles.inputText : styles.placeholderText
                }
              >
                {formData.birthday || "Select date"}
              </Text>
              <MaterialIcons name="calendar-today" size={18} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={
                    birthdayDate ??
                    parseBirthday(formData.birthday) ??
                    new Date()
                  }
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  maximumDate={new Date()}
                  onChange={handlePickerChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerDone}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {errors.birthday && (
              <Text style={styles.errorText}>{errors.birthday}</Text>
            )}
          </View>

          <View style={styles.halfColumn}>
            <Text style={styles.label}>Age:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#F5F5F5" }]}
              placeholder="Auto-calculated"
              value={formData.age}
              editable={false}
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6BB1F2", "#4A90E2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ============ STEP 2: Contact and Residency ============
const Step2 = ({
  formData,
  setFormData,
  onNext,
  onBack,
  errors,
  setErrors,
}: {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  onNext: () => void;
  onBack: () => void;
  errors: FormErrors;
  setErrors: (data: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
}) => {
  const handleContactChange = (text: string) => {
    // Allow only numbers and format as 09XX-XXX-XXXX
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      if (cleaned.startsWith("09")) {
        setFormData({ ...formData, contactNumber: cleaned });
      } else if (cleaned === "" || cleaned.startsWith("0")) {
        setFormData({ ...formData, contactNumber: cleaned });
      }
    }
  };

  const handleNextStep = () => {
    const nextErrors: FormErrors = {};
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.contactNumber) {
      nextErrors.contactNumber = "Contact number is required.";
    } else if (
      !formData.contactNumber.startsWith("09") ||
      formData.contactNumber.length !== 11
    ) {
      nextErrors.contactNumber =
        "Contact number must start with 09 and have 11 digits.";
    }

    if (!formData.streetAddress.trim()) {
      nextErrors.streetAddress = "Street address is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      email: undefined,
      contactNumber: undefined,
      streetAddress: undefined,
    }));
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressBar step={2} />

        <Text style={styles.screenTitle}>Contact and Residency</Text>

        {/* Email */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            keyboardType="email-address"
            placeholderTextColor="#AAA"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Contact Number */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="09XX-XXX-XXXX"
            value={formData.contactNumber}
            onChangeText={(text) => {
              handleContactChange(text);
              if (errors.contactNumber) {
                setErrors((prev) => ({ ...prev, contactNumber: undefined }));
              }
            }}
            keyboardType="phone-pad"
            maxLength={11}
            placeholderTextColor="#AAA"
          />
          {errors.contactNumber && (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          )}
        </View>

        {/* Municipality and Barangay */}
        <View style={styles.rowContainer}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Municipality/City:</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.municipality}
              editable={false}
              placeholderTextColor="#AAA"
            />
          </View>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Barangay:</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.barangay}
              editable={false}
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        {/* Street Address */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Complete Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={formData.streetAddress}
            onChangeText={(text) => {
              setFormData({ ...formData, streetAddress: text });
              if (errors.streetAddress) {
                setErrors((prev) => ({ ...prev, streetAddress: undefined }));
              }
            }}
            placeholderTextColor="#AAA"
          />
          {errors.streetAddress && (
            <Text style={styles.errorText}>{errors.streetAddress}</Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButtonHalf} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButtonHalf}
            onPress={handleNextStep}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#6BB1F2", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ============ STEP 3: Security and Consent ============
const Step3 = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
  errors,
  setErrors,
  authError,
}: {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  onBack: () => void;
  onSubmit: () => void;
  errors: FormErrors;
  setErrors: (data: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
  authError: string | null;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.consentDPA) {
      nextErrors.consentDPA =
        "Please acknowledge the Data Privacy Act consent.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      password: undefined,
      confirmPassword: undefined,
      consentDPA: undefined,
    }));
    onSubmit();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressBar step={3} />

        <Text style={styles.screenTitle}>Account Security and Consent</Text>

        {/* Password */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.fullColumn}>
          <Text style={styles.label}>Confirm Password:</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* DPA Consent */}
        <View style={styles.consentContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              setFormData({ ...formData, consentDPA: !formData.consentDPA });
              if (errors.consentDPA) {
                setErrors((prev) => ({ ...prev, consentDPA: undefined }));
              }
            }}
          >
            <View
              style={[
                styles.checkboxBox,
                formData.consentDPA && styles.checkboxBoxChecked,
              ]}
            >
              {formData.consentDPA && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.consentText}>
            I acknowledge and consent to the collection and processing of my
            personal data under the{" "}
            <Text style={styles.consentBold}>
              Data Privacy Act (DPA of 2025)
            </Text>
          </Text>
          {errors.consentDPA && (
            <Text style={styles.errorText}>{errors.consentDPA}</Text>
          )}
        </View>

        {/* Buttons */}
        {authError && <Text style={styles.errorText}>{authError}</Text>}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButtonHalf} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButtonHalf}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#6BB1F2", "#4A90E2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ============ MAIN REGISTRATION COMPONENT ============
export default function RegistrationFlow({
  onComplete,
  onBack,
}: {
  onComplete: (data: FormData) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    civilStatus: "",
    birthday: "",
    age: "",
    email: "",
    contactNumber: "",
    municipality: "Santa Maria",
    barangay: "Pulong Buhangin",
    streetAddress: "",
    password: "",
    confirmPassword: "",
    consentDPA: false,
  });

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

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

  const handleSubmit = async () => {
    setAuthError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrors((prev) => ({
        ...prev,
        firstName: !formData.firstName.trim()
          ? "First name is required."
          : prev.firstName,
        lastName: !formData.lastName.trim()
          ? "Last name is required."
          : prev.lastName,
      }));
      setCurrentStep(1);
      return;
    }

    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      setCurrentStep(2);
      return;
    }

    if (formData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters.",
      }));
      setCurrentStep(3);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      setCurrentStep(3);
      return;
    }

    if (!formData.consentDPA) {
      setErrors((prev) => ({
        ...prev,
        consentDPA: "Please acknowledge the Data Privacy Act consent.",
      }));
      setCurrentStep(3);
      return;
    }

    // Trigger loading screen
    setIsLoading(true);
    setDownloadProgress(0);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        // These keys are read by the handle_new_user trigger via
        // NEW.raw_user_meta_data. Key names must stay in sync with the
        // trigger's ->>'...' accessors.
        data: {
          first_name: formData.firstName.trim(),
          middle_name: formData.middleName.trim() || null,
          last_name: formData.lastName.trim(),
          email,
          gender: formData.gender,
          birthday: formData.birthday,
          civil_status: formData.civilStatus,
          phone: formData.contactNumber.trim(),
          address: formData.streetAddress.trim(),
          age: formData.age || null,
        },
      },
    });

    if (error) {
      setIsLoading(false);
      setDownloadProgress(0);
      setAuthError(
        error.message || "Unable to create account. Please try again.",
      );
      setCurrentStep(3);
      return;
    }

    if (!data.session) {
      setIsLoading(false);
      setDownloadProgress(0);
      setAuthError(
        "Please check your email to confirm your account before signing in.",
      );
      setCurrentStep(3);
      return;
    }

    // Upsert profile columns directly after signup.
    // Using upsert (not update) because the auth trigger that creates the
    // profile row runs asynchronously — the row may not exist yet when this
    // executes, and update() would silently match zero rows.
    const middleName = formData.middleName.trim();
    const fullName = [
      formData.firstName.trim(),
      middleName || null,
      formData.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.session.user.id,
      full_name: fullName,
      first_name: formData.firstName.trim(),
      middle_name: middleName || null,
      last_name: formData.lastName.trim(),
      email,
      gender: formData.gender,
      birthday: formData.birthday,
      civil_status: formData.civilStatus,
      phone: formData.contactNumber.trim(),
      address: formData.streetAddress.trim(),
      age: formData.age ? parseInt(formData.age, 10) : null,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile upsert error after signup:", profileError);
    }

    setErrors({});
    setAuthError(null);
    setIsLoading(false);
    setDownloadProgress(0);
    router.replace({
      pathname: "/resident-dashboard",
      params: { toast: "signup" },
    });
  };

  const handleNavigateFromDownloadComplete = () => {
    // Navigate to resident dashboard
    router.push("/resident-dashboard");
  };

  return (
    <LinearGradient colors={["#EEF4FD", "#FDFFED"]} style={styles.background}>
      {/* Loading Screen */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Image
              source={require("@/assets/pics/loading.png")}
              style={styles.loadingImage}
              resizeMode="contain"
            />
            <Text style={styles.loadingText}>Creating Your Account...</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${downloadProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(downloadProgress)}%
            </Text>
          </View>
        </View>
      )}

      {/* Download Complete Screen */}
      {isDownloadComplete && (
        <View style={styles.downloadCompleteContainer}>
          <View style={styles.downloadCompleteContent}>
            <Text style={styles.downloadCompleteTitle}>Account Created!</Text>
            <Image
              source={require("@/assets/pics/download .png")}
              style={styles.downloadCompleteImage}
              resizeMode="contain"
            />
            <Text style={styles.downloadCompleteSubtitle}>
              Welcome to CommunitySync
            </Text>
            <Text style={styles.downloadCompleteMessage}>
              Your account has been successfully created.
            </Text>
            <Text style={styles.downloadCompleteMessage}>
              Let&apos;s get started with your first request.
            </Text>
            <TouchableOpacity
              style={styles.backButton2}
              onPress={handleNavigateFromDownloadComplete}
            >
              <Text style={styles.backButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Form Steps (shown when not loading/complete) */}
      {!isLoading && !isDownloadComplete && (
        <>
          {currentStep === 1 && (
            <Step1
              formData={formData}
              setFormData={setFormData}
              onNext={handleNextStep}
              onBack={router.back}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              onNext={handleNextStep}
              onBack={handleBackStep}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              setFormData={setFormData}
              onBack={handleBackStep}
              onSubmit={handleSubmit}
              errors={errors}
              setErrors={setErrors}
              authError={authError}
            />
          )}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backNav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3E50",
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#D0D8E8",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  halfColumn: {
    flex: 1,
  },
  fullColumn: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3E50",
    marginBottom: 8,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    fontSize: 14,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E8F3",
  },
  datePickerDone: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  datePickerDoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90E2",
  },
  inputText: {
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    fontSize: 14,
    color: "#AAA",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  readOnlyInput: {
    backgroundColor: "#F5F5F5",
    color: "#999",
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    paddingTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#4A90E2",
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  consentBold: {
    fontWeight: "600",
    color: "#2D3E50",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  nextButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 24,
  },
  nextButtonHalf: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  backButtonHalf: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
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

  // Loading Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  loadingImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 30,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#1976D2",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
  },

  // Download Complete Screen Styles
  downloadCompleteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  downloadCompleteContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  downloadCompleteTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  downloadCompleteImage: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  downloadCompleteSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  downloadCompleteMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  backButton2: {
    backgroundColor: "#FFEB3B",
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 40,
  },
});
