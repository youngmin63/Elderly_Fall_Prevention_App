import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../api/api"; // Corrected the path to match the actual location
import BackButton from "../BackButton";
const { width } = Dimensions.get("window");

const ExerciseSummaryScreen = ({ route, navigation }) => {
  const { exerciseName, totalTime, completedSets } = route.params;

  const [feedback, setFeedback] = useState(null);
  const [memo, setMemo] = useState("");
  const [visibility, setVisibility] = useState("public");

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secR = sec % 60;
    return `${min}분 ${secR}초`;
  };

  const calculateIntensity = () => {
    const base = completedSets * 1.5;
    const feedbackModifier =
      feedback === "힘들었어요" ? 1.3 : feedback === "적당했어요" ? 1.0 : 0.7;
    return Math.round(base * feedbackModifier * 10) / 10; // 소수점 1자리
  };

  const handleSave = async () => {
    if (!feedback) {
      Alert.alert("피드백을 선택해주세요.");
      return;
    }

    const intensityScore = calculateIntensity();

    const payload = {
      exerciseName,
      totalTime,
      completedSets,
      feedback,
      memo,
      visibility,
      intensityScore,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await apiClient.post("/api/workout/records/save", payload);

      Alert.alert("운동 기록이 저장되었습니다!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("저장 실패", "네트워크 오류가 발생했습니다.");
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.header}>{exerciseName}</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.label}>총 운동 시간</Text>
        <Text style={styles.value}>{formatTime(totalTime)}</Text>

        <Text style={styles.label}>완료 세트</Text>
        <Text style={styles.value}>
          {completedSets}세트 완료 (15회 × {completedSets})
        </Text>

        <Text style={styles.label}>운동 난이도</Text>
        <View style={styles.feedbackRow}>
          {["쉬웠어요", "적당했어요", "힘들었어요"].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.feedbackBtn,
                feedback === level && styles.selectedBtn,
              ]}
              onPress={() => setFeedback(level)}
            >
              <Text
                style={[
                  styles.feedbackText,
                  feedback === level && styles.selectedText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>메모</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="오늘 운동 어땠나요?"
          value={memo}
          onChangeText={setMemo}
        />
        <Text style={styles.label}>공개 범위</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              visibility === "public" && styles.selectedButton,
            ]}
            onPress={() => setVisibility("public")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                visibility === "public" && styles.selectedText,
              ]}
            >
              🔓 전체 공개
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              visibility === "private" && styles.selectedButton,
            ]}
            onPress={() => setVisibility("private")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                visibility === "private" && styles.selectedText,
              ]}
            >
              🔒 비공개
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfdfd", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
    marginTop: 40,
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20, color: "#555" },
  value: { fontSize: 16, marginTop: 4, color: "#333" },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  feedbackBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selectedBtn: { backgroundColor: "#3498db" },
  feedbackText: { color: "#555" },

  memoInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    color: "#333",
  },
  pickerBox: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#1abc9c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  selectedButton: {
    backgroundColor: "#3182F6",
    borderColor: "#3182F6",
  },

  toggleButtonText: {
    fontSize: 16,
    color: "#666",
  },

  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ExerciseSummaryScreen;
