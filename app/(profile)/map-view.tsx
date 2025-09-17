"use client";

import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import {
  ChevronLeft,
  List,
  Locate,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

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

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 4.5;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Initial region centered on the Balkans
const initialRegion: Region = {
  latitude: 42.5,
  longitude: 21.0,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MapViewScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [selectedStation, setSelectedStation] = useState<BusStation | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Filter stations based on search
  const filteredStations = mockStations.filter((station) => {
    const query = searchQuery.toLowerCase();
    return (
      station.name.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.country.toLowerCase().includes(query)
    );
  });

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please enable location access to find nearby stations."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userCoords);

      // Animate to user location
      mapRef.current?.animateToRegion({
        ...userCoords,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to get your location. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleStationSelect = (station: BusStation) => {
    setSelectedStation(station);
    // Animate to station
    mapRef.current?.animateToRegion({
      ...station.coordinates,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  };

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

  const getMarkerColor = (station: BusStation) => {
    return station.isMainStation ? "#15203e" : "#ef4444";
  };

  const SearchOverlay = () =>
    showSearch && (
      <View className="absolute top-20 left-4 right-4 z-10">
        <View className="bg-white rounded-xl shadow-lg border border-gray-200">
          <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
            <Search color="#6b7280" size={20} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search stations..."
              className="flex-1 ml-3 text-gray-900"
              placeholderTextColor="#9ca3af"
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setShowSearch(false)}
              className="ml-2 p-1"
            >
              <Text className="text-pink-600 font-medium">Done</Text>
            </TouchableOpacity>
          </View>

          {searchQuery.length > 0 && (
            <ScrollView className="max-h-48">
              {filteredStations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  onPress={() => {
                    handleStationSelect(station);
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="px-4 py-3 border-b border-gray-50 last:border-b-0"
                >
                  <Text className="font-medium text-gray-900 mb-1">
                    {station.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {station.city}, {station.country}
                  </Text>
                </TouchableOpacity>
              ))}
              {filteredStations.length === 0 && (
                <View className="px-4 py-6 items-center">
                  <Text className="text-gray-500">No stations found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    );

  const StationCallout = ({ station }: { station: BusStation }) => (
    <View className="bg-white rounded-lg p-3 min-w-64 shadow-lg">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="font-semibold text-gray-900 text-base mb-1">
            {station.name}
          </Text>
          <Text className="text-sm text-gray-600">
            {station.city}, {station.country}
          </Text>
        </View>
        {station.isMainStation && (
          <View className="bg-pink-100 px-2 py-1 rounded-full">
            <Text className="text-xs text-pink-700 font-medium">Main</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mb-2">
        <Star color="#f59e0b" fill="#f59e0b" size={12} />
        <Text className="text-sm text-gray-700 ml-1 mr-3">
          {station.rating}
        </Text>
        <Text className="text-xs text-gray-500">{station.operatingHours}</Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          // onPress={() => router.push(`/station/${station.id}`)}
          className="bg-gray-100 px-3 py-2 rounded-lg flex-1 mr-2"
        >
          <Text className="text-center text-sm font-medium text-gray-700">
            Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDirections(station)}
          className="bg-pink-600 px-3 py-2 rounded-lg flex-1 ml-2"
        >
          <Text className="text-center text-sm font-medium text-white">
            Directions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Station Map",
          headerStyle: { backgroundColor: "#15203e" },
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerTintColor: "#fff",
          headerLeft: backButton,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/station-locations")}
              className="p-2"
            >
              <List color="#fff" size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          onPress={() => setSelectedStation(null)}
        >
          {/* Station Markers */}
          {mockStations.map((station) => (
            <Marker
              key={station.id}
              coordinate={station.coordinates}
              title={station.name}
              description={`${station.city}, ${station.country}`}
              pinColor={getMarkerColor(station)}
              onPress={() => setSelectedStation(station)}
            >
              <View className="items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    station.isMainStation ? "bg-pink-600" : "bg-red-500"
                  }`}
                >
                  <MapPin color="white" size={16} />
                </View>
                {station.isMainStation && (
                  <View className="bg-pink-600 px-2 py-1 rounded-full mt-1">
                    <Text className="text-xs text-white font-medium">Main</Text>
                  </View>
                )}
              </View>
            </Marker>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="#10b981"
            >
              <View className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            </Marker>
          )}
        </MapView>

        {/* Search Overlay */}
        <SearchOverlay />

        {/* Floating Action Buttons */}
        <View className="absolute bottom-8 right-4 space-y-3">
          {/* Search Button */}
          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
          >
            <Search color="#15203e" size={24} />
          </TouchableOpacity>

          {/* My Location Button */}
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
            className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
          >
            {isLoadingLocation ? (
              <ActivityIndicator color="#15203e" size="small" />
            ) : (
              <Locate color="#15203e" size={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* Selected Station Bottom Sheet */}
        {selectedStation && (
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl">
            <View className="p-6">
              <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-xl font-bold text-gray-900">
                      {selectedStation.name}
                    </Text>
                    {selectedStation.isMainStation && (
                      <View className="bg-pink-100 px-2 py-1 rounded-full ml-2">
                        <Text className="text-xs text-pink-700 font-medium">
                          Main Station
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-gray-600 mb-2">
                    {selectedStation.city}, {selectedStation.country}
                  </Text>

                  <Text className="text-sm text-gray-500 mb-3">
                    {selectedStation.address}
                  </Text>

                  <View className="flex-row items-center mb-3">
                    <Star color="#f59e0b" fill="#f59e0b" size={16} />
                    <Text className="text-gray-700 ml-2 mr-4">
                      {selectedStation.rating}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {selectedStation.operatingHours}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => handleDirections(selectedStation)}
                  className="flex-1 bg-pink-600 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <Navigation color="white" size={18} />
                  <Text className="text-white font-semibold ml-2">
                    Directions
                  </Text>
                </TouchableOpacity>

                {selectedStation.phone && (
                  <TouchableOpacity
                    onPress={() => handleCall(selectedStation.phone)}
                    className="flex-1 bg-green-600 py-3 rounded-xl flex-row items-center justify-center"
                  >
                    <Phone color="white" size={18} />
                    <Text className="text-white font-semibold ml-2">Call</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  // onPress={() => router.push(`/station/${selectedStation.id}`)}
                  className="flex-1 bg-gray-600 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <Text className="text-white font-semibold">Details</Text>
                </TouchableOpacity>
              </View>

              {/* Facilities */}
              <View className="mt-4">
                <Text className="font-medium text-gray-900 mb-2">
                  Facilities
                </Text>
                <View className="flex-row flex-wrap">
                  {selectedStation.facilities
                    .slice(0, 6)
                    .map((facility, index) => (
                      <View
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-sm text-gray-700">
                          {facility}
                        </Text>
                      </View>
                    ))}
                  {selectedStation.facilities.length > 6 && (
                    <View className="bg-gray-100 px-3 py-1 rounded-full">
                      <Text className="text-sm text-gray-700">
                        +{selectedStation.facilities.length - 6} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
