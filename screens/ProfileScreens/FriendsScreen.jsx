import AsyncStorage from "@react-native-async-storage/async-storage";
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
import BackButton from "../BackButton";

export default function FriendsScreen({ navigation }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const res = await apiClient.get("/api/friends/list", {
          headers: { username },
        });
        setFriends(res.data || []);
      } catch (e) {
        console.error("❌ 친구 목록 조회 실패", e.response?.data || e.message);
      }
    };
    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId) => {
    Alert.alert("친구 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const username = await AsyncStorage.getItem("username");
            await apiClient.post(
              "/api/friends/remove",
              { friendId },
              {
                headers: { username },
              }
            );
            setFriends(friends.filter((f) => f.id !== friendId));
          } catch (e) {
            console.error("❌ 친구 삭제 실패", e.response?.data || e.message);
            Alert.alert("삭제 실패", "잠시 후 다시 시도해주세요.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>내 친구</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("FriendRequestsScreen")}
      >
        <Text style={styles.linkText}>📥 받은 친구 요청 보기</Text>
      </TouchableOpacity>

      {friends.length === 0 ? (
        <Text style={styles.emptyText}>아직 친구가 없습니다.</Text>
      ) : (
        friends.map((f, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.name}>{f.username}</Text>
            <Text style={styles.info}>
              나이: {f.age} / 성별: {f.gender === 1 ? "남성" : "여성"}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveFriend(f.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>❌ 삭제</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 40,
    color: "#111827",
  },
  linkText: {
    color: "#3182F6",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 15,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  removeBtn: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  removeText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "500",
  },
});
