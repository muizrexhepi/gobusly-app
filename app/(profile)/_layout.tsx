import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function ProfileLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const primaryDark = "#15203e";

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color={primaryDark} size={24} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerShadowVisible: true,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: primaryDark,
        },
        headerTintColor: primaryDark,
        headerLeft: backButton,
      }}
    >
      <Stack.Screen
        name="personal-info"
        options={{ headerTitle: t("profileTab.personalInformation") }}
      />
      <Stack.Screen
        name="station-locations"
        options={{ headerTitle: t("profileTab.stationLocations") }}
      />
      <Stack.Screen
        name="language"
        options={{ headerTitle: t("profileTab.language") }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerTitle: t("profileTab.notifications") }}
      />
      <Stack.Screen
        name="privacy-settings"
        options={{ headerTitle: t("profileTab.privacySettings") }}
      />
      <Stack.Screen
        name="booking-history"
        options={{ headerTitle: t("profileTab.bookingHistory") }}
      />
      <Stack.Screen
        name="inbox"
        options={{ headerTitle: t("profileTab.inbox") }}
      />
    </Stack>
  );
}
