import { Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import exerciseMeta from "../../exerciseMeta"; // 🔹 운동 정보 메타 불러오기
import BackButton from "../BackButton";

const { width } = Dimensions.get("window");

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;
  const meta = exerciseMeta[exercise.name] || {};

  const videoUrl = meta.videoUrl;
  const defaultCaution = `
  각 세트는 12회씩 반복합니다.
  각 세트를 마칠 때마다 해당 세트 버튼을 눌러 완료를 표시해주세요.`;

  const caution = `${defaultCaution}\n\n${meta.caution || ""}`;

  const [checkedSets, setCheckedSets] = useState([]);
  const [totalTimer, setTotalTimer] = useState(0);
  const [restVisible, setRestVisible] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const restTimerRef = useRef(null);
  const totalSets = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (restTimerRunning) {
      restTimerRef.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            clearInterval(restTimerRef.current);
            setRestVisible(false);
            setRestTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimerRef.current);
  }, [restTimerRunning]);

  const formatTime = (sec) => `00:${sec.toString().padStart(2, "0")}`;

  const toggleSetCheck = (set) => {
    const alreadyChecked = checkedSets.includes(set);
    const newCheckedSets = alreadyChecked
      ? checkedSets.filter((s) => s !== set)
      : [...checkedSets, set];

    setCheckedSets(newCheckedSets);

    if (!alreadyChecked && newCheckedSets.length === 1) {
      setRestTime(30);
      setRestVisible(true);
      setRestTimerRunning(true);
    }
  };

  const closeRest = () => {
    clearInterval(restTimerRef.current);
    setRestTimerRunning(false);
    setRestVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.totalTime}>{formatTime(totalTimer)}</Text>

      <Text style={styles.title}>{exercise.name}</Text>

      <View style={styles.videoBox}>
        {videoUrl ? (
          <Video
            source={videoUrl}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
        ) : (
          <Text style={styles.videoFallback}>⚠️ 영상 정보가 없습니다</Text>
        )}
      </View>

      <Text style={styles.caution}>⚠️ {caution}</Text>

      <View style={styles.setsBox}>
        {[1, 2].map((set) => (
          <TouchableOpacity key={set} onPress={() => toggleSetCheck(set)}>
            <View
              style={[
                styles.setCard,
                checkedSets.includes(set) && styles.setCardDone,
              ]}
            >
              <Text style={styles.setText}>{set}세트</Text>
              <Text style={styles.repText}>15회</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ 세트 모두 완료되었을 때만 운동 종료 버튼 표시 */}
      {checkedSets.length === totalSets && (
        <View style={styles.fixedBottom}>
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() =>
              navigation.navigate("ExerciseSummary", {
                exerciseName: exercise.name,
                totalTime: totalTimer,
                completedSets: checkedSets.length,
              })
            }
          >
            <Text style={styles.completeText}>운동 종료</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={restVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>⏸ 휴식 타이머</Text>
            <Text style={styles.modalTimer}>{formatTime(restTime)}</Text>

            <View style={styles.adjustBox}>
              <TouchableOpacity
                onPress={() => setRestTime((t) => Math.max(t - 10, 0))}
              >
                <Text style={styles.adjustBtn}>-10초</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRestTime((t) => t + 10)}>
                <Text style={styles.adjustBtn}>+10초</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={closeRest} style={styles.stopBtn}>
              <Text style={styles.stopText}>휴식 중단</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  totalTime: {
    position: "absolute",
    top: 40,
    left: 20,
    fontSize: 15,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#232222",
    textAlign: "center",
    marginTop: 20,
  },
  videoBox: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E5EAF2",
    elevation: 2,
  },
  video: {
    width: "100%",

    height: 380, // 기존 240 → 320으로 증가
    backgroundColor: "#000", // 배경 깔끔하게
  },
  videoFallback: {
    fontSize: 16,
    padding: 40,
    textAlign: "center",
    color: "#999",
  },
  caution: {
    fontSize: 14,
    color: "#D35400",
    textAlign: "center",
    marginTop: 8,
  },
  setsBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    
    marginBottom: 30,
  },
  setCard: {
    width: width * 0.4,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  setCardDone: {
    backgroundColor: "#D0E8FF",
    borderColor: "#3182F6",
  },
  setText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
    fontWeight: "500",
  },
  repText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  fixedBottom: {
    position: "absolute",
    bottom: 36,
    left: 20,
    right: 20,
  },
  completeBtn: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  modalTimer: {
    fontSize: 48,
    color: "#000",
    fontVariant: ["tabular-nums"],
    marginBottom: 16,
  },
  adjustBox: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 18,
  },
  adjustBtn: {
    fontSize: 16,
    color: "#3182F6",
    fontWeight: "500",
  },
  stopBtn: {
    backgroundColor: "#EB5757",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  stopText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
