import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack } from "expo-router";
import ApplyLeave from "@/components/ApplyLeave";
import { getStudentData } from "@/data";
import ViewRequests from "@/components/ViewRequests";

export default function Page1Screen() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await getStudentData();
        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    loadStudentData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Apply Leave" }} />
      <StatusBar
        barStyle={Platform.OS === "ios" ? "light-content" : "light-content"}
      />
      <View style={styles.container}>
        <Text style={styles.greeting}>Welcome, {username}!</Text>
        <Text style={styles.title}>Student Dashboard</Text>
        <ApplyLeave />
        <ViewRequests />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  greeting: {
    fontSize: 20,
    marginBottom: 10,
    color: "#2196F3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
});
