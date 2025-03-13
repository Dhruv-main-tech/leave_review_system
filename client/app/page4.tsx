import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import AdminRequests from "@/components/AdminRequests";
import RemoveGraduates from "@/components/RemoveGraduates";

export default function Page4Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <AdminRequests />
      <RemoveGraduates />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
