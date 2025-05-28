import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../api/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../BackButton";

export default function FriendRequestsScreen() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const res = await apiClient.get("/api/friends/pending", {
          headers: { username },
        });
        setRequests(res.data || []);
      } catch (e) {
        console.error("❌ 추가 요청 목록 불러오기 실패", e.response?.data || e.message);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const username = await AsyncStorage.getItem("username");
      await apiClient.post(
        "/api/friends/accept",
        { friendId: id },
        { headers: { username } }
      );
      setRequests(requests.filter((r) => r.id !== id));
    } catch (e) {
      console.error("❌ 친구 요청 수락 실패", e.response?.data || e.message);
      Alert.alert("요청 실패", "수락에 실패했습니다.");
    }
  };

  const handleReject = async (id) => {
    try {
      const username = await AsyncStorage.getItem("username");
      await apiClient.post(
        "/api/friends/reject",
        { friendId: id },
        { headers: { username } }
      );
      setRequests(requests.filter((r) => r.id !== id));
    } catch (e) {
      console.error("❌ 친구 요청 거절 실패", e.response?.data || e.message);
      Alert.alert("요청 실패", "거절에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>받은 친구 요청</Text>

      {requests.length === 0 ? (
        <Text style={styles.empty}>받은 친구 요청이 없습니다.</Text>
      ) : (
        requests.map((r, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.name}>{r.username}</Text>
            <Text style={styles.info}>
              나이: {r.age} / 성별: {r.gender === 1 ? "남성" : "여성"}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.accept}
                onPress={() => handleAccept(r.id)}
              >
                <Text style={styles.buttonText}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reject}
                onPress={() => handleReject(r.id)}
              >
                <Text style={styles.buttonText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 40,
    color: "#111827",
  },
  empty: {
    textAlign: "center",
    fontSize: 15,
    color: "#9CA3AF",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  accept: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reject: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
