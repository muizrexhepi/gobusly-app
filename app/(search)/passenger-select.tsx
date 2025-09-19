"use client";

import { useSearchStore } from "@/src/stores/searchStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function PassengerSelect() {
  const { t } = useTranslation();

  const passengers = useSearchStore((s) => s.passengers);
  const setPassengers = useSearchStore((s) => s.setPassengers);

  const changeCount = (type: "adults" | "children", delta: number) => {
    setPassengers({
      ...passengers,
      [type]: Math.max(0, passengers[type] + delta),
    });
  };

  const Row = ({
    label,
    description,
    type,
  }: {
    label: string;
    description: string;
    type: "adults" | "children";
  }) => (
    <View className="px-6 py-4 border-b border-border-light bg-bg-light flex-row justify-between items-center">
      <View>
        <Text className="text-base text-text-dark font-medium">{label}</Text>
        <Text className="text-sm text-gray-500 mb-2">{description}</Text>
      </View>
      <View className="flex-row items-center justify-start">
        <TouchableOpacity
          onPress={() => changeCount(type, -1)}
          className="p-2 rounded-full border border-border-light"
        >
          <Ionicons name="remove" size={18} color="#6B7280" />
        </TouchableOpacity>
        <Text className="mx-6 text-base text-text-dark">
          {passengers[type]}
        </Text>
        <TouchableOpacity
          onPress={() => changeCount(type, 1)}
          className="p-2 rounded-full border border-border-light"
        >
          <Ionicons name="add" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-bg-light justify-between pb-12">
      <View>
        <Row
          label={t("search.adults", "Adults")}
          description={t("passengers.adultDesc", "Age 12+")}
          type="adults"
        />
        <Row
          label={t("search.children", "Children")}
          description={t("passengers.childrenDesc", "Aged 0 to 12")}
          type="children"
        />

        <Text className="px-6 mt-4 text-sm text-gray-500 leading-5">
          {t(
            "passengers.ageNote",
            "Your age at the time of travel must meet the requirements for the selected ticket type. Some bus operators have restrictions on minors traveling alone."
          )}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="mx-6 bg-accent rounded-xl flex items-center justify-center h-16"
        activeOpacity={0.8}
      >
        <Text className="text-text-light font-semibold text-base">
          {t("common.save", "Save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
