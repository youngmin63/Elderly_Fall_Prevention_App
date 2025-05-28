import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraBalanceMeasureScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (hasPermission === null) {
      requestPermission();
    }
  }, [hasPermission]);

  const startMeasurement = async () => {
    setIsMeasuring(true);

    // ✅ TODO: 여기에 MediaPipe Pose 로직 추가할 예정
    setTimeout(() => {
      const dummyScore = Math.floor(Math.random() * 50 + 50); // 테스트용 랜덤 점수
      setScore(dummyScore);
      setIsMeasuring(false);
      navigation.navigate("CameraBalanceResultScreen", {
        balanceScore: dummyScore,
      });
    }, 20000); // 20초 측정
  };

  if (hasPermission === null)
    return (
      <View style={styles.centered}>
        <Text>카메라 권한 요청 중...</Text>
      </View>
    );
  if (hasPermission.granted === false)
    return (
      <View style={styles.centered}>
        <Text>카메라 접근이 차단되었습니다.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>권한 재요청</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />
      {!isMeasuring ? (
        <TouchableOpacity style={styles.button} onPress={startMeasurement}>
          <Text style={styles.buttonText}>측정 시작</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#14AE5C" />
          <Text style={styles.loadingText}>20초 동안 측정 중...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#14AE5C",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loadingBox: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#fff", fontSize: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
