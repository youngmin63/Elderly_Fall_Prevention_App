import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
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

export default function BalanceScreen({ navigation }) {
  const [summaryText, setSummaryText] = useState("로딩 중...");
  const [fullSummaryText, setFullSummaryText] = useState("");
  const [summaryItems, setSummaryItems] = useState([]);
  const [popularExercises, setPopularExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateYAnim = useState(new Animated.Value(20))[0];

  const fetchData = async () => {
    setLoading(true); // 로딩 시작
    let summaryOk = false;
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

      if (!input?.recentScores?.length) {
        setSummaryText("아직 균형 기록이 없습니다.");
      } else {
        // ✅ 요약 요청
        const summaryRes = await apiClient.post(
          `${AI_URL}/api/ai/summary?mode=list`,
          {
            recentScores: input.recentScores,
            leftScore: left,
            rightScore: right,
            percentile: 85,
            weakPart: "왼발 균형",
            strongPart: input.focusArea || "하체",
            recommendedExercise: input.history[0] || "의자 스쿼트",
          }
        );

        if (summaryRes.data.status === "success") {
          summaryOk = true;
          const summaryLines = summaryRes.data.summary
            .split("\n")
            .filter((l) => l.trim());

          const iconMap = {
            평균: "📈",
            또래: "👥",
            왼발: "🦶",
            오른발: "🦶",
            운동: "🏋️",
            분석: "🧠",
          };
          const items = summaryLines.map((line) => {
            let [label, ...rest] = line.split(":").map((s) => s.trim());
            const value = rest.join(":");
            // ✅ label에 불필요한 ' - ' 제거
            label = label.replace(/^[-–—]+\s*/, "").trim(); // '–'나 '—' 같은 특수 dash도 포함

            // ✅ "개선을 위한 추천 운동" → "추천 운동"으로 바꾸기
            if (label.includes("추천 운동")) {
              label = "추천 운동";
            }

            const icon =
              Object.entries(iconMap).find(([key]) =>
                label.includes(key)
              )?.[1] || "ℹ️";

            return {
              label,
              value,
              icon,
            };
          });

          setSummaryItems(items);
        }
      }

      // ✅ 인기 운동 요청 (항상 수행)
      const avgScore = (left + right) / 2;

      const popRes = await apiClient.post(`${AI_URL}/api/ai/popular`, {
        id: profile.id ?? 0,
        score: avgScore,
        age: profile.age ?? 0,
        gender: profile.gender === "여자" ? 1 : 0,
        recent_scores: input.recentScores || [],
        recent_intensity_avg: input.avgIntensity || 0,
        recent_duration_sum: input.totalDuration || 0,
        focus_area: input.focusArea || "하체",
        weeklyWorkoutCount:
          input.weeklyWorkoutCount || input.recentScores?.length || 1,
        history: input.history || [],
      });

      setPopularExercises(popRes.data?.popularExercises || []);
    } catch (e) {
      console.error("🔥 fetchData 에러:", e);
      if (!summaryOk) setSummaryText("데이터 로딩 실패");
    } finally {
      setLoading(false); // 무조건 끝에
    }
  };

  useEffect(() => {
    fetchData();

    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();

    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#3182F6" />
          <Text style={{ marginTop: 12, fontSize: 16, color: "#666" }}>
            데이터 불러오는 중...
          </Text>
        </View>
      ) : (
        <ScrollView>
          {/* 나의 밸런스 요약 카드 */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <Text style={styles.title}> 나의 밸런스 요약</Text>

            <View style={{ gap: 6 }}>
              {summaryItems
                .filter(
                  (item) =>
                    !item.label.includes("왼발") &&
                    !item.label.includes("오른발")
                )
                .map((item, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 16, marginRight: 6 }}>
                      {item.icon}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#374151",
                        width: 120,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {item.value || ""}
                    </Text>
                  </View>
                ))}
            </View>

            {/* 버튼 영역 조건 분기 */}
            {summaryText === "아직 균형 기록이 없습니다." && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "#6B7280",
                  marginBottom: 12,
                }}
              >
                현재 균형 기록이 없습니다.
              </Text>
            )}
            {summaryItems.find((item) => item.label.includes("추천 운동")) ? (
              <TouchableOpacity
                style={styles.tossButton}
                onPress={() => {
                  const exercise = summaryItems.find((item) =>
                    item.label.replace(/\s/g, "").includes("추천운동")
                  )?.value;
                  if (exercise) {
                    navigation.navigate("ExerciseDetail", {
                      exercise: { name: exercise },
                    });
                  }
                }}
              >
                <Text style={styles.tossButtonText}>추천 운동 시작하기</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.tossButton}
                onPress={() =>
                  navigation.navigate("BalanceManual", { foot: "left" })
                }
              >
                <Text style={styles.tossButtonText}>밸런스 측정하기</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* 밸런스 측정 / 운동하기 탭 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BalanceManual", { foot: "left" })
              }
              style={styles.tabButton}
            >
              <Text style={styles.tabButtonText}>밸런스 측정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ExerciseRecommendation")}
              style={styles.tabButton}
            >
              <Text style={styles.tabButtonText}>운동하기</Text>
            </TouchableOpacity>
          </View>

          {/* 이번 주 인기 운동 */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <Text style={styles.subText}>
              🔥 내 또래는 요즘 어떤 운동을 할까?
            </Text>
            {popularExercises.map(({ name }, idx) => (
              <View key={idx} style={styles.rankCard}>
                <Text style={styles.rankBadge}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"} {idx + 1}위
                </Text>
                <Text style={styles.exerciseName}>{name}</Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    navigation.navigate("ExerciseDetail", {
                      exercise: { name },
                    })
                  }
                >
                  <Text style={styles.startButtonText}>운동 시작</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      )}

      {/* 전체 요약 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>📋 전체 분석</Text>
            <Text style={styles.sheetText}>{fullSummaryText}</Text>
            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.sheetButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 56,
    marginTop: 40,
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#E6EAF2",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3182F6",
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  sheetText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  sheetButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  sheetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  rankCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankBadge: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    width: 60,
  },
  exerciseName: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
    color: "#111827",
  },
  startButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  tossButton: {
    backgroundColor: "#3182F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  tossButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 6,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1F2937",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F3F6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },

  miniCard: {
    borderRadius: 12,
    width: "48%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  verticalList: {
    gap: 10,
    marginTop: 12,
  },
  verticalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3182F6",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  verticalIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  verticalContent: {
    flex: 1,
  },
  verticalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  verticalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
