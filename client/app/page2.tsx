import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import FacultyRequests from "@/components/FacultyRequests";
import { getFacultyData } from "@/data";

export default function Page2Screen() {
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        const data = await getFacultyData();
        console.log(data);
        if (data) {
          setFacultyName(data.username);
        }
      } catch (error) {
        console.error("Error loading faculty data:", error);
      }
    };

    loadFacultyData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {facultyName}!</Text>
      <Text style={styles.title}>Faculty Dashboard</Text>
      <FacultyRequests />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 10,
    color: "#2196F3",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
