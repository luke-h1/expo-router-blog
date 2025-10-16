import { useThemeColor } from "@src/components/Themed";
import { theme } from "@src/theme";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  const tabBarBackgroundColor = useThemeColor(theme.color.background);
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
            backgroundColor: tabBarBackgroundColor,
          },
        }}
      />
    </Stack>
  );
}
