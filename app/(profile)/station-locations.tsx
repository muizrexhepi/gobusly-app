"use client";

import { useStations } from "@/src/hooks/useStations";
import { Station } from "@/src/types/station";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

// Reusable component from ProfileScreen
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center p-4">
    <View className="w-8 h-8 rounded-lg flex items-center justify-center mr-4 bg-gray-100">
      <Ionicons name={icon} size={18} color="#4B5563" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-900">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

// Reusable component from ProfileScreen
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6 rounded-2xl overflow-hidden bg-white mx-4">
    {title && (
      <Text className="text-sm font-semibold text-gray-500 uppercase px-4 pt-4 pb-2">
        {title}
      </Text>
    )}
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
  const router = useRouter();
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
      const url = `http://maps.google.com/maps?q=${station.location.lat},${station.location.lng}&z=10`;
      Linking.openURL(url);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const FilterModal = () =>
    showFilters && (
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text className="font-medium text-pink-600">Done</Text>
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
                !selectedCountry ? "bg-pink-600" : "bg-gray-200"
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
                  selectedCountry === country ? "bg-pink-600" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedCountry === country ? "text-white" : "text-gray-500"
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
                  sortBy === key ? "bg-pink-600" : "bg-gray-200"
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
    );

  const LoadingView = () => (
    <View className="flex-1 items-center justify-center px-8 bg-gray-100">
      <ActivityIndicator size="large" color="#EF4444" />
      <Text className="text-lg font-medium mt-4 mb-2 text-gray-900">
        Loading stations...
      </Text>
      <Text className="text-center text-gray-500">
        Please wait while we fetch the latest station information.
      </Text>
    </View>
  );

  const ErrorView = () => (
    <View className="flex-1 items-center justify-center px-8 bg-gray-100">
      <MapPin color="#EF4444" size={80} />
      <Text className="text-xl font-semibold mt-6 mb-2 text-gray-900">
        Error loading stations
      </Text>
      <Text className="text-center leading-6 mb-6 text-gray-500">
        Unable to load station information. Please check your connection and try
        again.
      </Text>
      <TouchableOpacity
        onPress={handleRefresh}
        className="px-6 py-3 rounded-lg bg-pink-600"
      >
        <Text className="font-medium text-white">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyView = () => (
    <View className="flex-1 items-center justify-center px-8 bg-gray-100">
      <MapPin color="#D1D5DB" size={80} />
      <Text className="text-xl font-semibold mt-6 mb-2 text-gray-900">
        No stations found
      </Text>
      <Text className="text-center leading-6 text-gray-500">
        Try adjusting your search criteria or filters to find bus stations.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="m-4">
        <View className="flex-row items-center rounded-xl px-4 py-3 mb-3 bg-white">
          <Search color="#6B7280" size={20} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search stations, cities, countries..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center px-4 py-2 rounded-full bg-white"
          >
            <Filter color="#6B7280" size={16} />
            <Text className="ml-2 font-medium text-gray-500">Filters</Text>
            {(selectedCountry || sortBy !== "name") && (
              <View className="w-2 h-2 rounded-full ml-2 bg-pink-600" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/map-view")}
            className="flex-row items-center px-4 py-2 rounded-full bg-pink-600"
          >
            <MapIcon color="#fff" size={16} />
            <Text className="ml-2 font-medium text-white">Map View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <FilterModal />

      {/* Main Content */}
      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView />
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Section title="">
              <MenuItem
                icon="bus-outline"
                title={capitalizeWords(item.name)}
                subtitle={`${capitalizeWords(item.city)}, ${capitalizeWords(
                  item.country
                )}`}
                onPress={() => handleDirections(item)}
              />
            </Section>
          )}
          ListHeaderComponent={() => (
            <View className="px-6 pb-2">
              <Text className="text-sm text-gray-500">
                {filteredStations.length} station
                {filteredStations.length !== 1 ? "s" : ""} found
              </Text>
            </View>
          )}
          ListEmptyComponent={EmptyView}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#EF4444"
              colors={["#EF4444"]}
            />
          }
        />
      )}
    </View>
  );
}
