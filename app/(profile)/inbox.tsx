"use client";

import { useAuthStore } from "@/src/stores/authStore";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Info,
  MessageCircle,
  Star,
  Tag,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: string;
  type: "booking" | "promotion" | "system" | "update" | "support";
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  metadata?: {
    bookingId?: string;
    routeInfo?: string;
    promoCode?: string;
    expiryDate?: string;
  };
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmation - #GB2024001",
    content:
      "Your booking for Skopje → Belgrade on March 20, 2024 has been confirmed. Departure: 08:30 AM from Skopje Bus Station.",
    timestamp: "2024-03-15T10:30:00Z",
    isRead: false,
    isStarred: false,
    metadata: {
      bookingId: "GB2024001",
      routeInfo: "Skopje → Belgrade",
    },
  },
  {
    id: "2",
    type: "promotion",
    title: "🎉 Spring Sale - 25% Off All Routes!",
    content:
      "Book your next adventure with 25% off on all European routes. Use code SPRING25. Valid until March 31st.",
    timestamp: "2024-03-14T14:20:00Z",
    isRead: true,
    isStarred: true,
    metadata: {
      promoCode: "SPRING25",
      expiryDate: "2024-03-31",
    },
  },
  {
    id: "3",
    type: "system",
    title: "Service Update: New Route Added",
    content:
      "We're excited to announce a new route: Pristina → Tirana. Daily departures starting March 25th with modern buses.",
    timestamp: "2024-03-13T09:15:00Z",
    isRead: true,
    isStarred: false,
  },
  {
    id: "4",
    type: "update",
    title: "Departure Time Change - #GB2024001",
    content:
      "Your departure time for Skopje → Belgrade has been updated from 08:30 AM to 09:00 AM. No action required.",
    timestamp: "2024-03-12T16:45:00Z",
    isRead: false,
    isStarred: false,
    metadata: {
      bookingId: "GB2024001",
      routeInfo: "Skopje → Belgrade",
    },
  },
  {
    id: "5",
    type: "support",
    title: "Customer Support Response",
    content:
      "Thank you for contacting us regarding your refund request. Your refund has been processed and will appear in your account within 3-5 business days.",
    timestamp: "2024-03-11T11:20:00Z",
    isRead: true,
    isStarred: false,
  },
];

export default function InboxScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredMessages = messages.filter((message) => {
    switch (filter) {
      case "unread":
        return !message.isRead;
      case "starred":
        return message.isStarred;
      default:
        return true;
    }
  });

  const unreadCount = messages.filter((msg) => !msg.isRead).length;
  const starredCount = messages.filter((msg) => msg.isStarred).length;

  const getMessageIcon = (type: Message["type"]) => {
    switch (type) {
      case "booking":
        return { icon: CheckCircle, color: "#10b981" };
      case "promotion":
        return { icon: Tag, color: "#f59e0b" };
      case "system":
        return { icon: Info, color: "#3b82f6" };
      case "update":
        return { icon: AlertCircle, color: "#ef4444" };
      case "support":
        return { icon: MessageCircle, color: "#8b5cf6" };
      default:
        return { icon: MessageCircle, color: "#6b7280" };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const handleToggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const handleDeleteMessage = (id: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
          },
        },
      ]
    );
  };

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft color="#fff" size={24} />
    </TouchableOpacity>
  );

  const FilterButton = ({
    filterType,
    label,
    count,
  }: {
    filterType: typeof filter;
    label: string;
    count?: number;
  }) => (
    <TouchableOpacity
      onPress={() => setFilter(filterType)}
      className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
        filter === filterType
          ? "bg-pink-600"
          : "bg-white border border-gray-200"
      }`}
    >
      <View className="flex-row items-center justify-center">
        <Text
          className={`font-medium ${
            filter === filterType ? "text-white" : "text-gray-700"
          }`}
        >
          {label}
        </Text>
        {count !== undefined && count > 0 && (
          <View
            className={`ml-2 px-2 py-1 rounded-full ${
              filter === filterType ? "bg-pink-800" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filter === filterType ? "text-white" : "text-gray-600"
              }`}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const MessageItem = ({ item }: { item: Message }) => {
    const { icon: IconComponent, color } = getMessageIcon(item.type);

    return (
      <TouchableOpacity
        onPress={() => {
          handleMarkAsRead(item.id);
          // router.push(`/inbox/${item.id}`);
        }}
        className={`bg-white mx-4 my-2 rounded-xl p-4 shadow-sm border ${
          item.isRead ? "border-gray-100" : "border-pink-200 bg-pink-50"
        }`}
      >
        <View className="flex-row items-start">
          <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mr-4">
            <IconComponent color={color} size={24} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <Text
                className={`text-base font-semibold flex-1 pr-2 ${
                  item.isRead ? "text-gray-900" : "text-gray-900"
                }`}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleToggleStar(item.id)}
                  className="p-1 mr-2"
                >
                  <Star
                    color={item.isStarred ? "#f59e0b" : "#d1d5db"}
                    fill={item.isStarred ? "#f59e0b" : "none"}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text
              className="text-sm text-gray-600 mb-3 leading-5"
              numberOfLines={3}
            >
              {item.content}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-400">
                {formatTimestamp(item.timestamp)}
              </Text>

              {item.metadata && (
                <View className="flex-row items-center">
                  {item.metadata.routeInfo && (
                    <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                      <Text className="text-xs text-blue-700 font-medium">
                        {item.metadata.routeInfo}
                      </Text>
                    </View>
                  )}
                  {item.metadata.promoCode && (
                    <View className="bg-yellow-100 px-2 py-1 rounded-full">
                      <Text className="text-xs text-yellow-700 font-medium">
                        {item.metadata.promoCode}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <MessageCircle color="#d1d5db" size={80} />
      <Text className="text-xl font-semibold text-gray-900 mt-6 mb-2">
        {filter === "unread"
          ? "No unread messages"
          : filter === "starred"
            ? "No starred messages"
            : "No messages yet"}
      </Text>
      <Text className="text-gray-600 text-center leading-6">
        {!isAuthenticated
          ? "Sign in to receive booking confirmations, promotions, and important updates."
          : filter === "unread"
            ? "All caught up! New messages will appear here."
            : filter === "starred"
              ? "Star important messages to find them easily."
              : "Your booking confirmations, promotions, and updates will appear here."}
      </Text>
      {!isAuthenticated && (
        <TouchableOpacity
          onPress={() => router.push("/(modals)/login")}
          className="bg-pink-600 py-3 px-6 rounded-lg mt-6"
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Filter Tabs */}
      <View className="bg-white py-4 px-4 border-b border-gray-100">
        <View className="flex-row">
          <FilterButton filterType="all" label="All" count={messages.length} />
          <FilterButton
            filterType="unread"
            label="Unread"
            count={unreadCount}
          />
          <FilterButton
            filterType="starred"
            label="Starred"
            count={starredCount}
          />
        </View>
      </View>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageItem item={item} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#15203e"
              colors={["#15203e"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
