import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text, View } from "./Themed";
import axios, { AxiosError } from "axios";
import Loader from "./Loader";
import {
  saveStudentData,
  saveFacultyData,
  saveAdminData,
  saveSecurityData,
} from "@/data";
import { registerIndieID } from "native-notify";

interface LoginFormProps {
  pageNumber: 1 | 2 | 3 | 4;
}

// const getBaseUrl = () => {
//   if (Platform.OS === "android") {
//     return "http://10.0.2.2:3000";
//   } else if (Platform.OS === "ios") {
//     return "http://localhost:3000";
//   } else {
//     return "http://localhost:3000";
//   }
// };
const getBaseUrl = () => {
  return "https://nps-backend-1.onrender.com";
};
export default function LoginForm({ pageNumber }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getInputLabel = () => {
    switch (pageNumber) {
      case 1:
        return "Roll Number";
      default:
        return "Username";
    }
  };

  const validateCredentials = () => {
    if (!identifier || !password) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError("");
    if (validateCredentials()) {
      setIsLoading(true);
      try {
        let response;
        const baseURL = getBaseUrl();

        switch (pageNumber) {
          case 1: // Student Login
            response = await axios.post(`${baseURL}/api/auth/student`, {
              rollNo: identifier,
              password,
            });
            if (response.data.success) {
              await saveStudentData({
                username: response.data.student.uname,
                rollNo: identifier,
                branch: response.data.student.branch,
                year: response.data.student.year,
                section: response.data.student.section,
                mentor: response.data.student.mentor,
                hod: response.data.student.hod,
                phone: response.data.student.phone,
              });
              await registerIndieID(
                identifier,
                25808,
                "iT4i6UowibvqQ70BwbTdkg"
              ); // Replace 1234 with your App ID
              router.push("/page1");
            }
            break;

          case 2: // Faculty Login
            response = await axios.post(`${baseURL}/api/auth/faculty`, {
              username: identifier,
              password,
            });
            if (response.data.success) {
              await saveFacultyData({
                username: identifier,
                ...response.data.faculty,
              });
              await registerIndieID(
                identifier,
                25808,
                "iT4i6UowibvqQ70BwbTdkg"
              ); // Replace 1234 with your App ID
              router.push("/page2");
            }
            break;

          case 3: // Admin Login
            response = await axios.post(`${baseURL}/api/auth/admin`, {
              username: identifier,
              password,
            });
            if (response.data.success) {
              await saveAdminData({
                username: identifier,
                ...response.data.admin,
              });
              await registerIndieID(
                identifier,
                25808,
                "iT4i6UowibvqQ70BwbTdkg"
              ); // Replace 1234 with your App ID
              router.push("/page3");
            }
            break;

          case 4: // Security Login
            response = await axios.post(`${baseURL}/api/auth/security`, {
              username: identifier,
              password,
            });
            if (response.data.success) {
              await saveSecurityData({
                username: identifier,
                ...response.data.security,
              });
              await registerIndieID(
                identifier,
                25808,
                "iT4i6UowibvqQ70BwbTdkg"
              ); // Replace 1234 with your App ID
              router.push("/page4");
            }
            break;
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || "Login failed");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error during login:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegister = () => {
    router.push("/page5");
  };

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <TextInput
        style={styles.input}
        placeholder={getInputLabel()}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        placeholderTextColor="#000"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#000"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {pageNumber === 2 && (
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#2e78b7",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#fff",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
  },
});
