import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { getStudentData } from "@/data";
import axiosInstance from "@/config/axios";
import Loader from "./Loader";

interface Request {
  rollNo: string;
  reason: string;
  to: string;
  status: string;
  time: string;
  createdAt: string;
}

export default function ViewRequests() {
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const studentData = await getStudentData();
      if (studentData) {
        const response = await axiosInstance.get(
          `/api/requests/${studentData.rollNo}`
        );
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#f44336";
      default:
        return "#FFA500";
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
        <Text style={styles.buttonText}>View Requests</Text>
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

            <Text style={styles.modalTitle}>Leave Requests</Text>

            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : requests.length > 0 ? (
              <ScrollView style={styles.requestsList}>
                {requests.map((request, index) => (
                  <View key={index} style={styles.requestItem}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.dateText}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(request.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{request.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.toText}>To: {request.to}</Text>
                    <Text style={styles.timeText}>Time: {request.time}</Text>
                    <Text style={styles.reasonText}>
                      Reason:{" "}
                      {request.reason.charAt(0).toUpperCase() +
                        request.reason.slice(1)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noRequestsText}>No requests found</Text>
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
  toText: {
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
});
