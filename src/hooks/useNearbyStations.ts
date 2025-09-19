import { Station } from "@/src/types/station";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useNearbyStations(stations: Station[]) {
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!stations?.length) return;

      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          setLoading(false);
          return;
        }

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

        setNearbyStations(stationsWithDistance.slice(0, 10)); // top 10 closest
      } catch (err) {
        console.error(err);
        setError("Failed to get location");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [stations]);

  return { nearbyStations, loading, error };
}

// Helper: calculate distance between two lat/lng points
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
