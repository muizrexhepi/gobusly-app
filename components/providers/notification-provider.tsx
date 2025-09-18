import { useAuthStore } from "@/src/stores/authStore";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, savePushToken } = useAuthStore();

  useEffect(() => {
    const registerPushToken = async () => {
      try {
        // Check permissions
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Push notification permissions not granted");
          return;
        }

        // Get token
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;

        // Save token
        await savePushToken(token);
        console.log("Push token registered:", token);
      } catch (err) {
        console.warn("Failed to register push token:", err);
      }
    };

    registerPushToken();
  }, [user?._id, savePushToken]);

  return <>{children}</>;
}
