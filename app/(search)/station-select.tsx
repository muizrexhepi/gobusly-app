import { useStations } from "@/src/hooks/useStations";
import { useSearchStore } from "@/src/stores/searchStore";
import { Station } from "@/src/types/station";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function useDebounce<T>(value: T, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function StationSelect() {
  const { t } = useTranslation();
  const { data: stations, isLoading } = useStations();
  const params = useLocalSearchParams();
  const type = params.type as "from" | "to";

  const setFrom = useSearchStore((s) => s.setFrom);
  const setTo = useSearchStore((s) => s.setTo);
  const setFromCity = useSearchStore((s) => s.setFromCity);
  const setToCity = useSearchStore((s) => s.setToCity);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Fuse.js fuzzy search
  const filteredStations = useMemo(() => {
    if (!stations) return [];
    if (!debouncedQuery) return [];
    const fuse = new Fuse(stations, {
      keys: ["name", "city"],
      threshold: 0.3,
      distance: 100,
    });
    return fuse.search(debouncedQuery).map((res) => res.item);
  }, [stations, debouncedQuery]);

  const handleSelect = (station: Station) => {
    if (type === "from") {
      setFrom(station.name);
      setFromCity(station.city);
    } else {
      setTo(station.name);
      setToCity(station.city);
    }
    router.back();
  };

  const clearSearch = () => setQuery("");

  const fetchNearbyStations = async () => {
    if (!stations?.length) return;

    setNearbyLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const stationsWithDistance = stations
        .filter((s) => s.location?.lat && s.location?.lng)
        .map((s) => {
          const dist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            s.location.lat!,
            s.location.lng!
          );
          return { ...s, distance: dist };
        })
        .sort((a, b) => a.distance - b.distance);

      setNearbyStations(stationsWithDistance.slice(0, 10));
      setLocationError(null);
    } catch (err) {
      console.error(err);
      setLocationError("Failed to get location");
    } finally {
      setNearbyLoading(false);
    }
  };

  // Check location permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        await fetchNearbyStations();
      }
      setPermissionChecked(true);
    };
    checkPermission();
  }, [stations]);

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="bg-white mx-4 mb-2 px-4 py-4 rounded-xl shadow-sm border border-gray-50"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500">{item.city}</Text>
        </View>
        <View className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Ionicons name="location" size={16} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Ionicons name="search" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        {debouncedQuery
          ? t("search.noStationsFound", "No stations found")
          : t("search.noNearbyStations", "Nearby stations are not available")}
      </Text>

      {!debouncedQuery && permissionChecked && nearbyStations.length === 0 && (
        <TouchableOpacity
          onPress={fetchNearbyStations}
          className="mt-4 bg-primary px-4 py-2 rounded-full"
        >
          <Text className="text-white font-medium">
            {t("search.useMyLocation", "Use My Location")}
          </Text>
        </TouchableOpacity>
      )}

      {locationError && (
        <Text className="text-red-500 mt-2 text-center">{locationError}</Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(
              "search.searchStations",
              "Search stations or cities"
            )}
            placeholderTextColor="#9CA3AF"
            className="ml-3 flex-1 text-gray-900 text-base h-16 pb-1"
            autoFocus={true}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center ml-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Station List */}
      {isLoading || nearbyLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">
            {t("search.loadingStations", "Loading stations...")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={debouncedQuery ? filteredStations : nearbyStations}
          keyExtractor={(item) => item._id}
          renderItem={renderStation}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  );
}

// Helper: calculate distance
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
