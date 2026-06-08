import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "flow",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="flow" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen
          name="resident-dashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="request-document"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="document-form" options={{ headerShown: false }} />
        <Stack.Screen
          name="BarangayClearanceForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusinessPermitForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BlotterIncidentReportForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BurialAssistanceForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BarangayIDForm" options={{ headerShown: false }} />
        <Stack.Screen
          name="CertificateOfResidencyForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfIndigencyForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfGoodMoralForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfSoloParentForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfLowIncomeForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfNoDerogatoryRecordForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateOfNonEmploymentForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="other-document" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="payment-success" options={{ headerShown: false }} />
        <Stack.Screen name="track-request" options={{ headerShown: false }} />
        <Stack.Screen
          name="track-request-detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="activity-history"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transaction-history"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transaction-detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="help-center" options={{ headerShown: false }} />
        <Stack.Screen name="chat-with-azmo" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen
          name="verify-phone-number"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
        <Stack.Screen
          name="login-credentials"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="biometric-login" options={{ headerShown: false }} />
        <Stack.Screen name="data-storage" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen
          name="terms-and-conditions"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen
          name="language-settings"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
