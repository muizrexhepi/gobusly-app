"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/stores/authStore";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { logout } = useAuth();
  console.log({ user });
  const handleLogin = () => {
    router.push("/(modals)/login");
  };

  const handleLogout = () => {
    logout();
  };

  const handleHelpSupport = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://support.gobusly.com");
    } catch (error) {
      console.error("Failed to open browser:", error);
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handlePersonalInfo = () => {
    router.push("/personal-info");
  };

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    value,
    onPress,
    showNotification = false,
    isDestructive = false,
    showDivider = true,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    showNotification?: boolean;
    isDestructive?: boolean;
    showDivider?: boolean;
  }) => (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-4 px-6 bg-white ${showDivider ? "border-b border-gray-50" : ""}`}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View className="flex-row items-center flex-1">
        <View
          className={`w-9 h-9 rounded-full items-center justify-center mr-4 ${
            isDestructive ? "bg-red-50" : "bg-gray-50"
          }`}
        >
          <Icon size={18} color={isDestructive ? "#EF4444" : "#6B7280"} />
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-medium ${isDestructive ? "text-red-500" : "text-gray-900"}`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        {showNotification && (
          <View className="w-2 h-2 bg-pink-500 rounded-full mr-3" />
        )}
        {value && (
          <Text className="text-gray-500 text-sm mr-3 font-medium">
            {value}
          </Text>
        )}
        <ChevronRight size={16} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="px-6 py-3 bg-gray-50">
      <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        {title}
      </Text>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-white mt-6 mx-6 rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Ready to book your next trip?
            </Text>
            <Text className="text-gray-600 text-base mb-6 leading-6">
              Sign in to access your bookings, save favorite routes, and get
              personalized travel recommendations.
            </Text>

            <TouchableOpacity
              className="bg-pink-600 py-4 px-6 rounded-xl active:bg-pink-700"
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
                Sign In or Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Access */}
          <View className="mt-6">
            <SectionHeader title="Quick Access" />
            <View className="bg-white">
              <MenuItem
                icon={Bell}
                title="Notifications"
                subtitle="Stay updated with travel alerts"
                onPress={() => {}}
                showNotification={true}
              />
              <MenuItem
                icon={Settings}
                title="App Settings"
                subtitle="Language, notifications, and more"
                onPress={() => {}}
              />
              <MenuItem
                icon={HelpCircle}
                title="Help & Support"
                subtitle="Get help with your booking"
                onPress={() => {}}
                showDivider={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white px-6 py-8">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-pink-600 rounded-full items-center justify-center mr-4">
              <Text className="text-white font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {user?.name || "User"}
              </Text>
              <Text className="text-gray-600 text-base mt-1">
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="mt-6">
          <SectionHeader title="Account" />
          <View className="bg-white">
            <MenuItem
              icon={User}
              title="Personal Information"
              subtitle="Name, email, phone number"
              onPress={handlePersonalInfo}
            />
            <MenuItem
              icon={CreditCard}
              title="Payment Methods"
              subtitle="Manage cards and payment options"
              onPress={() => {}}
            />
            <MenuItem
              icon={Heart}
              title="Saved Routes"
              subtitle="Your favorite travel routes"
              onPress={() => {}}
              showDivider={false}
            />
          </View>
        </View>

        {/* Bookings Section */}
        <View className="mt-6">
          <SectionHeader title="Bookings" />
          <View className="bg-white">
            <MenuItem
              icon={Clock}
              title="Booking History"
              subtitle="View your past trips"
              onPress={() => {}}
            />
            <MenuItem
              icon={Mail}
              title="Inbox"
              subtitle="Booking confirmations and updates"
              onPress={() => {}}
              showNotification={true}
              showDivider={false}
            />
          </View>
        </View>

        {/* Support Section */}
        <View className="mt-6">
          <SectionHeader title="Support" />
          <View className="bg-white">
            <MenuItem
              icon={Settings}
              title="App Settings"
              subtitle="Notifications, language, and preferences"
              onPress={handleSettings}
            />
            <MenuItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Contact us or browse FAQs"
              onPress={handleHelpSupport}
              showDivider={false}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View className="mt-6 mb-6">
          <View className="bg-white">
            <MenuItem
              icon={LogOut}
              title="Sign Out"
              onPress={handleLogout}
              isDestructive={true}
              showDivider={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
