import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function ProfileLayout() {
  const router = useRouter();

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()}>
      <ChevronLeft color={"#fff"} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#db2777", // Pink-500
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#FFFFFF",
        },
        headerTintColor: "#FFFFFF",
        headerLeft: backButton,
      }}
    >
      <Stack.Screen name="settings" options={{ headerTitle: "Settings" }} />
      <Stack.Screen
        name="personal-info"
        options={{ headerTitle: "Personal Information" }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{ headerTitle: "Payment Methods" }}
      />
      <Stack.Screen
        name="saved-routes"
        options={{ headerTitle: "Saved Routes" }}
      />
      <Stack.Screen
        name="booking-history"
        options={{ headerTitle: "Booking History" }}
      />
      <Stack.Screen name="inbox" options={{ headerTitle: "Inbox" }} />
    </Stack>
  );
}
