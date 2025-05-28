import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AI_URL, apiClient } from "../../api/api";

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export default function AnalyzeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [leftScore, setLeftScore] = useState(null);
  const [rightScore, setRightScore] = useState(null);
  const [muscleArea, setMuscleArea] = useState([]);
  const [projection, setProjection] = useState(null);
  const [summary, setSummary] = useState("");
  const [balanceLabels, setBalanceLabels] = useState([]);
  const [balanceLeft, setBalanceLeft] = useState([]);
  const [balanceRight, setBalanceRight] = useState([]);
  const [input, setInput] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          inputRes,
          leftRes,
          rightRes,
          profileRes,
          workoutRes,
          balanceRes,
        ] = await Promise.all([
          apiClient.get("/api/analyze/recommend-input"),
          apiClient.get("/api/balance/latest?foot=left"),
          apiClient.get("/api/balance/latest?foot=right"),
          apiClient.get("/api/user/me"),
          apiClient.get("/api/workout/records/all"),
          apiClient.get("/api/balance/records"),
        ]);
        const input = inputRes.data;
        setInput(input); // 추가
        const left = leftRes.data.balanceScore;
        const right = rightRes.data.balanceScore;
        const workoutRecords = workoutRes.data || [];
        const balanceRecords = balanceRes.data || [];

        if (!workoutRecords.length && !balanceRecords.length) {
          setSummary("아직 기록이 없습니다. 첫 균형을 측정해보세요!");
          setLoading(false);
          return;
        }

        setLeftScore(left);
        setRightScore(right);
        setMuscleArea([input.focusArea]);

        const summaryRes = await apiClient.post(`${AI_URL}/api/ai/summary`, {
          recentScores: input.recentScores,
          leftScore: left,
          rightScore: right,
          percentile: 85,
          weakPart: "왼발 균형",
          strongPart: input.focusArea || "하체",
          recommendedExercise: input.history[0] || "의자 스쿼트",
        });
        setSummary(
          summaryRes.data.status === "success"
            ? summaryRes.data.summary
            : "요약 정보를 불러올 수 없습니다."
        );

        const projectionRes = await apiClient.post(
          `${AI_URL}/api/ai/projection`,
          { recentScores: input.recentScores }
        );
        if (projectionRes.data.status === "success") {
          setProjection(projectionRes.data.projection);
        }

        const durations = workoutRecords.map(
          (r) => Math.round((r.duration / 60) * 10) / 10
        );
        const intensities = workoutRecords.map((r) => r.intensityScore);
        const workoutLabels = workoutRecords.map(
          (_, i) => `#${workoutRecords.length - i}`
        );

        setChartData([durations, intensities]);
        setChartLabels(workoutLabels);

        const balanceDates = balanceRecords.map(
          (_, i) => `#${balanceRecords.length - i}`
        );
        const leftScores = balanceRecords
          .filter((r) => r.foot === "left")
          .map((r) => r.balanceScore);
        const rightScores = balanceRecords
          .filter((r) => r.foot === "right")
          .map((r) => r.balanceScore);

        setBalanceLabels(balanceDates);
        setBalanceLeft(leftScores);
        setBalanceRight(rightScores);
      } catch (e) {
        console.error("📉 데이터 요청 실패:", e);
        setSummary("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#3182F6"
          style={{ marginTop: 100 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 🧠 종합 분석 */}
        {summary ? (
          <View style={styles.card}>
            <Text style={styles.title}>🧠 종합 분석</Text>
            <Text style={styles.text}>{summary}</Text>
            {input?.recentScores?.length ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  navigation.navigate("ExerciseRecommendationResult")
                }
              >
                <Text style={styles.primaryButtonText}>
                  🏃 추천 운동 바로 시작
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("BalanceTestScreen")}
              >
                <Text style={styles.primaryButtonText}>
                  밸런스 측정하러 가기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* ⚖️ 내 균형 추이 */}
        {Array.isArray(balanceLeft) &&
          Array.isArray(balanceRight) &&
          balanceLeft.length > 0 &&
          balanceRight.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.title}>⚖️ 내 균형 추이</Text>
              <LineChart
                data={{
                  labels: balanceLabels,
                  datasets: [
                    {
                      data: balanceLeft,
                      color: (o = 1) => `rgba(49,130,246,${o})`,
                    },
                    {
                      data: balanceRight,
                      color: (o = 1) => `rgba(236,72,153,${o})`,
                    },
                  ],
                  legend: ["왼발", "오른발"],
                }}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
              <Text style={styles.axisHint}>
                ※ 오른쪽으로 갈수록 최근 회차입니다.
              </Text>
            </View>
          )}

        {/* 📊 최근 운동 분석 */}
        {Array.isArray(chartData[0]) && chartData[0].length > 0 && (
          <View style={styles.card}>
            <Text style={styles.title}>📊 최근 운동 분석</Text>
            <Text style={styles.subTitle}>⏱ 운동 시간 추이 (단위: 분)</Text>
            <LineChart
              data={{ labels: chartLabels, datasets: [{ data: chartData[0] }] }}
              width={Dimensions.get("window").width - 40}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
            />

            {Array.isArray(chartData[1]) && chartData[1].length > 0 && (
              <>
                <Text style={styles.subTitle}>🔥 운동 강도 추이</Text>
                <LineChart
                  data={{
                    labels: chartLabels,
                    datasets: [{ data: chartData[1] }],
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chart}
                />
              </>
            )}

            <Text style={styles.axisHint}>
              ※ 오른쪽으로 갈수록 최근 회차입니다.
            </Text>
          </View>
        )}

        {/* 📈 3주 뒤 예측 */}
        {projection ? (
          <View style={styles.card}>
            <Text style={styles.title}>📈 3주 뒤 예측</Text>
            <Text style={{ textAlign: "center", marginBottom: 8 }}>
              {projection.comment}
            </Text>
            <LineChart
              data={{
                labels: ["이본 주", "1주 뒤", "2주 뒤", "3주 뒤"],
                datasets: [
                  {
                    data: [
                      projection.week1 - 2,
                      projection.week1,
                      projection.week2,
                      projection.week3,
                    ],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(60, 179, 113, ${opacity})`,
                  },
                ],
              }}
              width={Dimensions.get("window").width - 40}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate("WorkoutHistoryScreen")}
        >
          <Text style={styles.outlineButtonText}>전체 기록 보기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F3F6", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 16, lineHeight: 22, marginBottom: 12 },
  subTitle: { fontSize: 15, fontWeight: "600", marginTop: 8, marginBottom: 4 },
  chart: { borderRadius: 12, marginVertical: 8 },
  primaryButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  outlineButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#3182F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#3182F6",
    fontSize: 16,
    fontWeight: "600",
  },
});
