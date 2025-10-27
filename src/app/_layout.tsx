import {
  Montserrat_700Bold as MontserratBold,
  Montserrat_700Bold_Italic as MontserratBoldItalic,
  Montserrat_300Light as MontserratLight,
  Montserrat_300Light_Italic as MontserratLightItalic,
  Montserrat_500Medium as MontserratMedium,
  Montserrat_500Medium_Italic as MontserratMediumItalic,
  Montserrat_600SemiBold as MontserratSemiBold,
  Montserrat_600SemiBold_Italic as MontserratSemiBoldItalic,
} from "@expo-google-fonts/montserrat";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ThemedText, useThemeColor } from "@src/components/Themed";
import { usePassiveScroll } from "@src/hooks/usePassiveScroll";
import { theme } from "@src/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { osName } from "expo-device";
import { useFonts } from "expo-font";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as NavigationBar from "expo-navigation-bar";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === "web" ? 5 : 3,
      refetchOnReconnect: true,
      retryDelay: Platform.OS === "web" ? 1000 : 2000,
      staleTime: 60000,
      gcTime: 300000,
    },
  },
});

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";

  usePassiveScroll();

  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Light": MontserratLight,
    "Montserrat-LightItalic": MontserratLightItalic,
    "Montserrat-Medium": MontserratMedium,
    "Montserrat-MediumItalic": MontserratMediumItalic,
    "Montserrat-SemiBold": MontserratSemiBold,
    "Montserrat-SemiBoldItalic": MontserratSemiBoldItalic,
    "Montserrat-Bold": MontserratBold,
    "Montserrat-BoldItalic": MontserratBoldItalic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
        colorScheme === "light" ? "dark" : "light"
      );
    }
  }, [colorScheme]);

  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark"
        ? theme.color.background.dark
        : theme.color.background.light
    );
  }, [colorScheme]);

  const tabBarBackgroundColor = useThemeColor(theme.color.background);

  if (Platform.OS !== "web" && !fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <ActionSheetProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StatusBar
              style={colorScheme === "dark" ? "light" : "dark"}
              translucent={Platform.OS === "android"}
              backgroundColor="transparent"
            />

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
