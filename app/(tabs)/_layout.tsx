import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#be185d",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 90,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "My Trips",
          headerShown: true,
          headerTitle: "My Trips",
          headerStyle: {
            backgroundColor: "#db2777",
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#FFFFFF",
          },
          headerTintColor: "#FFFFFF",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerTitle: "Profile",
          headerStyle: {
            backgroundColor: "#db2777",
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#FFFFFF",
          },
          headerTintColor: "#FFFFFF",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
