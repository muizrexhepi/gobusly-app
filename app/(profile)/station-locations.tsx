"use client";

import { useStations } from "@/src/hooks/useStations";
import { Station } from "@/src/types/station";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Filter, Map as MapIcon, MapPin, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Reusable component for each list item
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  disabled = false,
  isLastItem = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  isLastItem?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center p-4 ${disabled ? "opacity-50" : ""} ${
      !isLastItem ? "border-b border-gray-100" : ""
    }`}
    activeOpacity={0.7}
  >
    <View
      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 ${
        destructive ? "bg-red-50" : "bg-gray-100"
      }`}
    >
      <Ionicons
        name={icon}
        size={18}
        color={destructive ? "#EF4444" : "#4B5563"}
      />
    </View>
    <View className="flex-1">
      <Text
        className={`text-base font-medium ${
          destructive ? "text-red-500" : "text-gray-900"
        }`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {children}
  </View>
);

const countries = [
  "North Macedonia",
  "Serbia",
  "Kosovo",
  "Albania",
  "Bulgaria",
  "Montenegro",
];

export default function StationLocationsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "city" | "country">("name");

  const {
    data: stations = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useStations();

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const filteredStations = stations
    .filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry =
        !selectedCountry || station.country === selectedCountry;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "city":
          return a.city.localeCompare(b.city);
        case "country":
          return a.country.localeCompare(b.country);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleDirections = (station: Station) => {
    if (station.location.lat && station.location.lng) {
      const url = `http://google.com/maps/dir/?api=1&destination=${station.location.lat},${station.location.lng}`;
      Linking.openURL(url);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const FilterModal = () =>
    showFilters && (
      <View className="mx-4 mb-6">
        <Section>
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-900">
                Filters
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-500 rounded-full"
              >
                <Text className="font-medium text-white">Done</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-base font-medium mb-3 text-gray-900">
                Country
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => setSelectedCountry(null)}
                  className={`px-4 py-2 rounded-full mr-3 ${
                    !selectedCountry ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      !selectedCountry ? "text-white" : "text-gray-500"
                    }`}
                  >
                    All Countries
                  </Text>
                </TouchableOpacity>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country}
                    onPress={() => setSelectedCountry(country)}
                    className={`px-4 py-2 rounded-full mr-3 ${
                      selectedCountry === country
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedCountry === country
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="text-base font-medium mb-3 text-gray-900">
                Sort by
              </Text>
              <View className="flex-row">
                {[
                  { key: "name" as const, label: "Name" },
                  { key: "city" as const, label: "City" },
                  { key: "country" as const, label: "Country" },
                ].map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSortBy(key)}
                    className={`px-4 py-2 rounded-full mr-3 ${
                      sortBy === key ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        sortBy === key ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Section>
      </View>
    );

  const LoadingView = () => (
    <View className="flex-1 items-center justify-center px-8">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-lg font-medium mt-4 mb-2 text-gray-900">
        Loading stations...
      </Text>
      <Text className="text-center text-gray-500">
        Please wait while we fetch the latest station information.
      </Text>
    </View>
  );

  const ErrorView = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <MapPin color="#EF4444" size={32} />
      </View>
      <Text className="text-xl font-semibold mt-2 mb-2 text-gray-900">
        Error loading stations
      </Text>
      <Text className="text-center leading-6 mb-6 text-gray-500">
        Unable to load station information. Please check your connection and try
        again.
      </Text>
      <TouchableOpacity
        onPress={handleRefresh}
        className="px-6 py-3 rounded-xl bg-blue-500"
      >
        <Text className="font-medium text-white">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyView = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <MapPin color="#9CA3AF" size={32} />
      </View>
      <Text className="text-xl font-semibold mt-2 mb-2 text-gray-900">
        No stations found
      </Text>
      <Text className="text-center leading-6 text-gray-500">
        Try adjusting your search criteria or filters to find bus stations.
      </Text>
    </View>
  );

  const HeaderSection = () => (
    <View className="mx-4 mb-6">
      {/* Search Bar */}
      <View className="mb-4 rounded-2xl overflow-hidden bg-white">
        <View className="flex-row items-center px-4 py-3">
          <Search color="#6B7280" size={20} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search stations, cities, countries..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="ml-2 p-1"
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center px-4 py-3 rounded-xl bg-white shadow-sm"
        >
          <Filter color="#6B7280" size={18} />
          <Text className="ml-2 font-medium text-gray-700">Filters</Text>
          {(selectedCountry || sortBy !== "name") && (
            <View className="w-2 h-2 rounded-full ml-2 bg-blue-500" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/map-view")}
          className="flex-row items-center px-4 py-3 rounded-xl bg-blue-500 shadow-sm"
        >
          <MapIcon color="#fff" size={18} />
          <Text className="ml-2 font-medium text-white">Map View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const StatsHeader = () => (
    <View className="px-6 pb-2">
      <Text className="text-sm text-gray-500">
        {filteredStations.length} station
        {filteredStations.length !== 1 ? "s" : ""} found
        {selectedCountry && ` in ${selectedCountry}`}
        {searchQuery && ` for "${searchQuery}"`}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 py-6">
      <HeaderSection />
      <FilterModal />

      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView />
      ) : filteredStations.length === 0 ? (
        <EmptyView />
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <Section>
              <MenuItem
                icon="bus-outline"
                title={capitalizeWords(item.name)}
                subtitle={`${capitalizeWords(item.city)}, ${capitalizeWords(
                  item.country
                )}`}
                onPress={() => handleDirections(item)}
                isLastItem={true}
              />
            </Section>
          )}
          ListHeaderComponent={StatsHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
              colors={["#3B82F6"]}
            />
          }
        />
      )}
    </View>
  );
}
