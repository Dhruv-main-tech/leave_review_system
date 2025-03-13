import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Text, View } from "@/components/Themed";
import axios from "axios";
import { Platform } from "react-native";

interface Outgoing {
  _id: string;
  rollNo: string;
  reason: string;
  time: string;
  createdAt: string;
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
const getBaseUrl = () => "https://nps-backend-1.onrender.com";

export default function OutgoingRecords() {
  const [modalVisible, setModalVisible] = useState(false);
  const [outgoings, setOutgoings] = useState<Outgoing[]>([]);
  const [filteredOutgoings, setFilteredOutgoings] = useState<Outgoing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOutgoings = async () => {
    try {
      setLoading(true);
      const baseURL = getBaseUrl();
      const response = await axios.get(`${baseURL}/api/outgoings`);

      if (response.data.success) {
        setOutgoings(response.data.outgoings);
        setFilteredOutgoings(response.data.outgoings);
      }
    } catch (error) {
      console.error("Error fetching outgoings:", error);
      Alert.alert("Error", "Failed to load outgoing records");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredOutgoings(outgoings);
    } else {
      const filtered = outgoings.filter((outgoing) =>
        outgoing.rollNo.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOutgoings(filtered);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const baseURL = getBaseUrl();
      const response = await axios.delete(`${baseURL}/api/outgoings/${id}`);

      if (response.data.success) {
        Alert.alert("Success", "Record approved and deleted");
        fetchOutgoings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error approving record:", error);
      Alert.alert("Error", "Failed to approve record");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalVisible(true);
          fetchOutgoings();
        }}
      >
        <Text style={styles.buttonText}>View Outgoing Records</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Outgoing Records</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search by Roll Number"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#000"
            />

            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : filteredOutgoings.length > 0 ? (
              <ScrollView style={styles.recordsList}>
                {filteredOutgoings.map((outgoing) => (
                  <View key={outgoing._id} style={styles.recordItem}>
                    <Text style={styles.rollNoText}>
                      Roll No: {outgoing.rollNo}
                    </Text>
                    <Text style={styles.timeText}>Time: {outgoing.time}</Text>
                    <Text style={styles.reasonText}>
                      Reason:{" "}
                      {outgoing.reason.charAt(0).toUpperCase() +
                        outgoing.reason.slice(1)}
                    </Text>
                    <Text style={styles.dateText}>
                      Date: {formatDate(outgoing.createdAt)}
                    </Text>

                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(outgoing._id)}
                    >
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noRecordsText}>
                {searchQuery
                  ? "No matching records found"
                  : "No outgoing records"}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  closeIconText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  recordsList: {
    maxHeight: "100%",
  },
  recordItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  rollNoText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  timeText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  reasonText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  noRecordsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});
