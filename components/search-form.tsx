import { useSearchStore } from "@/src/stores/searchStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SearchForm() {
  const { t } = useTranslation();

  const from = useSearchStore((s) => s.from);
  const to = useSearchStore((s) => s.to);
  const departureDate = useSearchStore((s) => s.departureDate);
  const passengers = useSearchStore((s) => s.passengers);

  const openStationSelect = useCallback((type: "from" | "to") => {
    Keyboard.dismiss();
    router.push(`/(search)/station-select?type=${type}`);
  }, []);

  const openDateSelect = useCallback(() => {
    Keyboard.dismiss();
    router.push(`/(search)/date-select?type=departure`);
  }, []);

  const openPassengerSelect = useCallback(() => {
    Keyboard.dismiss();
    router.push("/(search)/passenger-select");
  }, []);

  const swapLocations = useCallback(() => {
    const store = useSearchStore.getState();
    const {
      from,
      to,
      fromCity,
      toCity,
      setFrom,
      setTo,
      setFromCity,
      setToCity,
    } = store;

    if (from || to) {
      setFrom(to);
      setTo(from);
      setFromCity(toCity);
      setToCity(fromCity);
    }
  }, []);

  const handleContinueSearch = useCallback(() => {
    if (!from || !to) {
      Alert.alert(
        t("search.validation.missingFields", "Missing Information"),
        t(
          "search.validation.selectStations",
          "Please select both departure and destination stations."
        ),
        [{ text: t("common.ok", "OK") }]
      );
      return;
    }

    if (!departureDate) {
      Alert.alert(
        t("search.validation.missingFields", "Missing Information"),
        t(
          "search.validation.selectDepartureDate",
          "Please select a departure date."
        ),
        [{ text: t("common.ok", "OK") }]
      );
      return;
    }

    Keyboard.dismiss();
    router.push("/(search)/search-results");
  }, [from, to, departureDate, t]);

  const passengerText = useMemo(() => {
    const { adults, children } = passengers;
    const adultText =
      adults === 1 ? t("search.adult", "Adult") : t("search.adults", "Adults");
    const childText =
      children === 1
        ? t("search.child", "Child")
        : t("search.children", "Children");

    return children > 0
      ? `${adults} ${adultText}, ${children} ${childText}`
      : `${adults} ${adultText}`;
  }, [passengers, t]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-gray-100 rounded-t-2xl">
        <View className="mx-4 mt-5 mb-2.5">
          <View className="overflow-hidden relative gap-2.5">
            <TouchableOpacity
              onPress={() => openStationSelect("from")}
              className="flex-row rounded-lg bg-white items-center px-4 py-3 h-16"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 mb-1">
                  {t("search.from", "FROM")}
                </Text>
                <Text className="text-base text-gray-900">
                  {from || t("search.selectDeparture", "Select departure")}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={swapLocations}
              className="absolute right-4 top-1/2 size-14 bg-gray-100 rounded-full items-center justify-center z-10"
              style={{
                transform: [{ translateY: -28 }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.7}
              disabled={!from && !to}
            >
              <Ionicons
                name="swap-vertical"
                size={16}
                color={!from && !to ? "#D1D5DB" : "#4B5563"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openStationSelect("to")}
              className="flex-row rounded-lg bg-white items-center px-4 py-3 h-16"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 mb-1">
                  {t("search.to", "TO")}
                </Text>
                <Text className="text-base text-gray-900">
                  {to || t("search.selectDestination", "Select destination")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-4 mb-2.5">
          <View className="bg-white rounded-lg overflow-hidden">
            <TouchableOpacity
              onPress={openDateSelect}
              className="flex-row items-center px-4 py-3 h-16"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 mb-1">
                  {t("search.departure", "DEPARTURE DATE")}
                </Text>
                <Text className="text-base text-gray-900">
                  {departureDate || t("search.selectDate", "Select date")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-4 mb-2.5">
          <View className="bg-white rounded-lg overflow-hidden">
            <TouchableOpacity
              onPress={openPassengerSelect}
              className="flex-row items-center px-4 py-3 h-16"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 mb-1">
                  {t("search.passengers", "PASSENGERS")}
                </Text>
                <Text className="text-base text-gray-900">{passengerText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-4 mb-8">
          <TouchableOpacity
            onPress={handleContinueSearch}
            className="bg-accent rounded-lg py-4 items-center justify-center h-16"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">
              {t("search.search", "Search")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
