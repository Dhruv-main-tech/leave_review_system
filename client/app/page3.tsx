import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import OutgoingRecords from "@/components/OutgoingRecords";

export default function Page4Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Dashboard</Text>
      <OutgoingRecords />
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
