import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../BackButton";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("notificationsEnabled").then((value) => {
      if (value !== null) setNotificationsEnabled(value === "true");
    });
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem("notificationsEnabled", String(newValue));
  };

  // 🔥 AsyncStorage를 사용하여 로그아웃 처리

  const navigation = useNavigation(); // ✅ 네비게이션 훅 사용

  const handleNotReady = () => {
    Alert.alert("준비 중", "해당 기능은 곧 제공될 예정입니다.");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (err) {
            console.error("❌ 로그아웃 실패", err);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>환경설정</Text>

      {/* 🔔 알림 설정 카드 */}
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>🔔 알림 설정</Text>
        <Switch
          trackColor={{ false: "#ccc", true: "#3182F6" }}
          thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
          ios_backgroundColor="#ccc"
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      {/* ℹ️ 앱 정보 */}
      <TouchableOpacity style={styles.card} onPress={handleNotReady}>
        <Text style={styles.cardTitle}>ℹ️ 앱 정보</Text>
      </TouchableOpacity>

      {/* 🚪 로그아웃 */}
      <TouchableOpacity style={styles.card} onPress={handleLogout}>
        <Text style={[styles.cardTitle, { color: "#EF4444" }]}>
          🚪 로그아웃
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardRow: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: "row", // ✅ 가로 정렬
    justifyContent: "space-between", // 텍스트 왼쪽, 스위치 오른쪽
    alignItems: "center",
  },
});
