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
import { getAdminData } from "@/data";
import axios from "axios";
import { Platform } from "react-native";
import Loader from "./Loader";

interface Request {
  _id: string;
  rollNo: string;
  reason: string;
  time: string;
  status: string;
  createdAt: string;
}

interface AttendanceData {
  [key: string]: number; // Store attendance percentage for each rollNo
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
const baseURL = getBaseUrl();

export default function AdminRequests() {
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendance = async (rollNo: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/student/attendance/${rollNo}`
      );

      if (response.data.success) {
        setAttendanceData((prev) => ({
          ...prev,
          [rollNo]: response.data.attendance,
        }));
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/admin/requests`);

      if (response.data.success) {
        const pendingRequests = response.data.requests.filter(
          (req: Request) => req.status.toLowerCase() === "admin pending"
        );
        setRequests(pendingRequests);

        // Fetch attendance for each request
        pendingRequests.forEach((request: Request) => {
          fetchAttendance(request.rollNo);
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/admin/request-action`, {
        requestId,
        action,
      });

      if (response.data.success) {
        Alert.alert(
          "Success",
          action === "approve"
            ? "Request approved successfully"
            : "Request rejected"
        );
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      Alert.alert("Error", `Failed to ${action} request`);
    } finally {
      setIsLoading(false);
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

            <Text style={styles.modalTitle}>Admin Pending Requests</Text>

            {loading ? (
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

                    <View style={styles.attendanceContainer}>
                      <Text style={styles.attendanceText}>
                        Attendance:{" "}
                        {attendanceData[request.rollNo]
                          ? `${attendanceData[request.rollNo]}%`
                          : "Loading..."}
                      </Text>
                    </View>

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
    marginBottom: 10,
    color: "#000",
  },
  callButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
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
  noRequestsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  attendanceContainer: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  attendanceText: {
    fontSize: 16,
    color: "#1976d2",
    textAlign: "center",
    fontWeight: "500",
  },
});
