import { Card } from "@/components/ui/Card";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { apiClient } from "../../api/api";
import BackButton from "../BackButton";

export default function BalanceRecordScreen() {
  const [balanceRecords, setBalanceRecords] = useState([]);

  useEffect(() => {
    const fetchBalanceRecords = async () => {
      try {
        const res = await apiClient.get("/api/balance/records");
        setBalanceRecords(res.data);
      } catch (error) {
        console.error("📉 밸런스 기록 조회 실패", error);
      }
    };

    fetchBalanceRecords();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>내 밸런스 기록</Text>
      {balanceRecords.map((record, idx) => (
        <Card key={idx} style={styles.card}>
          <Text style={styles.date}>{record.date}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>
              {record.foot === "left" ? "왼발" : "오른발"}
            </Text>
            <Text style={styles.score}>{record.balanceScore}점</Text>
          </View>
          <Text style={styles.duration}>유지 시간: {record.duration}초</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#4B5563",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  duration: {
    fontSize: 13,
    marginTop: 4,
    color: "#6B7280",
  },
});
