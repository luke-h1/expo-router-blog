import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "expo-router-blog",
  slug: "expo-router-blog",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "exporouterblog",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "3b061c35-9771-435f-956b-e8ab1a782caa",
    },
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic",
    config: {
      usesNonExemptEncryption: false,
    },
    bundleIdentifier: "com.lukehowsam123.exporouterblog",
  },
  android: {
    package: "com.lukehowsam123.exporouterblog",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "node_modules/@expo-google-fonts/montserrat/Montserrat_300Light.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_300Light_Italic.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_500Medium.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_500Medium_Italic.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_600SemiBold_Italic.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_700Bold.ttf",
          "node_modules/@expo-google-fonts/montserrat/Montserrat_700Bold_Italic.ttf",
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
