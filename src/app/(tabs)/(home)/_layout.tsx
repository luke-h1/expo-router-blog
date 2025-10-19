import { theme } from "@src/theme";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: Platform.OS === "ios" ? "Home" : "",
          headerStyle: {
            backgroundColor: theme.color.background.dark,
          },
        }}
      />
    </Stack>
  );
}
