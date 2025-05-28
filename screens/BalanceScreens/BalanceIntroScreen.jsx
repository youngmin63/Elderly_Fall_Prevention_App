import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BalanceIntroScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>📋 밸런스 측정 안내</Text>

        <View style={styles.instructions}>
          <Text style={styles.instruction}>
            ・한 발로 20초 동안 균형을 유지해요.
          </Text>
          <Text style={styles.instruction}>
            ・센서로 흔들림을 정밀하게 측정해요.
          </Text>
          <Text style={styles.instruction}>
            ・반드시 눈을 감고 자세를 유지해 주세요.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("BalanceManual", { foot: "left" })}
        >
          <Text style={styles.startButtonText}>측정 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 32,
  },
  instructions: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 32,
  },
  instruction: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
