import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email-login" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="signup-form" />
    </Stack>
  );
}
