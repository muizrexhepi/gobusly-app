"use client";

import { Stack, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  Filter,
  Map as MapIcon,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BusStation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  operatingHours: string;
  facilities: string[];
  rating: number;
  isMainStation: boolean;
}

const mockStations: BusStation[] = [
  {
    id: "1",
    name: "Skopje Central Bus Station",
    address: "Jane Sandanski 77, Skopje 1000",
    city: "Skopje",
    country: "North Macedonia",
    coordinates: { latitude: 42.0024, longitude: 21.4086 },
    phone: "+389 2 2466 313",
    operatingHours: "24/7",
    facilities: [
      "WiFi",
      "Waiting Area",
      "Restrooms",
      "Café",
      "Ticket Office",
      "Parking",
    ],
    rating: 4.2,
    isMainStation: true,
  },
  {
    id: "2",
    name: "Belgrade Bus Station",
    address: "Železnička 4, Belgrade 11000",
    city: "Belgrade",
    country: "Serbia",
    coordinates: { latitude: 44.8125, longitude: 20.4612 },
    phone: "+381 11 2627 146",
    operatingHours: "5:00 AM - 11:00 PM",
    facilities: [
      "WiFi",
      "Waiting Area",
      "Restrooms",
      "Restaurant",
      "Shop",
      "Left Luggage",
    ],
    rating: 4.5,
    isMainStation: true,
  },
  {
    id: "3",
    name: "Pristina Bus Station",
    address: "Rr. Nëna Terezë, Pristina 10000",
    city: "Pristina",
    country: "Kosovo",
    coordinates: { latitude: 42.6629, longitude: 21.1655 },
    phone: "+383 38 249 849",
    operatingHours: "6:00 AM - 10:00 PM",
    facilities: ["Waiting Area", "Restrooms", "Café", "Ticket Office"],
    rating: 3.8,
    isMainStation: true,
  },
  {
    id: "4",
    name: "Tirana International Bus Terminal",
    address: "Rruga Dritan Hoxha, Tirana 1001",
    city: "Tirana",
    country: "Albania",
    coordinates: { latitude: 41.3275, longitude: 19.8187 },
    phone: "+355 4 222 3456",
    operatingHours: "5:30 AM - 11:30 PM",
    facilities: [
      "WiFi",
      "Waiting Area",
      "Restrooms",
      "Restaurant",
      "ATM",
      "Parking",
    ],
    rating: 4.1,
    isMainStation: true,
  },
  {
    id: "5",
    name: "Sofia Central Bus Station",
    address: "Bul. Maria Luiza 100, Sofia 1000",
    city: "Sofia",
    country: "Bulgaria",
    coordinates: { latitude: 42.7105, longitude: 23.3238 },
    phone: "+359 2 931 5047",
    operatingHours: "24/7",
    facilities: [
      "WiFi",
      "Waiting Area",
      "Restrooms",
      "Café",
      "Shop",
      "Left Luggage",
      "Parking",
    ],
    rating: 4.3,
    isMainStation: true,
  },
  {
    id: "6",
    name: "Skopje East Terminal",
    address: "Bul. 8-mi Septemvri, Skopje 1000",
    city: "Skopje",
    country: "North Macedonia",
    coordinates: { latitude: 42.0089, longitude: 21.4254 },
    operatingHours: "6:00 AM - 9:00 PM",
    facilities: ["Waiting Area", "Restrooms", "Ticket Office"],
    rating: 3.5,
    isMainStation: false,
  },
];

const countries = Array.from(
  new Set(mockStations.map((station) => station.country))
);

export default function StationLocationsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "rating" | "city">("name");

  const filteredStations = mockStations
    .filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry =
        !selectedCountry || station.country === selectedCountry;

      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "city":
          return a.city.localeCompare(b.city);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCall = (phoneNumber?: string) => {
    if (!phoneNumber) {
      Alert.alert(
        "Contact Info",
        "Phone number not available for this station."
      );
      return;
    }

    Alert.alert("Call Station", `Do you want to call ${phoneNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${phoneNumber}`),
      },
    ]);
  };

  const handleDirections = (station: BusStation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.coordinates.latitude},${station.coordinates.longitude}&destination_place_id=${station.name}`;
    Linking.openURL(url);
  };

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color="#fff" size={24} />
    </TouchableOpacity>
  );

  const StationCard = ({ station }: { station: BusStation }) => (
    <TouchableOpacity
      onPress={() => router.push(`/station/${station.id}`)}
      className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-semibold text-gray-900 flex-1">
              {station.name}
            </Text>
            {station.isMainStation && (
              <View className="bg-pink-100 px-2 py-1 rounded-full ml-2">
                <Text className="text-xs text-pink-700 font-medium">Main</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-600 mb-2">
            {station.city}, {station.country}
          </Text>
          <Text className="text-xs text-gray-500 leading-4">
            {station.address}
          </Text>
        </View>

        <View className="items-end">
          <View className="flex-row items-center mb-2">
            <Star color="#f59e0b" fill="#f59e0b" size={14} />
            <Text className="text-sm font-medium text-gray-700 ml-1">
              {station.rating}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDirections(station)}
            className="bg-pink-50 p-2 rounded-full"
          >
            <Navigation color="#db2777" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Clock color="#6b7280" size={16} />
          <Text className="text-sm text-gray-600 ml-2">
            {station.operatingHours}
          </Text>
        </View>

        {station.phone && (
          <TouchableOpacity
            onPress={() => handleCall(station.phone)}
            className="flex-row items-center"
          >
            <Phone color="#10b981" size={16} />
            <Text className="text-sm text-green-600 ml-1 font-medium">
              Call
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row flex-wrap">
        {station.facilities.slice(0, 4).map((facility, index) => (
          <View
            key={index}
            className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-1"
          >
            <Text className="text-xs text-gray-600">{facility}</Text>
          </View>
        ))}
        {station.facilities.length > 4 && (
          <View className="bg-gray-100 px-2 py-1 rounded-md">
            <Text className="text-xs text-gray-600">
              +{station.facilities.length - 4} more
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () =>
    showFilters && (
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text className="text-pink-600 font-medium">Done</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-900 mb-3">
            Country
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setSelectedCountry(null)}
              className={`px-4 py-2 rounded-full mr-3 ${
                !selectedCountry ? "bg-pink-600" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  !selectedCountry ? "text-white" : "text-gray-700"
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
                  selectedCountry === country ? "bg-pink-600" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedCountry === country ? "text-white" : "text-gray-700"
                  }`}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="text-base font-medium text-gray-900 mb-3">
            Sort by
          </Text>
          <View className="flex-row">
            {[
              { key: "name" as const, label: "Name" },
              { key: "rating" as const, label: "Rating" },
              { key: "city" as const, label: "City" },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSortBy(key)}
                className={`px-4 py-2 rounded-full mr-3 ${
                  sortBy === key ? "bg-pink-600" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    sortBy === key ? "text-white" : "text-gray-700"
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

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Station Locations",
          headerStyle: { backgroundColor: "#db2777" },
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerTintColor: "#fff",
          headerLeft: backButton,
        }}
      />

      <View className="flex-1 bg-gray-50">
        {/* Search Header */}
        <View className="bg-white p-4 border-b border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
            <Search color="#6b7280" size={20} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search stations, cities..."
              className="flex-1 ml-3 text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg"
            >
              <Filter color="#6b7280" size={16} />
              <Text className="text-gray-700 ml-2 font-medium">Filters</Text>
              {(selectedCountry || sortBy !== "name") && (
                <View className="w-2 h-2 bg-pink-600 rounded-full ml-2" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/map-view")}
              className="flex-row items-center bg-pink-600 px-4 py-2 rounded-lg"
            >
              <MapIcon color="#fff" size={16} />
              <Text className="text-white ml-2 font-medium">Map View</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FilterModal />

        {/* Results Count */}
        <View className="px-4 py-3 bg-gray-50">
          <Text className="text-sm text-gray-600">
            {filteredStations.length} station
            {filteredStations.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {/* Stations List */}
        {filteredStations.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <MapPin color="#d1d5db" size={80} />
            <Text className="text-xl font-semibold text-gray-900 mt-6 mb-2">
              No stations found
            </Text>
            <Text className="text-gray-600 text-center leading-6">
              Try adjusting your search criteria or filters to find bus
              stations.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredStations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <StationCard station={item} />}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}
