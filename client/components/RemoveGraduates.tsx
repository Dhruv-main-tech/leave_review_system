import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";

//const getBaseUrl = () => "http://localhost:3000";
const getBaseUrl = () => "https://nps-backend-1.onrender.com";

export default function RemoveGraduates() {
  const [loading, setLoading] = useState(false);

  const handleRemoveGraduates = async () => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove all graduating students?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Remove",
          onPress: async () => {
            try {
              setLoading(true);
              const baseURL = getBaseUrl();
              const response = await axios.delete(
                `${baseURL}/api/students/graduates`
              );

              if (response.data.success) {
                Alert.alert(
                  "Success",
                  `Removed ${response.data.count} graduating students`
                );
              }
            } catch (error) {
              console.error("Error removing graduates:", error);
              Alert.alert("Error", "Failed to remove graduating students");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRemoveGraduates}
        disabled={loading}
      >
        <View
          style={[styles.buttonContent, { backgroundColor: "transparent" }]}
        >
          {loading && <ActivityIndicator color="#fff" style={styles.spinner} />}
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            {loading ? "Removing Graduates..." : "Remove Graduates"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 5,
    minWidth: 200,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#dc354580",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
