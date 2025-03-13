import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  View as RNView,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Text } from "@/components/Themed";
import { getStudentData } from "@/data";
import RadioButton from "@/components/RadioButton";
import axiosInstance from "@/config/axios";
import Loader from "./Loader";

export default function ApplyLeave() {
  const [modalVisible, setModalVisible] = useState(false);
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [time, setTime] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [hodName, setHodName] = useState("");
  const [mentorName, setMentorName] = useState("");
  const reasons = ["Sick", "Function", "Hackathon", "Internship"];
  const [rollNo, setRollNo] = useState("");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots from 8 AM to 5 PM
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await getStudentData();
        if (data) {
          setHodName(data.hod);
          setMentorName(data.mentor);
          setTo(data.hod); // Default to HOD
          setRollNo(data.rollNo); // Assuming username is the roll number
        }
      } catch (error) {
        console.error("Error loading student data:", error);
      }
    };

    loadStudentData();
  }, []);

  const handleReasonSelect = (selectedReason: string) => {
    setReason(selectedReason.toLowerCase());
    setShowReasonDropdown(false);
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimeModal(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requestData = {
        rollNo,
        reason,
        to,
        time,
      };

      console.log("Submitting request:", requestData);

      const response = await axiosInstance.post("/api/requests", requestData);

      if (response.data.success) {
        Alert.alert("Success", "Leave request submitted successfully");
        setModalVisible(false);
        setTo("");
        setReason("");
        setTime("");
      } else {
        Alert.alert("Error", "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Failed to submit leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const getBaseUrl = () => {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000";
    } else if (Platform.OS === "ios") {
      return "http://localhost:3000";
    } else {
      return "http://localhost:3000";
    }
  };

  return (
    <RNView style={styles.container}>
      <Loader loading={isLoading} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Apply Leave</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <RNView style={styles.modalContainer}>
          <RNView style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>

            <RNView style={styles.inputContainer}>
              <Text style={styles.label}>To</Text>
              <RNView style={styles.radioContainer}>
                <RadioButton
                  label={hodName}
                  selected={to === hodName}
                  onSelect={() => setTo(hodName)}
                />
                <RadioButton
                  label={mentorName}
                  selected={to === mentorName}
                  onSelect={() => setTo(mentorName)}
                />
              </RNView>
            </RNView>

            <RNView style={styles.inputContainer}>
              <Text style={styles.label}>Leave Time</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowTimeModal(true)}
              >
                <Text style={styles.timeInputText}>
                  {time || "Select Time"}
                </Text>
              </TouchableOpacity>
            </RNView>

            <RNView style={styles.inputContainer}>
              <Text style={styles.label}>Reason</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowReasonDropdown(!showReasonDropdown);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownButtonText}>
                  {reason
                    ? reason.charAt(0).toUpperCase() + reason.slice(1)
                    : "Select Reason"}
                </Text>
              </TouchableOpacity>

              {showReasonDropdown && (
                <RNView style={styles.dropdownList}>
                  {reasons.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => handleReasonSelect(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </RNView>
              )}
            </RNView>

            {reason && !showReasonDropdown && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.7}
                disabled={!time} // Disable if time is not set
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </RNView>
        </RNView>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTimeModal}
        onRequestClose={() => setShowTimeModal(false)}
      >
        <TouchableOpacity
          style={styles.timeModalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimeModal(false)}
        >
          <RNView style={styles.timeModalContent}>
            <Text style={styles.timeModalTitle}>Select Time</Text>
            <ScrollView style={styles.timeScrollView}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    time === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(slot)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      time === slot && styles.selectedTimeSlotText,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RNView>
        </TouchableOpacity>
      </Modal>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000", // Ensure background color is set
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#000", // Set label color to black
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  timeInputText: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000000",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeIconText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  timeModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timeModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#000000",
  },
  timeScrollView: {
    maxHeight: 300,
  },
  timeSlot: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedTimeSlot: {
    backgroundColor: "#2196F3",
  },
  timeSlotText: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
  },
  selectedTimeSlotText: {
    color: "#fff",
  },
});
