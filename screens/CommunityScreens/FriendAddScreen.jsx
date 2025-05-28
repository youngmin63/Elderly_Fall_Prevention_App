import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../BackButton";
import { apiClient } from "../../api/api";

export default function FriendAddScreen() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const res = await apiClient.get("/api/user/search", {
        params: { keyword: searchInput.trim() },
      });
      setSearchResults(res.data); // 배열 형태로 저장
    } catch (e) {
      console.error("❌ 사용자 검색 실패", e);
      Alert.alert("검색 실패", "해당 사용자를 찾을 수 없습니다.");
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (targetUsername) => {
    try {
      const currentUsername = await AsyncStorage.getItem("username");

      if (!currentUsername) {
        Alert.alert("요청 실패", "로그인 정보가 없어 요청을 보낼 수 없습니다.");
        return;
      }

      console.log("📤 친구 요청 대상:", targetUsername);
      console.log("👤 요청 보낸 사람:", currentUsername);

      await apiClient.post(
        "/api/friends/add",
        { targetUsername },
        {
          headers: {
            username: currentUsername,
          },
        }
      );

      Alert.alert(
        "요청 완료",
        `${targetUsername}님에게 친구 요청을 보냈습니다.`
      );
    } catch (e) {
      console.error("❌ 친구 요청 실패", e.response?.data || e.message);
      Alert.alert("요청 실패", "이미 요청했거나 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>친구 추가</Text>

      <TextInput
        style={styles.input}
        placeholder="사용자 이름"
        value={searchInput}
        onChangeText={setSearchInput}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>🔍 검색</Text>
      </TouchableOpacity>

      {searchResults.length > 0
        ? searchResults.map((user) => (
            <View key={user.id} style={styles.resultBox}>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.info}>
                나이: {user.age} / 성별: {user.gender}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleSendRequest(user.username)}
              >
                <Text style={styles.addButtonText}>➕ 친구 요청 보내기</Text>
              </TouchableOpacity>
            </View>
          ))
        : searchInput.trim().length > 0 && (
            <Text style={styles.noResult}>검색 결과가 없습니다.</Text>
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
    marginTop:40,
    color: "#111827",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: "#3182F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  noResult: {
    marginTop: 20,
    color: "#888",
    textAlign: "center",
    fontSize: 15,
  },
});
