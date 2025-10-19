import * as AC from "@bacons/apple-colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BlurTabBarBackground from "@src/components/BlurTabBackground";
import { HapticTab } from "@src/components/HapticTab";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
        tabBarInactiveTintColor: AC.label as unknown as string,
        tabBarStyle:
          process.env.EXPO_OS === "ios" ? { position: "absolute" } : {},
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="authors"
        options={{
          title: "Authors",

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
