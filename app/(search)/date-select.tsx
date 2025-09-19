"use client";

import { useSearchStore } from "@/src/stores/searchStore";
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DateSelect() {
  const setDepartureDate = useSearchStore((s) => s.setDepartureDate);
  const setReturnDate = useSearchStore((s) => s.setReturnDate);
  const selectedDateStr = useSearchStore((s) => s.departureDate);
  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;

  const today = new Date();

  const months = Array.from({ length: 13 }).map((_, i) => addMonths(today, i));

  const handleSelect = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    setDepartureDate(formatted);
    router.back();
  };

  const renderDay = (day: Date) => {
    const isPast = day < today;
    const isSelected = selectedDate && isSameDay(day, selectedDate);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        onPress={() => !isPast && handleSelect(day)}
        style={{
          width: `${100 / 7}%`,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          className={`text-center ${
            isPast ? "text-gray-300" : "text-text-dark"
          } ${isSelected ? "bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center" : ""}`}
        >
          {day.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMonth = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = [];

    for (let i = 0; i < start.getDay(); i++) {
      days.push(null);
    }

    for (let d = start.getDate(); d <= end.getDate(); d++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), d));
    }

    return (
      <View key={month.toISOString()} className="mb-6">
        <View className="bg-bg-dark px-4 py-3 rounded-md mb-2">
          <Text className="text-base font-semibold text-primary/80 uppercase">
            {format(month, "MMMM yyyy")}
          </Text>
        </View>

        <View className="flex-row flex-wrap px-4">
          {days.map((day, i) =>
            day ? (
              renderDay(day)
            ) : (
              <View key={i} style={{ width: `${100 / 7}%`, height: 50 }} />
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-bg-light">
      {/* Weekdays row */}
      <View className="flex-row px-4 py-4 bg-bg-light z-10">
        {DAYS.map((day) => (
          <Text
            key={day}
            className="flex-1 text-center text-gray-500 font-medium"
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Bottom shadow */}
      <View
        style={{
          height: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      />

      <FlatList
        data={months}
        keyExtractor={(m) => m.toISOString()}
        renderItem={({ item }) => renderMonth(item)}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
