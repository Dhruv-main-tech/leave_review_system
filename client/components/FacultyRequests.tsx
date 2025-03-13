import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { getFacultyData } from "@/data";
import axios from "axios";
import { Platform } from "react-native";
import Loader from "./Loader";

interface Request {
  _id: string;
  rollNo: string;
  reason: string;
  time: string;
  status: string;
  phone: string;
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

export default function FacultyRequests() {
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const facultyData = await getFacultyData();
      if (facultyData) {
        const baseURL = getBaseUrl();
        const response = await axios.get(
          `${baseURL}/api/faculty/requests/${facultyData.username}`
        );

        if (response.data.success) {
          // Filter only pending requests
          const pendingRequests = response.data.requests.filter(
            (req: Request) => req.status.toLowerCase() === "pending"
          );
          setRequests(pendingRequests);
        }
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleRequestAction = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const baseURL = getBaseUrl();
      const response = await axios.post(
        `${baseURL}/api/faculty/request-action`,
        {
          requestId,
          action,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", `Request sent to admin`);
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      Alert.alert("Error", `Failed to ${action} request`);
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setModalVisible(true);
          fetchRequests();
        }}
      >
        <Text style={styles.buttonText}>View Pending Requests</Text>
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

            <Text style={styles.modalTitle}>Pending Leave Requests</Text>

            {isLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : requests.length > 0 ? (
              <ScrollView style={styles.requestsList}>
                {requests.map((request) => (
                  <View key={request._id} style={styles.requestItem}>
                    <Text style={styles.rollNoText}>
                      Roll No: {request.rollNo}
                    </Text>
                    <Text style={styles.timeText}>
                      Leave Time: {request.time}
                    </Text>
                    <Text style={styles.reasonText}>
                      Reason:{" "}
                      {request.reason.charAt(0).toUpperCase() +
                        request.reason.slice(1)}
                    </Text>

                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCall(request.phone)}
                    >
                      <Text style={styles.callButtonText}>
                        📞 Call: {request.phone}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() =>
                          handleRequestAction(request._id, "approve")
                        }
                      >
                        <Text style={styles.actionButtonText}>Approve</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() =>
                          handleRequestAction(request._id, "reject")
                        }
                      >
                        <Text style={styles.actionButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noRequestsText}>No pending requests</Text>
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
    color: "white",
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
  requestsList: {
    maxHeight: "100%",
  },
  requestItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
    color: "#000",
  },
  noRequestsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  callButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  callButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
