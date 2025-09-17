import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function ProfileLayout() {
  const router = useRouter();
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
        options={{ headerTitle: "Personal Information" }}
      />
      <Stack.Screen
        name="station-locations"
        options={{ headerTitle: "Station Locations" }}
      />

      <Stack.Screen name="language" options={{ headerTitle: "Language" }} />
      <Stack.Screen
        name="notifications"
        options={{ headerTitle: "Notifications" }}
      />
      <Stack.Screen
        name="privacy-settings"
        options={{ headerTitle: "Privacy Settings" }}
      />
      <Stack.Screen
        name="booking-history"
        options={{ headerTitle: "Booking History" }}
      />

      <Stack.Screen name="inbox" options={{ headerTitle: "Inbox" }} />
    </Stack>
  );
}
