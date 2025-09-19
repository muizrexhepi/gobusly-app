import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SearchLayout() {
  const router = useRouter();
  const primaryDark = "#15203e";
  const params = useLocalSearchParams();
  const type = params.type as "from" | "to";
  const { t } = useTranslation();
  const title =
    type === "from"
      ? t("search.selectDeparture")
      : type === "to"
        ? t("search.selectDestination")
        : t("search.selectStation");

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color={primaryDark} size={24} />
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
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
            presentation: "card",
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Search Buses",
              headerLeft: undefined, // Remove back button for main search
            }}
          />
          <Stack.Screen
            name="station-select"
            options={{
              headerTitle: title,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="date-select"
            options={{
              headerTitle: t("search.selectDate", "Select Date"),
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="passenger-select"
            options={{
              headerTitle: t("search.selectPassengers", "Passengers"),
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="search-results"
            options={{
              headerTitle: "Search Results",
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </View>
    </TouchableWithoutFeedback>
  );
}
