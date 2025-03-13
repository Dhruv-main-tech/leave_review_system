import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { router } from "expo-router";
import { unregisterIndieDevice } from "native-notify";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/components/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const handleLogout = async () => {
    // Retrieve user data from local storage
    const userData = await AsyncStorage.getItem("userData");
    const { role, rollNo, uname } = JSON.parse(userData || "{}");

    // Determine the identifier based on user role
    const identifier = role === "student" ? rollNo : uname;

    unregisterIndieDevice(identifier, 25808, "iT4i6UowibvqQ70BwbTdkg");
    router.replace("/");
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        marginRight: 15,
        backgroundColor: "#dc3545",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="page1"
          options={{
            headerTitle: "Student Dashboard",
            headerRight: () => <LogoutButton />,
            headerLeft: () => null,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="page2"
          options={{
            headerTitle: "Faculty Dashboard",
            headerRight: () => <LogoutButton />,
            headerLeft: () => null,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="page3"
          options={{
            headerTitle: "Security Dashboard",
            headerRight: () => <LogoutButton />,
            headerLeft: () => null,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="page4"
          options={{
            headerTitle: "Admin Dashboard",
            headerRight: () => <LogoutButton />,
            headerLeft: () => null,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
