import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { apiClient } from "../../api/api";
import BackButton from "../BackButton";

export default function MyInfoScreen() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get("/api/user/me");
        setUserInfo(res.data);
      } catch (e) {
        console.error("❌ 사용자 정보 불러오기 실패", e);
      }
    };

    fetchData();
  }, []);

  if (!userInfo) {
    return <Text style={styles.loading}>로딩 중...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>내 정보</Text>

      <View style={styles.infoBox}>
        <InfoRow label="이름" value={userInfo.username} />
        <InfoRow label="나이" value={`${userInfo.age}세`} />
        <InfoRow label="성별" value={userInfo.gender === 1 ? "남성" : "여성"} />
        <InfoRow label="키" value={`${userInfo.height} cm`} />
        <InfoRow label="몸무게" value={`${userInfo.weight} kg`} />
        <InfoRow label="가입일" value={userInfo.joinedDate || "-"} />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 40,
    color: "#1F2937",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
  },
});
