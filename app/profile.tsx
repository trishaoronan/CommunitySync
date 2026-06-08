import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type EditValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
  gender: string;
  civil_status: string;
  email: string;
  phone: string;
  address: string;
};

const buildEditValues = (
  value: Profile | null,
  fallbackEmail?: string | null,
): EditValues => ({
  first_name: value?.first_name ?? "",
  middle_name: value?.middle_name ?? "",
  last_name: value?.last_name ?? "",
  birthday: value?.birthday ?? "",
  gender: value?.gender ?? "",
  civil_status: value?.civil_status ?? "",
  email: value?.email ?? fallbackEmail ?? "",
  phone: value?.phone ?? "",
  address: value?.address ?? "",
});

const ProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [authBirthday, setAuthBirthday] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [addressChangedAt, setAddressChangedAt] = useState<string | null>(null);
  const [femaleNameChangeUsed, setFemaleNameChangeUsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCivilStatusDropdown, setShowCivilStatusDropdown] = useState(false);
  const [editValues, setEditValues] = useState<EditValues>(
    buildEditValues(null),
  );

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setProfileError(null);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user ?? null;
      const metadataBirthday =
        typeof sessionUser?.user_metadata?.birthday === "string"
          ? sessionUser.user_metadata.birthday
          : null;
      const metadataAddressChangedAt =
        typeof sessionUser?.user_metadata?.address_changed_at === "string"
          ? sessionUser.user_metadata.address_changed_at
          : null;
      const metadataFemaleNameChangeUsed =
        sessionUser?.user_metadata?.female_name_change_used;
      const parsedFemaleNameChangeUsed =
        typeof metadataFemaleNameChangeUsed === "boolean"
          ? metadataFemaleNameChangeUsed
          : metadataFemaleNameChangeUsed === "true";

      setAuthBirthday(metadataBirthday);
      setAuthEmail(sessionUser?.email ?? null);
      setAddressChangedAt(metadataAddressChangedAt);
      setFemaleNameChangeUsed(parsedFemaleNameChangeUsed || false);

      if (!isMounted) return;

      if (sessionError || !sessionUser) {
        setProfile(null);
        setProfileError("Sign in required to view profile.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (!isMounted) return;

      if (error) {
        setProfile(null);
        setProfileError("Unable to load profile data.");
      } else {
        setProfile(data as Profile);
      }

      setIsLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setEditValues(buildEditValues(profile, authEmail));
  }, [profile, authEmail]);

  const handleBackPress = () => {
    router.back();
  };

  const updateEditValue = (field: keyof EditValues, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditPress = () => {
    setProfileError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileError(null);
    setEditValues(buildEditValues(profile, authEmail));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!profile) return;

    setIsSaving(true);
    setProfileError(null);

    const isFemale = (profile.gender ?? "").toLowerCase() === "female";
    const currentMiddleName = profile.middle_name ?? "";
    const currentLastName = profile.last_name ?? "";
    const nextMiddleName = editValues.middle_name.trim();
    const nextLastName = editValues.last_name.trim();
    const nameChangeRequested =
      nextMiddleName !== currentMiddleName || nextLastName !== currentLastName;

    const nextEmail = editValues.email.trim();
    const currentAddress = profile.address ?? "";
    const nextAddress = editValues.address.trim();
    const addressChanged = nextAddress !== currentAddress;
    const emailChanged = nextEmail !== currentEmail;

    if (!nextEmail) {
      setIsSaving(false);
      Alert.alert("Missing Info", "Email is required.");
      return;
    }

    if (emailChanged) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(nextEmail)) {
        setIsSaving(false);
        Alert.alert("Invalid Email", "Enter a valid email address.");
        return;
      }

      const { error: emailError } = await supabase.auth.updateUser({
        email: nextEmail,
      });

      if (emailError) {
        setProfileError("Unable to update email address.");
        setIsSaving(false);
        return;
      }
    }

    if (addressChanged && !canChangeAddress) {
      setIsSaving(false);
      Alert.alert(
        "Address Locked",
        addressNextAllowed
          ? `You can update your address again on ${addressNextAllowed.toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}.`
          : "Address changes are not available yet.",
      );
      return;
    }

    if (isFemale && nameChangeRequested && femaleNameChangeUsed) {
      setIsSaving(false);
      Alert.alert(
        "Name Locked",
        "Middle and last name can only be changed once.",
      );
      return;
    }

    const nextValues = {
      first_name: editValues.first_name.trim(),
      middle_name: nextMiddleName || null,
      last_name: nextLastName,
      civil_status: editValues.civil_status.trim(),
      email: nextEmail,
      phone: editValues.phone.trim(),
      address: editValues.address.trim(),
    };

    if (!nextValues.first_name || !nextValues.last_name) {
      setIsSaving(false);
      Alert.alert("Missing Info", "First and last name are required.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...nextValues, updated_at: new Date().toISOString() })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      setProfileError("Unable to save profile changes.");
      setIsSaving(false);
      return;
    }

    if (addressChanged) {
      const nowIso = new Date().toISOString();
      const { error: addressError } = await supabase.auth.updateUser({
        data: { address_changed_at: nowIso },
      });

      if (!addressError) {
        setAddressChangedAt(nowIso);
      }
    }

    if (isFemale && nameChangeRequested && !femaleNameChangeUsed) {
      const nowIso = new Date().toISOString();
      const { error: nameChangeError } = await supabase.auth.updateUser({
        data: {
          female_name_change_used: true,
          female_name_change_used_at: nowIso,
        },
      });

      if (!nameChangeError) {
        setFemaleNameChangeUsed(true);
      }
    }

    if (emailChanged) {
      setAuthEmail(nextEmail);
    }

    setProfile(data as Profile);
    setIsEditing(false);
    setIsSaving(false);
    Alert.alert(
      "Profile Updated",
      emailChanged
        ? "Changes saved. Confirm your new email to finish update."
        : "Your profile has been saved.",
    );
  };

  const formatBirthday = (value?: string) => {
    if (!value) return "—";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateAge = (value?: string) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const hasHadBirthday =
      today.getMonth() > date.getMonth() ||
      (today.getMonth() === date.getMonth() &&
        today.getDate() >= date.getDate());

    if (!hasHadBirthday) {
      age -= 1;
    }

    return age;
  };

  const fullName = [
    profile?.first_name,
    profile?.middle_name,
    profile?.last_name,
  ]
    .filter(
      (part): part is string =>
        typeof part === "string" && part.trim().length > 0,
    )
    .join(" ");
  const birthdaySource = profile?.birthday || authBirthday || "";
  const ageValue = calculateAge(birthdaySource);
  const displayName = isLoading ? "Loading..." : fullName || "Resident";
  const displayBirthday = formatBirthday(birthdaySource);
  const displayAge = ageValue === null ? "—" : String(ageValue);
  const displayGender = profile?.gender || "—";
  const displayCivilStatus = profile?.civil_status || "—";
  const displayEmail = profile?.email || authEmail || "—";
  const displayPhone = profile?.phone || "—";
  const displayAddress = profile?.address
    ? `${profile.address}, Santa Maria, Bulacan`
    : "Santa Maria, Bulacan";
  const editAgeValue = calculateAge(birthdaySource);
  const editAgeDisplay = editAgeValue === null ? "—" : String(editAgeValue);
  const currentEmail = authEmail || profile?.email || "";
  const addressCooldownMs = 60 * 24 * 60 * 60 * 1000;
  const addressLastChanged = addressChangedAt
    ? new Date(addressChangedAt)
    : null;
  const addressNextAllowed = addressLastChanged
    ? new Date(addressLastChanged.getTime() + addressCooldownMs)
    : null;
  const canChangeAddress =
    !addressLastChanged ||
    Date.now() >= addressLastChanged.getTime() + addressCooldownMs;
  const isFemale = (profile?.gender ?? "").toLowerCase() === "female";
  const nameChangeLocked = isFemale && femaleNameChangeUsed;
  const civilStatusOptions = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];
  const civilStatusDisplay = editValues.civil_status || displayCivilStatus;

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
            source={require("../assets/pics/cat.png")}
            style={styles.avatar}
          />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Top Section - Name and Address */}
          <View style={styles.topSection}>
            <Text style={styles.label}>Fullname:</Text>
            {isEditing ? (
              <>
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={editValues.first_name}
                    onChangeText={(value) =>
                      updateEditValue("first_name", value)
                    }
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  <TextInput
                    style={[
                      styles.editInput,
                      nameChangeLocked && styles.readOnlyInput,
                    ]}
                    value={editValues.middle_name}
                    onChangeText={(value) =>
                      updateEditValue("middle_name", value)
                    }
                    placeholder="Middle name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    editable={!nameChangeLocked}
                  />
                </View>
                <TextInput
                  style={[
                    styles.editFullInput,
                    nameChangeLocked && styles.readOnlyInput,
                  ]}
                  value={editValues.last_name}
                  onChangeText={(value) => updateEditValue("last_name", value)}
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  editable={!nameChangeLocked}
                />
                {nameChangeLocked ? (
                  <Text style={styles.hintText}>
                    Middle and last name can only be changed once.
                  </Text>
                ) : null}
              </>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{displayName}</Text>
                <MaterialIcons name="verified" size={18} color="#1976D2" />
              </View>
            )}
            <Text style={styles.addressText}>
              Pulong Buhangin Sta. Maria Bulacan
            </Text>
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#1976D2" />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : null}
            {profileError ? (
              <Text style={styles.errorText}>{profileError}</Text>
            ) : null}
            <View style={styles.divider} />
          </View>

          {/* Grid Section - Birthday, Age, Gender, Civil Status */}
          <View style={styles.gridSection}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Birthday</Text>
              {isEditing ? (
                <Text style={styles.gridValue}>{displayBirthday}</Text>
              ) : (
                <Text style={styles.gridValue}>{displayBirthday}</Text>
              )}
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Age</Text>
              <Text style={styles.gridValue}>
                {isEditing ? editAgeDisplay : displayAge}
              </Text>
            </View>
          </View>

          <View style={styles.gridSection}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Gender</Text>
              {isEditing ? (
                <Text style={styles.gridValue}>{displayGender}</Text>
              ) : (
                <Text style={styles.gridValue}>{displayGender}</Text>
              )}
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Civil Status</Text>
              {isEditing ? (
                <View style={styles.dropdownField}>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() =>
                      setShowCivilStatusDropdown(!showCivilStatusDropdown)
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownText}>
                      {civilStatusDisplay || "Select"}
                    </Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {showCivilStatusDropdown && (
                    <View style={styles.dropdownMenu}>
                      {civilStatusOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            updateEditValue("civil_status", option);
                            setShowCivilStatusDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.gridValue}>{displayCivilStatus}</Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Bottom Section - Email, Contact, Address */}
          <View style={styles.bottomSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.editFullInput}
                    value={editValues.email}
                    onChangeText={(value) => updateEditValue("email", value)}
                    placeholder="Email address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Text style={styles.hintText}>
                    Email change needs confirmation.
                  </Text>
                </>
              ) : (
                <Text style={styles.infoValue}>{displayEmail}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Contact Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editFullInput}
                  value={editValues.phone}
                  onChangeText={(value) => updateEditValue("phone", value)}
                  placeholder="Phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{displayPhone}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Complete Address:</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={[
                      styles.editFullInput,
                      !canChangeAddress && styles.readOnlyInput,
                    ]}
                    value={editValues.address}
                    onChangeText={(value) => updateEditValue("address", value)}
                    placeholder="Complete address"
                    placeholderTextColor="#9CA3AF"
                    editable={canChangeAddress}
                  />
                  {!canChangeAddress && addressNextAllowed ? (
                    <Text style={styles.hintText}>
                      Address can change again on{" "}
                      {addressNextAllowed.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      .
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.infoValue}>{displayAddress}</Text>
              )}
            </View>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.cancelButton,
                isSaving && styles.actionButtonDisabled,
              ]}
              onPress={handleCancelEdit}
              activeOpacity={0.7}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                isSaving && styles.actionButtonDisabled,
              ]}
              onPress={handleSaveEdit}
              activeOpacity={0.7}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.editButton,
              (isLoading || !profile) && styles.actionButtonDisabled,
            ]}
            onPress={handleEditPress}
            activeOpacity={0.7}
            disabled={isLoading || !profile}
          >
            <MaterialIcons name="edit" size={18} color="#333" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === "home" && styles.navItemActive]}
          onPress={() => {
            setActiveTab("home");
            router.push("/resident-dashboard");
          }}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === "home" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "request" && styles.navItemActive,
          ]}
          onPress={() => {
            setActiveTab("request");
            router.push("/document-form");
          }}
        >
          <MaterialIcons
            name="description"
            size={24}
            color={activeTab === "request" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "request" && styles.navLabelActive,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "profile" && styles.navItemActive,
          ]}
          onPress={() => setActiveTab("profile")}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={activeTab === "profile" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile" && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "settings" && styles.navItemActive,
          ]}
          onPress={() => {
            setActiveTab("settings");
            router.push("/settings");
          }}
        >
          <MaterialIcons
            name="settings"
            size={24}
            color={activeTab === "settings" ? "#1976D2" : "#999"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "settings" && styles.navLabelActive,
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  // Avatar Container
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#FFF",
    backgroundColor: "#F0F0F0",
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: "#000",
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
    color: "#AAA",
    marginBottom: 4,
    fontWeight: "500",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginRight: 6,
  },
  addressText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 6,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },

  // Edit Row
  editRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#F9F9F9",
    marginBottom: 8,
  },
  editFullInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#F9F9F9",
    marginTop: 4,
    marginBottom: 8,
  },
  readOnlyInput: {
    backgroundColor: "#EFEFEF",
    color: "#999",
  },
  hintText: {
    fontSize: 12,
    color: "#777",
    marginTop: -2,
  },

  // Grid Section
  gridSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridColumn: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: "#AAA",
    marginBottom: 4,
    fontWeight: "500",
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  editGridInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#F9F9F9",
    marginRight: 6,
  },
  dropdownField: {
    position: "relative",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F9F9F9",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
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
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },

  // Edit Profile Button
  editButton: {
    flexDirection: "row",
    backgroundColor: "#FFEB3B",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  // Button Row (Save/Cancel)
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#FFEB3B",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  // Bottom Navigation
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: "#1976D2",
  },
  navLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#1976D2",
    fontWeight: "600",
  },
});

export default ProfileScreen;
