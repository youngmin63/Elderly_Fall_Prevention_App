import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Accelerometer, Gyroscope } from "expo-sensors";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../BackButton";
import { apiClient } from "../../api/api"; // baseURL 통합된 axios 인스턴스 사용

export default function BalanceTestScreen2({ navigation, route }) {
  const { foot = "left" } = route.params;
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [timer, setTimer] = useState(0);

  const gyroData = useRef([]);
  const accelData = useRef([]);
  const gyroRef = useRef(null);
  const accelRef = useRef(null);
  const timerRef = useRef(null);
  const lastTap = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      Speech.stop();
      clearInterval(timerRef.current);
      gyroRef.current?.remove();
      accelRef.current?.remove();
    };
  }, []);

  const speak = (text, onDone) => {
    Speech.speak(text, {
      rate: 0.5,
      pitch: 1.2,
      language: "ko-KR",
      onDone,
    });
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      isMeasuring ? stopMeasurement() : startPreCountdown();
    }
    lastTap.current = now;
  };

  const startPreCountdown = () => {
    speak("눈을 감고 자세를 유지해 주세요.", () => {
      speak("3...", () => {
        speak("2...", () => {
          speak("1...", () => {
            speak("시작!", () => {
              startMeasurement();
            });
          });
        });
      });
    });
  };

  const startMeasurement = () => {
    setIsMeasuring(true);
    setTimer(0);
    gyroData.current = [];
    accelData.current = [];

    Gyroscope.setUpdateInterval(50);
    Accelerometer.setUpdateInterval(50);

    gyroRef.current = Gyroscope.addListener((data) =>
      gyroData.current.push(data)
    );
    accelRef.current = Accelerometer.addListener((data) =>
      accelData.current.push(data)
    );

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev + 1 >= 20) stopMeasurement();
        return prev + 1;
      });
    }, 1000);
  };

  const calculateScore = () => {
    const gyroInstability =
      gyroData.current.reduce(
        (sum, { x, y, z }) =>
          sum + Math.abs(x) + Math.abs(y) + 1.5 * Math.abs(z),
        0
      ) / gyroData.current.length;

    const accelInstability =
      accelData.current.reduce(
        (sum, { x, y, z }) =>
          sum + Math.abs(Math.sqrt(x * x + y * y + z * z) - 1),
        0
      ) / accelData.current.length;

    const rawScore = 100 - (gyroInstability * 10 + accelInstability * 50);
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  };

  const stopMeasurement = async () => {
    clearInterval(timerRef.current);
    gyroRef.current?.remove();
    accelRef.current?.remove();
    setIsMeasuring(false);

    const score = calculateScore();
    const getLocalISODate = () => {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      return new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
    };

    try {
      const token = await AsyncStorage.getItem("token");
      const gender = await AsyncStorage.getItem("gender");
      const age = await AsyncStorage.getItem("age");
      await apiClient.post("/api/balance/save", {
        date: getLocalISODate(),
        balanceScore: score,
        gender,
        age,
        duration: timer,
        foot,
        gyro: gyroData.current,
        accel: accelData.current,
      });
    } catch (e) {
      console.log("서버 저장 실패:", e);
    }

    if (foot === "left") {
      await AsyncStorage.setItem("leftScore", String(score));
      navigation.navigate("BalanceManual", { foot: "right" });
    } else {
      const leftScore = await AsyncStorage.getItem("leftScore");
      navigation.navigate("BalanceResult", {
        leftScore: Number(leftScore) || 0,
        rightScore: score,
      });
      await AsyncStorage.removeItem("leftScore");
    }
  };

  return (
    
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      
      <SafeAreaView style={styles.container}>
      <BackButton />
        <View style={styles.center}>
          {isMeasuring ? (
            <View style={styles.measureContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    { width: `${(timer / 20) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.timerCircle}>
                <Text style={styles.timerLabel}>측정 중</Text>
                <Text style={styles.timer}>{timer}초</Text>
              </View>
            </View>
          ) : (
            <Animated.View style={[styles.guideCircle, { opacity: fadeAnim }]}>
              <Text style={styles.guideText}>📱 휴대폰을 귀에 댄 후</Text>
              <Text style={styles.guideTextBold}>화면을 두 번 터치하세요</Text>
            </Animated.View>
          )}
        </View>
        <Text style={styles.notice}>
          ※ 소리가 안 들리면 볼륨과 무음 모드를 확인하세요.
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F3F6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  guideCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  guideText: { fontSize: 16, color: "#555" },
  guideTextBold: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3182F6",
    marginTop: 8,
  },
  measureContainer: { alignItems: "center", gap: 24 },
  progressBarBackground: {
    width: 260,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#3182F6",
    borderRadius: 4,
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  timerLabel: { fontSize: 16, color: "#666", marginBottom: 4 },
  timer: { fontSize: 48, fontWeight: "bold", color: "#3182F6" },
  notice: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});
