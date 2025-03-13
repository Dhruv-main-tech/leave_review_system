import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/Themed";
import { Stack, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Alert } from "react-native";

export default function FacultyRegistration() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("mentor");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    validateInputs();
  }, [name, password, confirmPassword, branch, year, section, role]);

  const validateInputs = () => {
    if (!name || !password || !confirmPassword || !branch || !year) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleInputChange = (setter) => (value) => {
    setter(value);
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsRegistering(true);
    try {
      const response = await axios.post(
        //"http://localhost:3000/api/register-faculty",
        "https://nps-backend-1.onrender.com/api/register-faculty",
        {
          facultyName: name,
          password: password,
          role: role.toLowerCase(),
          branch: branch,
          year: year,
          section: role === "mentor" ? section : null,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Registration successful!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Faculty Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Name / Username"
          value={name}
          onChangeText={handleInputChange(setName)}
          placeholderTextColor="#000"
          editable={!isRegistering}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#000"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#000"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Mentor" value="mentor" />
            <Picker.Item label="HOD" value="hod" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={branch}
            onValueChange={(itemValue) => setBranch(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="CSE" value="CSE" />
            <Picker.Item label="CSM" value="CSM" />
            <Picker.Item label="CSD" value="CSD" />
            <Picker.Item label="IT" value="IT" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Year (1-4)"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          placeholderTextColor="#000"
        />

        {role === "mentor" && (
          <TextInput
            style={styles.input}
            placeholder="Section"
            value={section}
            onChangeText={setSection}
            placeholderTextColor="#000"
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  pickerContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  picker: {
    width: "100%",
    height: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
