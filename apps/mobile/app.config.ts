import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "mobile",
  slug: "mobile",
  scheme: "mobile",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    // TODO: Change this to true when we have a tablet design
    supportsTablet: false,
    bundleIdentifier: "com.kafeasist.ios",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.kafeasist.android",
  },
  extra: {
    eas: {
      projectId: "eas-kafeasist",
    },
  },
  plugins: [],
});

export default defineConfig;
