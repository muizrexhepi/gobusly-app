import { useAuthStore } from "@/src/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const { isAuthenticated } = useAuthStore();

  const handleLogin = () => {
    router.push("/(modals)/login");
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Empty State */}
          <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="w-20 h-20 bg-pink-50 rounded-full items-center justify-center mb-6">
              <Ionicons name="calendar-outline" size={32} color="#EC4899" />
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Sign in to view your trips
            </Text>

            <Text className="text-gray-600 text-base text-center mb-8 leading-6 px-4">
              Keep track of your bookings, check trip details, and get real-time
              updates on your journeys.
            </Text>

            <TouchableOpacity
              className="bg-pink-600 py-4 px-8 rounded-xl active:bg-pink-700"
              onPress={handleLogin}
              activeOpacity={0.9}
              style={{
                shadowColor: "#FF385C",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white font-semibold text-base text-center">
                Sign In to Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Content for authenticated users */}
        <View className="flex-1 items-center justify-center px-6 py-12">
          <View className="w-20 h-20 bg-pink-50 rounded-full items-center justify-center mb-6">
            <Ionicons name="calendar" size={32} color="#EC4899" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            No trips yet
          </Text>

          <Text className="text-gray-600 text-base text-center mb-8 leading-6 px-4">
            Your booked trips will appear here. Start planning your next
            journey!
          </Text>

          <TouchableOpacity
            className="bg-pink-600 py-4 px-8 rounded-xl active:bg-pink-700"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.9}
            style={{
              shadowColor: "#FF385C",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-semibold text-base text-center">
              Search for Trips
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
