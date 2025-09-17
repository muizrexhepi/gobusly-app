import { Colors } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.placeholder,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 8,
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={70}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search-sharp" : "search-outline"}
              color={color}
              size={size}
            />
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
            backgroundColor: Colors.background.light,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: Colors.border.light,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: Colors.primary,
          },
          headerTintColor: Colors.primary,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              color={color}
              size={size}
            />
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
            backgroundColor: Colors.background.light,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: Colors.border.light,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: Colors.primary,
          },
          headerTintColor: Colors.primary,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
