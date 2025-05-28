import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from "react-native";
import BackButton from "../BackButton";

import React from "react";

export default function BalanceManualScreen({ navigation, route }) {
  const { foot } = route.params;
  const nextFoot = foot === "left" ? "right" : "left";
  const ImageSource =
    foot === "right"
      ? require("../../assets/images/BalancePose2.png")
      : require("../../assets/images/BalancePose.png");

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧍‍♀️ 측정 전 자세 안내</Text>

        <View style={styles.videoBox}>
          <Image
            source={ImageSource}
            style={styles.fullImage}
            resizeMode="cover" // 또는 "stretch"
          />
        </View>

        <Text style={styles.instruction}>
          📱 휴대폰은 오른쪽 귀에 대 주세요.{"\n"}
          🦶{" "}
          {foot === "left"
            ? "왼발로 서서 오른발은 왼쪽 무릎 안쪽에 대 주세요."
            : "오른발로 서서 왼발은 오른쪽 무릎 안쪽에 대 주세요."}
          {"\n"}
          👁️ 눈을 감고 자세를 유지해 주세요.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BalanceTest2", { foot })}
        >
          <Text style={styles.buttonText}>이해했어요</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
  },
  content: {
    padding: 24,
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 20,
  },
  videoBox: {
    width: "100%",
    height: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  instruction: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 36,
  },
  button: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  // 새 스타일 정의
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
