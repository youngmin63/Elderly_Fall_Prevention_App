import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BalanceResultScreen({ route, navigation }) {
  const { leftScore, rightScore } = route.params;

  const getFeedback = () => {
    const diff = Math.abs(leftScore - rightScore);
    if (diff < 10) return "좌우 균형이 잘 맞습니다! 👏";
    return leftScore > rightScore
      ? "오른발 훈련이 필요해요! 🦶➡️"
      : "왼발 훈련이 필요해요! 🦶⬅️";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎯 측정 결과</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.label}>왼발</Text>
          <Text style={styles.score}>{leftScore}점</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>오른발</Text>
          <Text style={styles.score}>{rightScore}점</Text>
        </View>

        <Text style={styles.feedback}>{getFeedback()}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("ExerciseRecommendation")}
        >
          <Text style={styles.buttonText}>추천 운동 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("BalanceIntro")}
        >
          <Text style={styles.secondaryButtonText}>다시 측정하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 24,
  },
  scoreBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  score: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3182F6",
  },
  feedback: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 24,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#232222",
    fontSize: 15,
    fontWeight: "500",
  },
});
