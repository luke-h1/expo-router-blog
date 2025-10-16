import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ThemedText, useThemeColor } from "@src/components/Themed";
import { theme } from "@src/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { osName } from "expo-device";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      refetchOnReconnect: true,
      retryDelay: 3000,
    },
  },
});

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export default function RootLayout() {
  const router = useRouter();
  const pathName = usePathname();
  const colorScheme = useColorScheme() || "light";

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
        colorScheme === "light" ? "dark" : "light"
      );
    }
  }, [colorScheme]);

  const tabBarBackgroundColor = useThemeColor(theme.color.background);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <ActionSheetProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              <Stack.Screen
                name="blog/[id]"
                options={{
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerLargeTitle: false,
                  title: "",
                  presentation:
                    Platform.OS === "ios"
                      ? isLiquidGlassAvailable() && osName !== "iPadOS"
                        ? "formSheet"
                        : "modal"
                      : "modal",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.8],
                  sheetInitialDetentIndex: 0,
                  contentStyle: {
                    backgroundColor: isLiquidGlassAvailable()
                      ? "transparent"
                      : tabBarBackgroundColor,
                  },
                  headerStyle: {
                    backgroundColor:
                      Platform.OS === "ios"
                        ? "transparent"
                        : tabBarBackgroundColor,
                  },
                  headerBlurEffect: isLiquidGlassAvailable()
                    ? undefined
                    : colorScheme === "dark"
                    ? "dark"
                    : "light",
                }}
              />

              <Stack.Screen
                name="author/[id]"
                options={{
                  presentation: "modal",
                  headerStyle: {
                    backgroundColor:
                      Platform.OS === "ios"
                        ? "transparent"
                        : tabBarBackgroundColor,
                  },
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerTitleAlign: "center",
                  headerBlurEffect: isLiquidGlassAvailable()
                    ? undefined
                    : colorScheme === "dark"
                    ? "dark"
                    : "light",
                  headerTitle: Platform.select({
                    android: (props) => (
                      <ThemedText fontSize={theme.fontSize24} fontWeight="bold">
                        {props.children}
                      </ThemedText>
                    ),
                    default: undefined,
                  }),
                }}
              />
            </Stack>
          </ThemeProvider>
        </ActionSheetProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
