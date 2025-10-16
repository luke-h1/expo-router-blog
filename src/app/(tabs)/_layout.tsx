import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useThemeColor } from "@src/components/Themed";
import { theme } from "@src/theme";
import { Tabs } from "expo-router";

export default function Layout() {
  const inactiveTintColor = useThemeColor({
    light: "#00000090",
    dark: "#FFFFFF90",
  });

  const tintColor = useThemeColor(theme.color.reactBlue);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        headerShown: false,
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
