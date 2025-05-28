import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AI_URL, apiClient } from "../../api/api";

import exerciseMeta from "../../exerciseMeta";
import BackButton from "../BackButton";

export default function ExerciseRecommendScreen({ navigation }) {
  const [condition, setCondition] = useState("보통");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGetRecommendation = async () => {
    setLoading(true);
    setErrorMessage("");
    setRecommendations([]);

    try {
      const [inputRes, leftRes, rightRes, profileRes] = await Promise.all([
        apiClient.get("/api/analyze/recommend-input"),
        apiClient.get("/api/balance/latest?foot=left"),
        apiClient.get("/api/balance/latest?foot=right"),
        apiClient.get("/api/user/me"),
      ]);

      const input = inputRes.data;
      const left = leftRes.data.balanceScore;
      const right = rightRes.data.balanceScore;
      const profile = profileRes.data;

      const requestBody = {
        balance_score_left: left,
        balance_score_right: right,
        age: profile.age,
        gender: profile.gender === "남성" ? 0 : 1,
        condition,
        recent_scores: input.recentScores,
        recent_intensity_avg: input.avgIntensity,
        recent_duration_sum: input.totalDuration,
        focus_area: input.focusArea,
      };

      const res = await apiClient.post(`${AI_URL}/api/recommend`, requestBody);
      const result = res.data;

      if (result.status !== "success") throw new Error("추천 실패");

      const enriched = result.recommendations.map((r) => ({
        name: r.name,
        reason: exerciseMeta[r.name]?.reason || "설명을 준비 중입니다.",
        focusArea: exerciseMeta[r.name]?.focusArea || "기타",
        gifUrl: exerciseMeta[r.name]?.gifUrl || null,
      }));

      setRecommendations(enriched);
    } catch (error) {
      console.error("❌ 추천 오류:", error);
      setErrorMessage(error.message || "추천에 실패했습니다.");
    }

    setLoading(false);
  };

  const getFocusStyle = (area) => {
    switch (area) {
      case "하체":
        return { color: "#6FCF97", icon: "🦵" };
      case "상체":
        return { color: "#56CCF2", icon: "💪" };
      case "코어":
        return { color: "#F2C94C", icon: "🧘" };
      case "유연성":
        return { color: "#BB6BD9", icon: "🤸" };
      default:
        return { color: "#BDBDBD", icon: "🏋️" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}> 맞춤 운동 추천</Text>
      <Text style={styles.subtitle}>오늘의 컨디션은 어떤가요?</Text>

      <View style={styles.conditionBox}>
        {["나쁨", "보통", "좋음"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.conditionButton,
              condition === item && styles.selectedButton,
            ]}
            onPress={() => setCondition(item)}
          >
            <Text
              style={[
                styles.conditionText,
                condition === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.recommendButton}
        onPress={handleGetRecommendation}
        disabled={loading}
      >
        <Text style={styles.recommendButtonText}>
          {loading ? "분석 중..." : "운동 추천 받기"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#3182F6"
          style={{ marginTop: 20 }}
        />
      )}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <ScrollView contentContainerStyle={styles.cardContainer}>
        {recommendations.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              setSelectedExercise(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardReason} numberOfLines={2}>
              {item.reason}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {selectedExercise?.focusArea && (
              <View
                style={[
                  styles.focusBadge,
                  {
                    backgroundColor: getFocusStyle(selectedExercise.focusArea)
                      .color,
                  },
                ]}
              >
                <Text style={styles.focusText}>
                  {getFocusStyle(selectedExercise.focusArea).icon}{" "}
                  {selectedExercise.focusArea}
                </Text>
              </View>
            )}

            {selectedExercise?.gifUrl && (
              <Image
                source={{ uri: selectedExercise.gifUrl }}
                style={styles.gif}
              />
            )}

            <Text style={styles.modalText}>{selectedExercise?.reason}</Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ExerciseDetail", {
                  exercise: selectedExercise,
                });
              }}
            >
              <Text style={styles.startButtonText}>운동 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F3F6", padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    marginTop: 30,
    marginBottom: 16,
    textAlign: "center",  // 👈 추가
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",  // 👈 추가
  },
  conditionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 0,
  },
  conditionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#EAF2FF",
    borderColor: "#3182F6",
  },
  conditionText: { fontSize: 15, color: "#333", fontWeight: "500" },
  selectedText: { color: "#3182F6", fontWeight: "600" },
  recommendButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  recommendButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  errorText: {
    marginTop: 20,
    color: "#E53935",
    fontSize: 14,
    textAlign: "center",
  },
  cardContainer: { paddingBottom: 60,marginTop: 40 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3182F6",
    marginBottom: 6,
  },
  cardReason: { fontSize: 14, color: "#555", lineHeight: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#232222" },
  modalClose: { fontSize: 20, color: "#888", padding: 4 },
  focusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  focusText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  gif: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F2F3F6",
  },
  modalText: { fontSize: 15, color: "#444", lineHeight: 22, marginBottom: 24 },
  startButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
